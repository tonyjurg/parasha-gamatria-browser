# Local validation

## Source-Independent Checks

Run `python -m pytest -q` and `node --test tests/*.test.js` from the repository.
These suites use committed exports, synthetic TF APIs and mocked downloads;
they do not require private repositories, network access or data regeneration.
The code-quality workflow runs the full Python suite on Linux Python 3.11/3.13
and Windows Python 3.13, alongside JavaScript tests and both linters.

Checks include all 54 schema-2 files and catalogue SHA-256 values, complete Torah
coverage, readable schema-1 expansion identity/idempotence, lossless compaction,
and malformed-record rejection in optimized Python subprocesses. Checksum and
round-trip failures are tested under normal Python and `python -O`, including
failure on a later file before any previously prepared file is replaced.
Synthetic exports cover absent, explicitly empty and nonempty qere readings.
Notebook validation is unconditional even when Python optimization is enabled.
