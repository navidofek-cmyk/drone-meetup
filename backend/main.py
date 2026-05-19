from fastapi import FastAPI, HTTPException, Depends, Query, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, Literal
from datetime import datetime
import uuid
import os

ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "dev-secret-token")

app = FastAPI(title="Drone Meetup Platform CZ", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- In-memory stores ---
locations: dict[str, dict] = {}
pilots: dict[str, dict] = {}
events: dict[str, dict] = {}
presentations: dict[str, dict] = {}
rsvps: dict[str, list] = {}          # event_id -> list of rsvp dicts
cff_submissions: dict[str, dict] = {}


# --- Auth dependency ---
def require_admin(x_admin_token: str = Header(default="")):
    if x_admin_token != ADMIN_TOKEN:
        raise HTTPException(status_code=403, detail="Admin access required")


# --- Pydantic models ---

class LocationCreate(BaseModel):
    name: str
    description: str
    venue_type: Literal["letiště", "louka", "závodiště", "hospoda", "sál"]
    gps_lat: Optional[float] = None
    gps_lon: Optional[float] = None
    surface: Optional[str] = None   # tráva / beton / asfalt / voda — není u hospod
    rules: Optional[str] = None
    city: str
    slug: str


class PilotCreate(BaseModel):
    name: str
    bio: str
    slug: str
    license_type: Literal["A1/A3", "A2", "STS", "žádná"]
    drone_types: str          # comma-separated, e.g. "FPV racing, freestyle"
    photo_url: Optional[str] = None


class EventCreate(BaseModel):
    title: str
    description: str
    date: str
    location_id: str
    event_type: Literal["fly-in", "pouštění dronů", "povídání v hospodě", "přednáška", "závod"]
    capacity: int = 50

    @field_validator("date")
    @classmethod
    def validate_date(cls, v):
        try:
            datetime.strptime(v, "%Y-%m-%d")
        except ValueError:
            raise ValueError("date must be in YYYY-MM-DD format")
        return v


class RsvpCreate(BaseModel):
    email: EmailStr
    name: str


class PresentationCreate(BaseModel):
    title: str
    description: str
    pilot_id: str
    event_id: str
    item_type: Literal["let", "přednáška", "video", "workshop"]
    duration_minutes: int = 30


class CffSubmission(BaseModel):
    name: str
    email: EmailStr
    pilot_description: str
    drone_type: str
    license_type: Literal["A1/A3", "A2", "STS", "žádná"]


# ============================================================
# Locations
# ============================================================

@app.get("/api/locations")
def list_locations():
    return list(locations.values())


@app.post("/api/locations", status_code=201)
def create_location(body: LocationCreate):
    if any(loc["slug"] == body.slug for loc in locations.values()):
        raise HTTPException(400, "Slug already exists")
    lid = str(uuid.uuid4())
    location = {"id": lid, **body.model_dump()}
    locations[lid] = location
    return location


@app.get("/api/locations/{slug}")
def get_location(slug: str):
    location = next((loc for loc in locations.values() if loc["slug"] == slug), None)
    if not location:
        raise HTTPException(404, "Location not found")
    return location


# ============================================================
# Pilots
# ============================================================

@app.get("/api/pilots")
def list_pilots():
    return list(pilots.values())


@app.post("/api/pilots", status_code=201)
def create_pilot(body: PilotCreate):
    if any(p["slug"] == body.slug for p in pilots.values()):
        raise HTTPException(400, "Slug already exists")
    pid = str(uuid.uuid4())
    pilot = {"id": pid, **body.model_dump()}
    pilots[pid] = pilot
    return pilot


@app.get("/api/pilots/{slug}")
def get_pilot(slug: str):
    pilot = next((p for p in pilots.values() if p["slug"] == slug), None)
    if not pilot:
        raise HTTPException(404, "Pilot not found")
    pilot_presentations = [pr for pr in presentations.values() if pr["pilot_id"] == pilot["id"]]
    return {**pilot, "presentations": pilot_presentations}


# ============================================================
# Events
# ============================================================

@app.get("/api/events")
def list_events(
    location_id: Optional[str] = Query(None),
    event_type: Optional[str] = Query(None),
    archived: Optional[bool] = Query(None),
):
    result = list(events.values())
    if location_id:
        result = [e for e in result if e["location_id"] == location_id]
    if event_type:
        result = [e for e in result if e["event_type"] == event_type]
    if archived is not None:
        result = [e for e in result if e["archived"] == archived]
    return sorted(result, key=lambda e: e["date"], reverse=True)


@app.post("/api/events", status_code=201)
def create_event(body: EventCreate):
    if body.location_id not in locations:
        raise HTTPException(404, "Location not found")
    eid = str(uuid.uuid4())
    event = {
        "id": eid,
        **body.model_dump(),
        "archived": False,
        "created_at": datetime.now().isoformat(),
    }
    events[eid] = event
    rsvps[eid] = []
    return event


@app.get("/api/events/{event_id}")
def get_event(event_id: str):
    if event_id not in events:
        raise HTTPException(404, "Event not found")
    event = events[event_id]
    location = locations.get(event["location_id"])
    return {
        **event,
        "attendees": len(rsvps.get(event_id, [])),
        "location": location,
    }


@app.patch("/api/events/{event_id}/archive")
def archive_event(event_id: str, _=Depends(require_admin)):
    if event_id not in events:
        raise HTTPException(404, "Event not found")
    events[event_id]["archived"] = True
    return events[event_id]


# ============================================================
# RSVP
# ============================================================

@app.post("/api/events/{event_id}/rsvp", status_code=201)
def confirm_rsvp(event_id: str, body: RsvpCreate):
    if event_id not in events:
        raise HTTPException(404, "Event not found")
    event = events[event_id]
    if event["archived"]:
        raise HTTPException(400, "Event is archived")
    if len(rsvps[event_id]) >= event["capacity"]:
        raise HTTPException(400, "Event is full")
    if any(r["email"] == body.email for r in rsvps[event_id]):
        raise HTTPException(400, "Already registered")
    token = str(uuid.uuid4())
    rsvps[event_id].append({"email": body.email, "name": body.name, "token": token})
    return {"message": "RSVP confirmed", "token": token}


@app.delete("/api/events/{event_id}/rsvp/{token}")
def cancel_rsvp(event_id: str, token: str):
    if event_id not in events:
        raise HTTPException(404, "Event not found")
    before = len(rsvps[event_id])
    rsvps[event_id] = [r for r in rsvps[event_id] if r["token"] != token]
    if len(rsvps[event_id]) == before:
        raise HTTPException(404, "RSVP not found")
    return {"message": "RSVP cancelled"}


# ============================================================
# Program (presentations)
# ============================================================

@app.get("/api/events/{event_id}/program")
def list_program(event_id: str):
    if event_id not in events:
        raise HTTPException(404, "Event not found")
    items = [pr for pr in presentations.values() if pr["event_id"] == event_id]
    return items


@app.post("/api/presentations", status_code=201)
def create_presentation(body: PresentationCreate):
    if body.pilot_id not in pilots:
        raise HTTPException(404, "Pilot not found")
    if body.event_id not in events:
        raise HTTPException(404, "Event not found")
    prid = str(uuid.uuid4())
    presentation = {"id": prid, **body.model_dump()}
    presentations[prid] = presentation
    return presentation


# ============================================================
# Stats
# ============================================================

@app.get("/api/stats")
def get_stats():
    return {
        "events": len(events),
        "pilots": len(pilots),
        "locations": len(locations),
        "cff_pending": sum(1 for s in cff_submissions.values() if s["status"] == "pending"),
    }


# ============================================================
# Call for Flyers (CFF)
# ============================================================

@app.post("/api/cff", status_code=201)
def submit_cff(body: CffSubmission):
    sid = str(uuid.uuid4())
    submission = {
        "id": sid,
        **body.model_dump(),
        "status": "pending",
        "submitted_at": datetime.now().isoformat(),
    }
    cff_submissions[sid] = submission
    return {"message": "Přihláška přijata", "id": sid}


@app.get("/api/admin/cff")
def list_cff(_=Depends(require_admin)):
    return list(cff_submissions.values())


@app.patch("/api/admin/cff/{submission_id}/approve")
def approve_cff(submission_id: str, _=Depends(require_admin)):
    if submission_id not in cff_submissions:
        raise HTTPException(404, "Submission not found")
    cff_submissions[submission_id]["status"] = "approved"
    return cff_submissions[submission_id]


# ============================================================
# Seed
# ============================================================

@app.post("/api/seed", status_code=201)
def seed():
    """Populate the in-memory store with sample Czech drone-meetup data."""

    # --- Locations ---
    lid1 = str(uuid.uuid4())
    locations[lid1] = {
        "id": lid1,
        "name": "Letiště Medlánky",
        "description": (
            "Travnaté modelářské letiště v severozápadní části Brna, provozované "
            "Aeroklubem Brno-Medlánky. Vhodné pro letouny, vrtulníky i drony. "
            "Dobré zázemí, parkování na místě."
        ),
        "venue_type": "letiště",
        "gps_lat": 49.2350,
        "gps_lon": 16.5580,
        "surface": "tráva",
        "rules": (
            "Maximální výška letu 120 m AGL dle nařízení CAA/EU. Povinná registrace "
            "pilota. Koordinace s ATC při NOTAM."
        ),
        "city": "Brno",
        "slug": "letiste-medlanky",
    }

    lid2 = str(uuid.uuid4())
    locations[lid2] = {
        "id": lid2,
        "name": "Louka u Svratky",
        "description": (
            "Volná louka u řeky Svratky v Pisárkách — oblíbené neformální místo "
            "brněnských dronistů pro trénink a pouštění FPV. Žádný poplatek, "
            "dobrý příjezd autem i MHD."
        ),
        "venue_type": "louka",
        "gps_lat": 49.1830,
        "gps_lon": 16.5760,
        "surface": "tráva",
        "rules": (
            "Max. výška 120 m AGL, kategorie Open A1/A3. FPV s pozorovatelem. "
            "Neletět nad chodci. Respektovat okolní zástavbu."
        ),
        "city": "Brno",
        "slug": "louka-svratka",
    }

    lid3 = str(uuid.uuid4())
    locations[lid3] = {
        "id": lid3,
        "name": "Hospoda U Černého orla",
        "description": (
            "Útulná pivnice v centru Brna s velkou zadní místností — naše domovská "
            "základna pro neformální povídání, projekce videí a plánování akcí. "
            "Výborné pivo, přátelský personál."
        ),
        "venue_type": "hospoda",
        "gps_lat": 49.1950,
        "gps_lon": 16.6080,
        "surface": None,
        "rules": None,
        "city": "Brno",
        "slug": "hospoda-cerny-orel",
    }

    # --- Pilots ---
    pid1 = str(uuid.uuid4())
    pilots[pid1] = {
        "id": pid1,
        "name": "Tomáš Krejčí",
        "bio": (
            "Závodní FPV pilot s pětilety zkušenostmi. Účastník Czech Drone League "
            "a MultiGP regionálních závodů. Staví vlastní freestyle a závodní quady, "
            "přednáší o elektronice a nastavení PID kontrolérů."
        ),
        "slug": "tomas-krejci",
        "license_type": "A2",
        "drone_types": "FPV racing, freestyle, long-range",
        "photo_url": None,
    }

    pid2 = str(uuid.uuid4())
    pilots[pid2] = {
        "id": pid2,
        "name": "Markéta Horáčková",
        "bio": (
            "Profesionální fotografka a certifikovaná pilotka dronů specializující "
            "se na leteckou fotografii a videografii. Natáčí pro reklamní agentury "
            "a cestovní magazíny. Propagátorka bezpečného a zodpovědného létání."
        ),
        "slug": "marketa-horackova",
        "license_type": "A1/A3",
        "drone_types": "DJI Mavic, aerial photography, cinematic",
        "photo_url": None,
    }

    # --- Events ---
    eid1 = str(uuid.uuid4())
    events[eid1] = {
        "id": eid1,
        "title": "Fly-in Medlánky — otevřené létání",
        "description": (
            "Otevřené setkání na letišti Medlánky. Volné létání pro všechny kategorie, "
            "ukázky FPV racingu i aerial fotografie. Vstup zdarma, přivítáme piloty "
            "i zvědavé nováčky."
        ),
        "date": "2025-07-12",
        "location_id": lid1,
        "event_type": "fly-in",
        "capacity": 80,
        "archived": False,
        "created_at": datetime.now().isoformat(),
    }
    rsvps[eid1] = []

    eid2 = str(uuid.uuid4())
    events[eid2] = {
        "id": eid2,
        "title": "Volné pouštění dronů — Louka u Svratky",
        "description": (
            "Neformální odpolední session na louce u Svratky. Každý letí co chce — "
            "FPV, freestyle, aerial foto. Sraz u velkého dubu, koordinaci zajistí "
            "Tomáš Krejčí."
        ),
        "date": "2025-08-02",
        "location_id": lid2,
        "event_type": "pouštění dronů",
        "capacity": 30,
        "archived": False,
        "created_at": datetime.now().isoformat(),
    }
    rsvps[eid2] = []

    eid3 = str(uuid.uuid4())
    events[eid3] = {
        "id": eid3,
        "title": "Povídání o dronech u piva",
        "description": (
            "Neformální setkání v hospodě U Černého orla. Markéta ukáže záběry z letní "
            "sezóny, Tomáš promítne závodní footage z Czech Drone League. Pak volná "
            "diskuze — regulace, tipy na místa, nové drony."
        ),
        "date": "2025-08-23",
        "location_id": lid3,
        "event_type": "povídání v hospodě",
        "capacity": 25,
        "archived": False,
        "created_at": datetime.now().isoformat(),
    }
    rsvps[eid3] = []

    # --- Presentations ---
    prid1 = str(uuid.uuid4())
    presentations[prid1] = {
        "id": prid1,
        "title": "FPV závodní drony od základů",
        "description": (
            "Přednáška pokrývá stavbu závodního quadu, výběr komponent, "
            "nastavení Betaflight a první kroky v závodění na tratích."
        ),
        "pilot_id": pid1,
        "event_id": eid2,
        "item_type": "přednáška",
        "duration_minutes": 45,
    }

    prid2 = str(uuid.uuid4())
    presentations[prid2] = {
        "id": prid2,
        "title": "Aerial foto & video: od vzletu k výsledku",
        "description": (
            "Markéta provede celým procesem letecké fotografické zakázky – "
            "plánování letu, nastavení kamery, postprodukce a legální aspekty "
            "komerčního létání v ČR."
        ),
        "pilot_id": pid2,
        "event_id": eid2,
        "item_type": "přednáška",
        "duration_minutes": 40,
    }

    return {
        "message": "Seed data úspěšně vytvořena",
        "locations": [locations[lid1], locations[lid2], locations[lid3]],
        "pilots": [pilots[pid1], pilots[pid2]],
        "events": [events[eid1], events[eid2], events[eid3]],
        "presentations": [presentations[prid1], presentations[prid2]],
    }
