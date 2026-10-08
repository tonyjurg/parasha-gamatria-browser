# Parasha Gematria Browser

A static, interactive reader for exploring gematria in the 54 individual Torah portions. Choose a parasha, numerical method, text representation and reading. Click a Hebrew word to find every matching verse, sentence, clause or phrase **within that parasha**. Or find passages containing at least two words with the same value.

## Try the browser locally

The generated dataset is included: **54 compact JSON files** in `site/data`, plus a JavaScript catalogue. Shared strings, forms and numerical arrays are stored once per portion and expanded by the browser when loaded. The JSON totals 15.4 MB, a 71.9% reduction from the readable export with glosses. No Python or Text-Fabric runs in the browser, and there are no external JavaScript dependencies, tracking scripts or fonts.

From this repository, run:

```console
python -m http.server 8767 --bind 127.0.0.1 --directory site
```

Open **http://127.0.0.1:8767/**. Use an HTTP server; opening `index.html` directly as a file prevents browser data loading.

Choose **Browser guide** in the header, or open `info.html` on the same site, for a step-by-step guide to the settings, displays, searches and methods.

- **Whole word** is the default. Attached BHSA parts are combined and counted once.
- **Word part** calculates separately for each BHSA word unit, which may be an attached prefix.
- **Dictionary form** uses the gematria of the BHSA lexeme while displaying the actual text.
- **As written / as read** chooses ketiv or recorded qere. Qere falls back to ketiv where no explicit reading exists.
- **Find shared values** requires at least two occurrences in the same selected structural unit. Identical spellings count unless “Require different spellings” is enabled. In dictionary mode this compares dictionary forms.
- Matching words are highlighted. All results remain available through “Show more results”; the text is browsable in pages of 12 verses, with a direct verse selector.
- **Show glosses** and **Show word values** optionally display lexical meanings and numbers beside the Hebrew text.
- **Box phrases** and **Box clauses** independently outline BHSA structures, including glosses and values when enabled.
- Each verse links to its corresponding passage on SHEBANQ in a new tab.

## Generate the data with the notebook

Open [create_parasha_json.ipynb](create_parasha_json.ipynb). Its linked contents and return links cover setup, source verification, inspection (including glosses), compact export, and validation. Running every code cell exports all 54 portions using schema 2. Its Python helper is a local script, not an installable package.

```console
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install --require-hashes --only-binary=:all: -r requirements-dev.txt
python export_parashot.py
```

These commands use Windows PowerShell. On Linux/macOS, activate with `source .venv/bin/activate` instead. Jupyter can be installed separately with `python -m pip install jupyterlab`.

