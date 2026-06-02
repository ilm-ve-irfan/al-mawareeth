// Decision tree that drives the family / heir questionnaire (screen 03).
//
// DATA, not logic: encodes the *order and branching* of the farā'iḍ
// questionnaire. NO inheritance shares are computed here.
//
// Node kinds:
//   - 'boolean' : a yes/no question; each answer lists follow-up node ids.
//   - 'collect' : add named heirs of one relation (with optional max),
//                 then continue to `next`.
//   - 'branch'  : auto-routes on the deceased's gender (no question shown).
//   - 'guard'   : auto-routes on a logical AND of conditions over earlier
//                 answers and/or collected heirs (no question shown).
//
// `text` is an i18n key under the `form` namespace.

import type { Gender, HeirRelation } from './types';

export type HeirAnswer = 'yes' | 'no';

export type BooleanNode = {
  id: string;
  kind: 'boolean';
  text: string;
  next: Record<HeirAnswer, string[]>;
};

export type CollectNode = {
  id: string;
  kind: 'collect';
  text: string;
  relation: HeirRelation;
  max?: number;
  next: string[];
};

export type BranchNode = {
  id: string;
  kind: 'branch';
  on: 'gender';
  cases: Record<Gender, string[]>;
};

// A guard condition is EITHER about an earlier boolean answer, OR about how
// many heirs of a relation have been collected so far.
export type AnswerCondition = {
  node: string;
  is: HeirAnswer;
  // If that node was never asked (branch skipped), assume this answer.
  whenMissing?: HeirAnswer;
};
export type HeirCountCondition = {
  relation: HeirRelation;
  count: 'none' | 'some';
};
export type HeirCondition = AnswerCondition | HeirCountCondition;

// Non-rendered conditional: if EVERY condition in `all` holds (logical AND)
// take `next.then`, otherwise `next.else`.
export type GuardNode = {
  id: string;
  kind: 'guard';
  all: HeirCondition[];
  next: { then: string[]; else: string[] };
};

export type HeirNode = BooleanNode | CollectNode | BranchNode | GuardNode;

export type HeirTree = {
  mainIds: string[];
  nodes: Record<string, HeirNode>;
};

