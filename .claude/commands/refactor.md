# /refactor

Refactor the specified file for clarity, performance, or a given goal.

## Usage

```
/refactor [file_path]
/refactor [file_path] -- [goal]
```

Examples:
```
/refactor src/parser.py
/refactor src/db.py -- extract connection pooling into separate class
/refactor src/utils.py -- improve performance of string operations
```

## Instructions

Given `$ARGUMENTS` (file path and optional goal after `--`):

1. **Read the file** fully.
2. **Identify refactoring opportunities**:
   - Dead code, duplicated logic, magic numbers
   - Functions doing too many things (split by single responsibility)
   - Inefficient patterns (repeated lookups, redundant computation)
   - Poor naming
3. **If a specific goal** was given after `--`, focus exclusively on that goal.
4. **Apply the refactoring** by editing the file. Preserve all public API signatures.
5. **Show a diff summary**: list each change and the reason for it.
6. **Verify** nothing is broken by running any existing tests:
   ```bash
   python3 -m pytest tests/ -q 2>/dev/null || echo "No tests found"
   ```

Do NOT add features. Do NOT change behavior. Only improve internal structure.
