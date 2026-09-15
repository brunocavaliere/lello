# Roadmap

## Seven implementation stages

### Stage 1 — Product direction

- define the personal-library positioning
- define the core reading loop
- keep notes and audio as optional book-level features
- preserve the current visual language

### Stage 2 — Library data model

- add reading start and completion dates
- add a personal comment or review
- keep book status and rating as first-class fields
- update Supabase types, services, and ownership rules

### Stage 3 — Library experience

- make the library the primary home experience
- implement wishlist, currently reading, and completed views
- keep the existing visual style and shared components
- make the current `/library` and `/reading-queue` routes useful

### Stage 4 — Reading lifecycle

- improve adding a book to the wishlist
- make status changes clear and fast
- support starting and finishing a book
- capture dates with sensible defaults and manual editing

### Stage 5 — Evaluation and history

- add the one-to-five-star rating flow
- add optional personal comments
- show completed books by year
- add search, filtering, and sorting

### Stage 6 — Optional notes layer

- keep written and audio notes inside the book detail page
- remove pressure to create notes during the main reading flow
- validate whether notes and audio are actually used

### Stage 7 — Sharing experiments

- consider public libraries or profiles
- test shared shelves and public ratings
- only add a feed or social graph if the library is already useful alone

## Deferred ideas

These ideas are intentionally not part of the next implementation cycle:

- complex retention workflows
- chapter-level prompts and active recall systems
- AI-generated questions, summaries, or flashcards
- rankings and recommendation algorithms
- a full social network
