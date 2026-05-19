# /generate-tests

Generate comprehensive unit tests for the specified file or function.

## Usage

```
/generate-tests [file_path]
/generate-tests [file_path]::[function_name]
```

## Instructions

You are a test engineer. Given `$ARGUMENTS` (a file path, optionally with `::function_name`):

1. **Read the source file** to understand all public functions, classes, and their contracts.
2. **Identify test cases** for each function:
   - Happy path (valid inputs, expected outputs)
   - Edge cases (empty input, zero, None, boundary values)
   - Error cases (invalid types, out-of-range, exceptions expected)
3. **Generate pytest tests** that:
   - Use `pytest.mark.parametrize` for data-driven tests
   - Use `pytest.raises` for expected exceptions
   - Are fully self-contained (no external dependencies unless mocked)
   - Follow naming: `test_<function>_<scenario>`
4. **Write the test file** to `tests/test_<original_filename>.py`
5. **Run the tests** with `python3 -m pytest tests/test_<filename>.py -v` and report results.

Use only the standard library and pytest. If the source uses external libraries, mock them with `unittest.mock`.
