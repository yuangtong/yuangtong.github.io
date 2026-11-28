# Machine translation (DeepL)

The site is written by hand in English and Spanish. Portuguese (`pt`),
Chinese (`zh`, simplified) and Japanese (`ja`) are the languages the owner is
learning: they are machine translated with DeepL from the English content and
marked as "learning" in the language selector.

## How it runs

- `scripts/translate.mts` reads the English fixtures
  (`src/content/fixtures/en`), sends every string that is copy (not links,
  ids, names or code) to DeepL and writes, per language,
  `src/content/fixtures/<locale>/content.json` with the same shapes as the
  English modules, plus `lock.json`.
- `lock.json` keeps a hash of the English source of each string. Only new or
  changed strings are sent again, so a manual fix in `content.json` survives
  until the English string it translates changes.
- Placeholders (`{time}`) and proper nouns (piece titles such as
  "sísifo feliz", FOMMO, people, tools) are never translated; the list is
  `PROTECTED` in the script.
- The GitHub Action "Translate with DeepL" (`.github/workflows/translate.yml`)
  runs the script and opens a pull request from `deepl/translations`. It runs
  by hand from the Actions tab and on every push to `main` that changes the
  English content. The site never calls DeepL at request time.

## Where the key lives

The key is the GitHub repository secret `DEEPL_API_KEY` (Settings > Secrets
and variables > Actions). It is not a Vercel variable: Vercel only builds the
committed files. Free keys (ending in `:fx`) and Pro keys both work; the
script picks the right host. DeepL Free allows 500,000 characters a month; a
full run of the three languages is about 45,000.

The repository setting "Allow GitHub Actions to create and approve pull
requests" (Settings > Actions > General > Workflow permissions) must be on for
the Action to open its pull request.

## Running it locally

```
DEEPL_API_KEY=... node --experimental-strip-types scripts/translate.mts
node --experimental-strip-types scripts/translate.mts --dry    # list, no API calls
node --experimental-strip-types scripts/translate.mts --fake   # check the pipeline without DeepL
```

## How a language turns on

The script also writes `src/content/fixtures/translated.ts` (the list of
learning languages that have a `content.json`) and
`src/content/fixtures/learning.ts` (their content). `locales` in
`src/content/locale.ts` is the hand-written languages plus that list, so a
language gets its routes (`/pt/lab`), its link in the language selector and
browser detection in the same merge that brings its translation. Until then
the selector shows it as "soon". `writtenLocales` (en, es) are the languages
edited in Sanity.

## Content from Sanity

Sanity holds only the hand-written languages. On a learning language the lab
keeps its translated texts and takes only the order and status of each piece
from Sanity; notes and archivo.exe photos from Sanity show in English until
they get their own translation path.
