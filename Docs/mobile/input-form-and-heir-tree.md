# Al Mawareeth — Initial Input Form (Screens 02–03) & Heir Tree Engine

Handoff documentation for the inheritance **input** flow. It explains what
exists, where it lives, how the pieces fit together, and how to extend each
part. The actual farā'iḍ **calculation** (shares, ḥajb, ʿawl, radd) is *not*
part of this work — the input layer only collects parameters.

> Scope of this document: the deceased-info screen, the family/heir
> questionnaire, the form state, and the data-driven decision tree that
> drives the questionnaire. Theme, widgets and i18n are referenced where the
> flow depends on them, but each has its own README.

---

## 1. What was built

- **Screen 02 — Deceased Info**: deceased basic info, currency, estate
  assets (5 kinds, each with a `+` and an inline editor), bequest (wasiya)
  with a live one‑third check, liabilities, and a live net‑estate preview.
- **Screen 03 — Family Details**: a questionnaire driven by a data‑only
  decision tree (`heir-tree.ts`) and a small walk engine. It records answers
  and collects named heirs; it computes **no** shares.
- **Form state**: a single React context (`FormContext`) holding all input,
  plus pure derived helpers (`netEstate`, `maxWasiya`, …).
- **Navigation**: `Welcome → DeceasedInfo → FamilyDetails → Summary`.

All UI consumes the design system (`useColors`, tokens, `useWidgetStyles`)
and all copy goes through i18n (`form` namespace, English + Arabic/RTL).

---

## 2. File map

```
src/form/
  types.ts            data model: Asset union, Heir, FormData, factories,
                      derived values (totalAssets/netEstate/maxWasiya/…)
  FormContext.tsx     React context + useForm() hook (all mutations)
  heir-tree.ts        the decision tree (DATA) + node type definitions

screens/
  DeceasedInfo/index.tsx   Screen 02
  FamilyDetails/index.tsx  Screen 03 (contains the walk engine)

navigation/
  RootStack.tsx       stack navigator
  types.ts            RootStackParamList

theme/        colors + tokens  (see theme/README.md)
styles/       widgets.ts       (see styles/README.md)
src/i18n/     setup + locales/{en,ar}/form.json  (see Docs/mobile/multi-languages-support.md)
```

---

## 3. Form state (`src/form/types.ts`, `FormContext.tsx`)

### Data model

`FormData` is a plain, serialisable object that is replaced immutably on every
update:

```ts
type FormData = {
  deceased: Deceased;     // name, gender, hasWasiya, wasiyaAmount
  currency: Currency;     // 'SAR' | 'USD' | 'EUR' — one for the whole estate
  assets: Asset[];        // discriminated union by `kind`
  liabilities: number;
  heirs: Heir[];          // collected during Screen 03
};
```

`Asset` is a discriminated union keyed on `kind`
(`cash | gold | realEstate | vehicle | other`). Every asset carries a `value`
in the estate currency; kind‑specific fields hold the *natural unit*
(`gold.grams`, `realEstate.shares` defaulting to `PROPERTY_SHARES = 2400`).
The `value` feeds only the estate total and the wasiya ceiling — never the
per‑pot distribution. `AssetPatch` is the editable subset (`id`/`kind` are
fixed after creation).

`Heir.relation` is a `HeirRelation` union. The relations actually collected by
the tree are: `son`, `daughter`, `wife`, `husband`, `fullBrother`,
`fullSister`, `paternalBrother`, `paternalSister`, `maternalSibling`. (Parents,
grandparents and the remote ʿaṣaba are recorded as yes/no answers, not as named
heirs — see §5.)

### Mutations — `useForm()`

`FormProvider` wraps the navigator; any screen calls `useForm()`:

| Function | Purpose |
| --- | --- |
| `setDeceased(patch)` | merge into `deceased` |
| `setCurrency(c)` | set estate currency |
| `addAsset(kind)` | append a blank asset of that kind |
| `updateAsset(id, patch)` | patch one asset's editable fields |
| `removeAsset(id)` | drop an asset |
| `setLiabilities(n)` | set debts/expenses |
| `addHeir({relation, name})` | append a named heir |
| `removeHeir(id)` | drop a heir |
| `reset()` | back to `emptyFormData()` |

### Derived values (pure functions)

`totalAssets(assets)`, `netEstate(data) = totalAssets − liabilities`,
`maxWasiya(data) = netEstate / 3`, `isWasiyaValid(data)`. These are functions,
not stored fields, so they never go stale.

---

## 4. Screen 02 — Deceased Info