BHSA TF files are downloaded freshly on every run from the pinned revision of
[ETCBC/bhsa](https://github.com/ETCBC/bhsa). Every downloaded file is verified
against `source-lock.json` before Text-Fabric loads it. Temporary downloaded
files and their Text-Fabric compiled data are removed when the loaded API is
released or the process exits; no existing
BHSA cache is used. An internet connection is required for regeneration.

The other source locations are sibling repositories:

| Source | Location |
|---|---|
| BHSA 2021 | Fresh download from the pinned ETCBC/bhsa commit |
| Generated gematria_TF 0.2.0 | `../gematria_TF/tf/2021` |
| BHSaddons | `../BHSaddons/tf/2021` |

Override the local repositories with `--gematria` and `--addons`. A local `--bhsa` override is not supported. The exact revisions and canonical LF checksums are pinned in [source-lock.json](source-lock.json). Files that differ are rejected. The source gematria repository is private; an authorized checkout is required for regeneration. The already exported static site does not require access to that repository.

The exporter reads the numerical TF features, rather than reimplementing the five numerical methods. It uses BHSaddons `parashanum`, `parashatrans` and `parashahebr` for portion boundaries and names. It validates that all Torah word units occur exactly once across 54 portions. BHSaddons `parashaverse` is preserved when available; missing or inconsistent source verse counters are audited in `site/data/catalogue.js`, and navigation follows the BHSA verse order.

## Interpretation and boundaries

The five methods are Mispar Hechrechi, Gadol, Sidduri, Katan, and Katan Mispari. The included gematria files use the identity transformation. Vowels/cantillation are shown but do not count. See the [gematria_TF method documentation](https://github.com/tonyjurg/gematria_TF/blob/main/docs/methods.md) for precise conventions.

Sentences, clauses and phrases use BHSA structural nodes and explicit word membership, including discontinuous units. They are not inferred from punctuation or verse boundaries. If a unit crosses a parasha boundary, only its words within that parasha are exported; the result is marked as clipped. When calculating whole words, only complete word groups inside the chosen unit count as matches. Partial groups remain visible as context. This avoids attributing a whole-word value to a phrase containing only its prefix.

Whole-form boundaries come from gematria_TF, which stops at nonempty trailers (including maqaf) and verse boundaries. Stored full-form values repeat across constituent BHSA slots; the browser deduplicates these before matching. Empty readings and unavailable values do not count as words. `None`/JSON `null` never becomes zero. All searches concern the selected parasha; the 54 individual portions are not a reading-calendar scheduler.

## Data format and provenance

[docs/data-format.md](docs/data-format.md) describes the JSON schema. `site/data/01.json` through `54.json` are the only parasha JSON files. The ES-module `catalogue.js` lists names, ranges, counts and per-file checksums, plus source revisions and licenses. This is deliberately a JavaScript index so that the static dataset consists of exactly 54 JSON files.

Schema 1 is the readable in-memory model, not the current storage format. The exporter builds schema 1, compacts it to schema 2 for storage, and checks that expansion restores the original schema-1 document. Expanding an already-readable document returns it unchanged.

## Validation

```console
python -m pytest -q
node --test tests/*.test.js
```

The entire Python suite is source-independent: it uses the committed JSON files, synthetic TF APIs and mocked downloads, with no private repositories or network access required. It verifies the exact set of 54 schema-2 files against the catalogue's SHA-256 values, complete coverage, boundaries, expansion idempotence and lossless round trips. Malformed-record and compaction-guard tests also run in `python -O` subprocesses to ensure optimization cannot disable validation. Rejected compaction leaves the input files unchanged. Only real data regeneration requires the source repositories.

JavaScript tests the exact search logic used by the browser: known Genesis 1:1 totals, all five methods, word-part versus whole-word grouping, all four structural levels, repeated spellings, split phrases and missing readings.

## Code quality

[`.github/workflows/quality.yml`](.github/workflows/quality.yml) runs on pull requests to `main`, can be run manually, and is called by Pages on pushes to `main`. This runs the full matrix once per push. It checks JavaScript with ESLint, checks Python and the notebook with Ruff, runs the browser tests, and runs the Python tests on Linux Python 3.11/3.13 and Windows Python 3.13. Python dependencies are installed from the hashed lock with `--require-hashes --only-binary=:all:`. The checks validate the committed compact datasets without regenerating them or accessing private source repositories. The workflow has read-only repository permissions and no deployment access.

To run the lint checks locally, use Node.js 24 or later and install the Python development requirements:

```console
npm ci --ignore-scripts
npm run lint
python -m pip install --require-hashes --only-binary=:all: -r requirements-dev.txt
python -m ruff check .
```

Lint rules focus on errors, unused code, and likely bugs; they do not impose a repository-wide formatting change. The workflow also supports `workflow_call` so Pages runs the same checks as a prerequisite for deployment. Branch protection is not enabled by the workflow, but deployment is gated independently of merge protection.

## Security and dependency maintenance

See [SECURITY.md](SECURITY.md) for supported versions, confidential reporting, and security boundaries. Both HTML pages use a same-origin CSP. Rendering uses text nodes rather than HTML injection, numerical searches accept only decimal nonnegative safe integers, and external SHEBANQ links use `noopener noreferrer`. ESLint rejects common HTML injection and dynamic code-execution APIs. These controls are defense in depth, not a guarantee against all vulnerabilities; meta CSP does not support `frame-ancestors`.

[`.github/dependabot.yml`](.github/dependabot.yml) checks SHA-pinned GitHub Actions, npm dependencies, and Python requirements with the native `uv` updater every Monday at 09:00 Europe/Amsterdam. Action updates are grouped; npm and Python minor/patch updates are grouped per ecosystem, with major updates proposed separately. npm and Python security fixes have their own groups. Each ecosystem is limited to five open version-update PRs. Dependabot alerts and security updates are enabled in the repository settings. Update PRs run the same Code Quality checks and are reviewed before merging.

The native `uv` updater supports the existing `.in` inputs and compiled `.txt` locks. Their command headers retain universal resolution, Python 3.11, and hash generation. The development input includes `-c requirements.txt` so automated compilation retains the runtime constraints, and `[tool.uv] no-build = true` in `pyproject.toml` preserves wheel-only resolution. Review input and lock changes together, and use the commands below when regenerating locks manually.

`requirements.in` and `requirements-dev.in` are the dependency inputs. Their corresponding `.txt` files are generated, fully pinned, hashed locks with environment markers for cross-platform installation. Runtime pins also constrain the development lock. To regenerate them, install `uv==0.12.23` in a separate tooling environment and run:

```console
uv pip compile --universal --python-version 3.11 --generate-hashes --no-build requirements.in -o requirements.txt
uv pip compile --universal --python-version 3.11 --generate-hashes --no-build requirements-dev.in -o requirements-dev.txt
```

`uv` is needed only to maintain the locks, not to use the browser or install its Python tools. Unlike an environment-specific pip-tools compilation, universal resolution includes platform-dependent packages such as Linux `pexpect` and Windows `colorama`. Use `--upgrade-package NAME` for an intentional transitive update, then review both locks and run the checks. Dependency hashes verify downloaded distributions; they do not attest that a dependency is safe. Wheel-only installs avoid executing source-build hooks.

## GitHub Pages

The browser is published at [tonyjurg.github.io/parasha-gematria-browser](https://tonyjurg.github.io/parasha-gematria-browser/), with the [browser guide](https://tonyjurg.github.io/parasha-gematria-browser/info.html) on the same site.

[`.github/workflows/pages.yml`](.github/workflows/pages.yml) first calls **Code Quality** for the same commit. ESLint, Ruff, browser tests, and all Python test matrix jobs must succeed before it uploads **only `site/`** and deploys it to GitHub Pages. A failed, cancelled, or skipped quality job blocks the upload and deployment. This gate applies both to automatic pushes to `main` and manual runs from **Actions > Deploy GitHub Pages > Run workflow**; other branches cannot deploy. In **Settings > Pages > Build and deployment**, the publishing source must be **GitHub Actions**. Official actions are pinned to commit hashes; deployment permissions are limited to the deployment job.

Deployment uses the existing 54 compact JSON files. It does not regenerate data, access the private source repositories, or require custom credentials. All links and data requests are relative, including under the GitHub project subdirectory. No build step or backend is required. The contents of `site/` can also be hosted on another static web server.

## Attribution and licenses

- Tony Jurg, [gematria_TF](https://github.com/tonyjurg/gematria_TF), version 0.2.0: numerical values, text representations and full-word boundaries.
- Tony Jurg, [BHSaddons](https://github.com/tonyjurg/BHSaddons), [DOI 10.5281/zenodo.14051604](https://doi.org/10.5281/zenodo.14051604): parasha boundaries and names. Its repository declares CC BY 4.0; the TF feature headers declare CC BY-NC 4.0. The combined export follows the noncommercial condition.
- Eep Talstra Centre for Bible and Computer, [BHSA](https://etcbc.github.io/bhsa/), [DOI 10.17026/dans-z6y-skyh](https://doi.org/10.17026/dans-z6y-skyh): Hebrew text and linguistic structure, CC BY-NC 4.0.
- [Text-Fabric](https://annotation.github.io/text-fabric/tf/): source loading and structural access.

New browser/exporter code: [MIT](LICENSE). Exported text and data: [CC BY-NC 4.0](LICENSE-DATA.md). Documentation and notebook: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The connected-text logo is reused from my gematria_TF project.
