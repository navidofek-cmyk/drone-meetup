# 🚁 DroneBrno — Meetup platforma pro dronové nadšence

Webová aplikace pro organizaci setkání dronové komunity. Správa míst (letiště, louky, hospody), eventů, pilotů a přihlášek.

## Ukázkový projekt

Tento projekt vznikl jako **živá ukázka** kódovacího agenta Claude Code s MCP servery, Skills a Subagenty.

> **Nastavení agenta:** [github.com/navidofek-cmyk/mcp-skills-subagents](https://github.com/navidofek-cmyk/mcp-skills-subagents)

## Technologie

- **Backend:** FastAPI (Python) + in-memory store
- **Frontend:** React + Vite + React Router
- **Deploy:** Docker Compose (nginx proxy)

## Spuštění

```bash
docker compose up -d
curl -X POST http://localhost:8000/api/seed
```

Otevři **http://localhost/** v prohlížeči.

## Funkce

| Stránka | Popis |
|---------|-------|
| Akce | Seznam eventů s barevnými badges (✈️ fly-in, 🚁 pouštění dronů, 🍺 hospoda...) |
| Místa | Letiště, louky a hospody s GPS souřadnicemi |
| Piloti | Profily pilotů s licencí a typy dronů |
| Program | Přednášky, videa a ukázky letů |
| Call for Flyers | Formulář pro přihlášení nového pilota |
