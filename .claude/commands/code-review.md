# /code-review

Perform a thorough code review of the specified file or the last modified files.

## Usage

```
/code-review [file_path]
/code-review              # reviews staged/unstaged changes
```

## Instructions

You are acting as a senior software engineer performing a code review. Given the file(s) specified by `$ARGUMENTS` (or recent git diff if no argument provided):

1. **Read the file(s)** using the filesystem MCP or Read tool.
2. **Check for the following** and report each category separately:
   - **Correctness**: Logic errors, off-by-one, null dereferences, unhandled edge cases
   - **Security**: Injection risks, exposed secrets, unsafe deserialization, OWASP Top 10
   - **Performance**: N+1 queries, unnecessary allocations, blocking I/O in hot paths
   - **Readability**: Unclear names, missing type hints, over-complex expressions
   - **Test coverage**: Identify untested paths and suggest specific test cases
3. **Output format**:
   - Start with a one-sentence overall verdict (LGTM / Needs minor changes / Needs major changes)
   - Use `### Category` headers for each section
   - For each issue: file:line — description — suggested fix
   - End with a "Top 3 priority fixes" list

If no file is specified, run `git diff HEAD` to get the current changes and review those.
