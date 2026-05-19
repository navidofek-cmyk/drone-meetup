# /explain-code

Explain how the specified code works, with diagrams and examples.

## Usage

```
/explain-code [file_path]
/explain-code [file_path]:[start_line]-[end_line]
```

## Instructions

Given `$ARGUMENTS` (a file or line range):

1. **Read the code** at the specified location.
2. **Provide explanation in layers**:

   ### What it does (1 paragraph)
   Plain-English summary of the overall purpose.

   ### How it works (step by step)
   Number each logical step. Reference specific line numbers.

   ### Key data structures
   For each important variable/structure: name, type, what it holds, why it exists.

   ### Control flow diagram (ASCII)
   Draw an ASCII flowchart or sequence diagram showing the execution path.

   ### Example walkthrough
   Trace through one concrete example with real values, showing state at each step.

   ### Gotchas & non-obvious parts
   List anything that would surprise a reader unfamiliar with this code.

Adjust depth to the complexity of the code. Simple functions need only 3-4 sentences.
