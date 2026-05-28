// Decision tree that drives the family / heir questionnaire (screen 03).
//
// This is DATA, not logic: it encodes the *order and branching* of the
// farā'iḍ questionnaire and is meant to grow node by node. NO inheritance
// shares are computed here.
//
// Node kinds:
//   - 'boolean' : a yes/no question; each answer lists follow-up node ids.
//   - 'collect' : add named heirs of one relation (with optional max),
//                 then continue to `next`.
//   - 'branch'  : auto-routes on the deceased's gender (no question shown).
//
// `text` is an i18n key under the `form` namespace. To extend: add a node
// here, add its text key to en/ar form.json, and wire it into some
// answer's / branch's id list.

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

export type HeirNode = BooleanNode | CollectNode | BranchNode;

export type HeirTree = {
  mainIds: string[]; // ordered main questions; asked one subtree at a time
  nodes: Record<string, HeirNode>;
};

export const heirTree: HeirTree = {
  mainIds: ['spouse'],
  nodes: {
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
      // deceased male -> surviving wives (up to 4); female -> one husband
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
  },
};