Layout top‑to‑bottom: `StepIndicator` (step 1 of 4) → Deceased card
(name + gender via `SegmentedControl`) → Currency (`Select`) → Assets →
Wasiya → Net‑estate preview → Liabilities → Next button.

- **Assets**: `ASSET_KINDS` defines the row order. Each row has a `+` that
  calls `addAsset(kind)`; each created asset renders an inline `AssetEditor`
  with the kind‑specific fields plus the value field.
- **Wasiya live check**: the screen computes `net`, `maxWasiyaValue = net/3`,
  and `forDistribution = net − min(wasiya, max)`. A bequest above the third is
  void for the excess, so only up to one third is deducted. If it exceeds, the
  field shows an inline error (`deceased.wasiyaExceeds`).
- **Net‑estate preview** (AC7): shown live as `forDistribution`.
- Numbers are parsed with a small `toNumber` helper (comma → dot, NaN → 0).

Step constants are local: `STEP_CURRENT = 1`, `STEP_TOTAL = 4`.

---

## 5. Screen 03 — Family Details (the decision tree + walk engine)

This is the most involved part. The **tree is data** (`heir-tree.ts`); the
**engine** (in the screen) just walks it. Nothing is computed.

### 5.1 Node kinds (`heir-tree.ts`)

| Kind | Rendered? | Behaviour |
| --- | --- | --- |
| `boolean` | yes (Yes/No) | records the answer; each answer lists follow‑up node ids |
| `collect` | yes (name + list) | adds named heirs of one `relation` (optional `max`), then `next` |
| `branch` | no | auto‑routes on `deceased.gender` (`cases.male` / `cases.female`) |
| `guard` | no | auto‑routes on a logical AND of conditions (`next.then` / `next.else`) |

`text` on a node is an i18n key under the `form` namespace.

### 5.2 Guard conditions

A `guard` evaluates `all: HeirCondition[]` (logical AND). A condition is one of:

- **Answer condition** — `{ node, is, whenMissing? }`: true when the earlier
  boolean answer for `node` equals `is`. If that node was never asked (a branch
  skipped it), `whenMissing` is assumed. Example: `children` is only asked when
  married, so the gates use `{ node:'children', is:'no', whenMissing:'no' }`
  ("never married ⇒ no children").
- **Heir‑count condition** — `{ relation, count: 'none' | 'some' }`: true based
  on how many heirs of `relation` have been collected so far. Example:
  `{ relation:'son', count:'none' }` ("no sons collected").

### 5.3 The walk engine (in `FamilyDetails/index.tsx`)

State is a depth‑first queue plus recorded answers and history:

```
WalkState = { currentId, queue, answers, gender, history }
```

- `advance(queue, ctx)` pops the next *renderable* node, auto‑resolving any
  `branch` (by `ctx.gender`) and `guard` (by `ctx.answers` + `ctx.heirs`) nodes
  it encounters — those are spliced into the queue, never shown.
- The reducer handles `answer` (boolean), `next` (collect "continue"), and
  `back` (restores the previous snapshot from `history`).
- `ctx` carries `{ gender, answers, heirs }`. The current `heirs` are passed
  into each `answer`/`next` action so guard count‑conditions see up‑to‑date
  data. On an `answer`, the new answer is merged into `answers` **before**
  advancing, so a guard placed right after sees it.

Step constants: `STEP_CURRENT = 2`, `STEP_TOTAL = 4`.

### 5.4 Tree contents & interview order

`mainIds = ['spouse', 'father', 'mother', 'residuaryGate']`.

Interview order matters because some guards read answers from other subtrees:

- **Father before mother**: the mother‑side paternal‑grandmother guard reads
  the `grandfather` answer (father side). The diagram numbers mother = 3 and
  father = 4, but the *asked* order is father then mother.
- **Residuary last**: the residuary gate reads both grandmothers (mother side),
  so it runs after the mother subtree.

High‑level flow:

1. **spouse** → children (sons/daughters) and surviving spouse
   (`branch` by gender → wives ≤ 4 / husband ≤ 1).
2. **father** → if dead: grandfather, then two sibling gates:
   - *maternal siblings* gate: grandfather dead AND no children.
   - *full/paternal siblings* gate: father dead AND no sons → full brothers +
     full sisters; paternal half‑siblings only if **no full brother**.
3. **mother** → if dead: maternal grandmother, then (if grandfather AND maternal
   grandmother both dead) paternal grandmother.
4. **residuaryGate** → ordered remote ʿaṣaba chain (full brother's sons →
   paternal brother's sons → full paternal uncle → paternal uncle → their sons →
   distant kindred). Each "yes" stops the chain; each "no" moves to the next,
   more distant class. The gate fires only when: no full brothers, no paternal
   brothers, both grandmothers dead, no surviving spouse, no children.