export const heirTree: HeirTree = {
  // Interview order: father BEFORE mother, because the mother-side guard
  // depends on the grandfather answer (father side). The diagram numbers
  // mother=3 / father=4, but the asked order is father then mother.
  // The residuary chain runs last because its gate reads answers from the
  // mother side (paternal/maternal grandmother).
  mainIds: ['spouse', 'father', 'mother', 'residuaryGate'],
  nodes: {
    // --- Main 2: spouse ---
    spouse: {
      id: 'spouse',
      kind: 'boolean',
      text: 'family.q.spouse',
      next: { yes: ['children', 'spouseAlive'], no: [] },
    },
    children: {
      id: 'children',
      kind: 'boolean',
      text: 'family.q.children',
      next: { yes: ['sons', 'daughters'], no: [] },
    },
    sons: {
      id: 'sons',
      kind: 'collect',
      text: 'family.q.sons',
      relation: 'son',
      next: [],
    },
    daughters: {
      id: 'daughters',
      kind: 'collect',
      text: 'family.q.daughters',
      relation: 'daughter',
      next: [],
    },
    spouseAlive: {
      id: 'spouseAlive',
      kind: 'boolean',
      text: 'family.q.spouseAlive',
      next: { yes: ['spouseBranch'], no: [] },
    },
    spouseBranch: {
      id: 'spouseBranch',
      kind: 'branch',
      on: 'gender',
      cases: { male: ['wives'], female: ['husband'] },
    },
    wives: {
      id: 'wives',
      kind: 'collect',
      text: 'family.q.wives',
      relation: 'wife',
      max: 4,
      next: [],
    },
    husband: {
      id: 'husband',
      kind: 'collect',
      text: 'family.q.husband',
      relation: 'husband',
      max: 1,
      next: [],
    },

    // --- Main 4: father side ---
    father: {
      id: 'father',
      kind: 'boolean',
      text: 'family.q.father',
      // father dead -> ask grandfather, then evaluate the two sibling gates.
      next: {
        yes: [],
        no: ['grandfather', 'maternalSiblingsGuard', 'fullSiblingsGuard'],
      },
    },
    grandfather: {
      id: 'grandfather',
      kind: 'boolean',
      text: 'family.q.grandfather',
      next: { yes: [], no: [] },
    },

    // Maternal siblings (kalala): grandfather dead AND no descendants.
    // children undefined (never married) counts as "no".
    maternalSiblingsGuard: {
      id: 'maternalSiblingsGuard',
      kind: 'guard',
      all: [
        { node: 'grandfather', is: 'no' },
        { node: 'children', is: 'no', whenMissing: 'no' },
      ],
      next: { then: ['maternalSiblings'], else: [] },
    },
    maternalSiblings: {
      id: 'maternalSiblings',
      kind: 'collect',
      text: 'family.q.maternalSiblings',
      relation: 'maternalSibling',
      next: [],
    },

    // Full / paternal siblings: father dead AND no (male) sons collected.
    fullSiblingsGuard: {
      id: 'fullSiblingsGuard',
      kind: 'guard',
      all: [
        { node: 'father', is: 'no' },
        { relation: 'son', count: 'none' },
      ],
      next: { then: ['fullBrothers'], else: [] },
    },
    fullBrothers: {
      id: 'fullBrothers',
      kind: 'collect',
      text: 'family.q.fullBrothers',
      relation: 'fullBrother',
      next: ['fullSisters'],
    },
    fullSisters: {
      id: 'fullSisters',
      kind: 'collect',
      text: 'family.q.fullSisters',
      relation: 'fullSister',
      next: ['paternalSiblingsGuard'],
    },
    // A full brother (asaba) blocks the paternal half-siblings entirely.
    paternalSiblingsGuard: {
      id: 'paternalSiblingsGuard',
      kind: 'guard',
      all: [{ relation: 'fullBrother', count: 'none' }],
      next: { then: ['paternalSisters', 'paternalBrothers'], else: [] },
    },
    paternalSisters: {
      id: 'paternalSisters',
      kind: 'collect',
      text: 'family.q.paternalSisters',
      relation: 'paternalSister',
      next: [],
    },
    paternalBrothers: {
      id: 'paternalBrothers',
      kind: 'collect',
      text: 'family.q.paternalBrothers',
      relation: 'paternalBrother',
      next: [],
    },

    // --- Main 3: mother side ---
    mother: {
      id: 'mother',
      kind: 'boolean',
      text: 'family.q.mother',
      next: { yes: [], no: ['maternalGrandmother', 'paternalGrandmotherGuard'] },
    },
    maternalGrandmother: {
      id: 'maternalGrandmother',
      kind: 'boolean',
      text: 'family.q.maternalGrandmother',
      next: { yes: [], no: [] },
    },
    // Paternal grandmother only if grandfather dead AND maternal grandmother dead.
    paternalGrandmotherGuard: {
      id: 'paternalGrandmotherGuard',
      kind: 'guard',
      all: [
        { node: 'grandfather', is: 'no' },
        { node: 'maternalGrandmother', is: 'no' },
      ],
      next: { then: ['paternalGrandmother'], else: [] },
    },
    paternalGrandmother: {
      id: 'paternalGrandmother',
      kind: 'boolean',
      text: 'family.q.paternalGrandmother',
      next: { yes: [], no: [] },
    },

    // --- Residuary (asaba) chain ---
    // Gate: the five conditions from the diagram's note PLUS "no full
    // brothers". In the diagram this chain hangs at the tail of the sibling
    // branch (under full-brothers = 0), so "no full brothers" is guaranteed
    // by position; here it is a flat gate, so the condition is explicit.
    // No full brothers, no paternal brothers, both grandmothers dead, no
    // surviving spouse, no children. If it passes, walk the ordered chain;
    // each "yes" stops the chain (that class takes the residue), each "no"
    // moves to the next, more distant class. The final node lists the
    // distant kindred (dhawu al-arham).
    residuaryGate: {
      id: 'residuaryGate',
      kind: 'guard',
      all: [
        { relation: 'fullBrother', count: 'none' },
        { relation: 'paternalBrother', count: 'none' },
        { node: 'paternalGrandmother', is: 'no', whenMissing: 'no' },
        { node: 'maternalGrandmother', is: 'no', whenMissing: 'no' },
        { relation: 'wife', count: 'none' },
        { relation: 'husband', count: 'none' },
        { node: 'children', is: 'no', whenMissing: 'no' },
      ],
      next: { then: ['fullBrothersSons'], else: [] },
    },
    fullBrothersSons: {
      id: 'fullBrothersSons',
      kind: 'boolean',
      text: 'family.q.fullBrothersSons',
      next: { yes: [], no: ['paternalBrothersSons'] },
    },
    paternalBrothersSons: {
      id: 'paternalBrothersSons',
      kind: 'boolean',
      text: 'family.q.paternalBrothersSons',
      next: { yes: [], no: ['fullPaternalUncle'] },
    },
    fullPaternalUncle: {
      id: 'fullPaternalUncle',
      kind: 'boolean',
      text: 'family.q.fullPaternalUncle',
      next: { yes: [], no: ['paternalUncle'] },
    },
    paternalUncle: {
      id: 'paternalUncle',
      kind: 'boolean',
      text: 'family.q.paternalUncle',
      next: { yes: [], no: ['fullPaternalUncleSon'] },
    },
    fullPaternalUncleSon: {
      id: 'fullPaternalUncleSon',
      kind: 'boolean',
      text: 'family.q.fullPaternalUncleSon',
      next: { yes: [], no: ['paternalUncleSon'] },
    },
    paternalUncleSon: {
      id: 'paternalUncleSon',
      kind: 'boolean',
      text: 'family.q.paternalUncleSon',
      next: { yes: [], no: ['distantKindred'] },
    },
    // Terminal: distant kindred (dhawu al-arham). Listed as examples only.
    distantKindred: {
      id: 'distantKindred',
      kind: 'boolean',
      text: 'family.q.distantKindred',
      next: { yes: [], no: [] },
    },
  },
};
