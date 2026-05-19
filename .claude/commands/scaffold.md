# /scaffold

Scaffold a new project or component from a description.

## Usage

```
/scaffold [description]
```

Examples:
```
/scaffold FastAPI REST API with JWT auth and PostgreSQL
/scaffold Python CLI tool for CSV processing with click
/scaffold React component for paginated data table
```

## Instructions

Given `$ARGUMENTS` (a natural-language description of what to build):

1. **Analyze the description** and identify:
   - Language / framework
   - Core features needed
   - External dependencies

2. **Create the directory structure** — show it as a tree first, confirm with user if complex.

3. **Generate all scaffold files**:
   - Entry point / main file
   - Configuration files (requirements.txt / package.json / pyproject.toml)
   - At least one working example showing the core feature
   - A README.md with setup and usage instructions

4. **Make it runnable**: after scaffolding, run the install command and verify it starts without errors.

5. **Report**: list created files and the command to run the project.

Use minimal dependencies. Prefer standard library where possible.