> Note on the residuary gate: in the source diagram this chain hangs at the
> tail of the sibling branch, so "no full brothers" is guaranteed by position.
> Because the engine evaluates it as a flat gate (after the mother subtree, for
> the grandmother conditions), that "no full brothers" condition is made
> explicit in `residuaryGate.all`.

---

## 6. How to extend the tree

All of the following are pure data edits in `heir-tree.ts` plus i18n keys —
no engine changes needed.

**Add a yes/no question**

```ts
myQuestion: {
  id: 'myQuestion', kind: 'boolean', text: 'family.q.myQuestion',
  next: { yes: ['nextNodeId'], no: [] },
},
```
Wire its id into some other node's `next` (or into `mainIds`), and add
`family.q.myQuestion` to both `en/form.json` and `ar/form.json`.

**Collect named heirs**

```ts
myHeirs: {
  id: 'myHeirs', kind: 'collect', text: 'family.q.myHeirs',
  relation: 'someRelation', max: 4 /* optional */, next: [],
},
```
If `someRelation` is new, add it to `HeirRelation` in `types.ts`.

**Add a conditional (guard)**

```ts
myGate: {
  id: 'myGate', kind: 'guard',
  all: [
    { node: 'father', is: 'no' },
    { relation: 'son', count: 'none' },
  ],
  next: { then: ['nodeIfTrue'], else: [] },
},
```
Important: a guard can only read answers/heirs recorded **before** it in the
walk. If it reads an answer from another subtree, make sure that subtree is
earlier in `mainIds`.

**Add a gender branch**

```ts
myBranch: {
  id: 'myBranch', kind: 'branch', on: 'gender',
  cases: { male: ['idsForMale'], female: ['idsForFemale'] },
},
```

---

## 7. Design system & i18n compliance

- **No inline hex / magic numbers in screens.** Colors via `useColors()`,
  layout/typography via tokens (`spacing`/`radii`/`typography`), component
  styles via `useWidgetStyles()`. New widget namespaces are documented in
  `styles/README.md` (`progress`, `segmented`, `select`; `Switch` intentionally
  has none).
- **i18n**: all copy is in the `form` namespace. The namespace is typed via
  `src/i18n/i18next.d.ts`, so question keys autocomplete and type‑check.
  Dynamic keys (the tree's `text`) are read through a widened
  `tt = t as unknown as (key: string) => string` cast.
- **RTL**: language switching goes through `changeLanguage` in
  `src/utils/language.ts`, which sets RTL and reloads when the direction
  changes. See `Docs/mobile/multi-languages-support.md`.

---

## 8. Known limitations / open items

- **Back + count guards**: pressing *Back* restores an earlier snapshot but
  does not re‑evaluate guards against newly changed heir counts (e.g. editing
  the number of sons after a guard already ran). Fine for linear input; if it
  needs to be exact later, recompute the queue from current `heirs` on `back`.
- **Remote ʿaṣaba are yes/no only**: the uncle/nephew chain records existence,
  not names/counts. If the calculation later needs counts, switch those
  `boolean` nodes to `collect` (one‑line change per node + a relation in
  `types.ts`).
- **`distantKindred` is a terminal note** rendered as a yes/no node; there is no
  dedicated "info" node kind.
- **Sibling blocking is exactly as drawn**: the gates encode the conditions from
  the diagram notes only. If additional blockers are required by fiqh review
  (e.g. sisters blocking the chain), add them to the relevant guard.

---

## 9. Out of scope (separate tasks)

- Screen 04 (Summary) and Screen 05 (Results).
- The farā'iḍ calculation engine (shares, ḥajb, ʿawl, radd). This must be built
  from a clear spec with test cases — not inferred.

---

## 10. Run & verify

1. `npm run typecheck` — must be green.
2. `npx expo start` (add `-c` to clear the Metro cache if new i18n keys don't
   appear), then open in Expo Go.
3. Quick manual checks for Screen 03:
   - *Male, married, 1 son, father dead, grandfather dead* → no full/paternal
     sibling questions (the son blocks them); mother side proceeds normally.
   - *Female, never married, father dead, grandfather dead, mother dead, both
     grandmothers "no", no sons, no paternal brothers* → maternal siblings, the
     full/paternal chain, and the remote ʿaṣaba chain all appear.
   - Add 1 full brother → after full sisters, Screen 04 is reachable but the
     paternal half‑sibling and remote ʿaṣaba questions are **not** asked.
