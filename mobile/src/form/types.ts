// Form data model for the inheritance input flow.
// Types describe the *shape* of the data; derived values (net estate,
// max wasiya) live as pure functions, not as object methods, so the
// state stays a plain serialisable object that React can replace
// immutably on every update.

export type Gender = 'male' | 'female';

export type AssetType = 'cash' | 'gold' | 'realEstate' | 'vehicle' | 'other';

export type Asset = {
  id: string;
  type: AssetType;
  label?: string;
  value: number;
};

export type Deceased = {
  name: string;
  gender: Gender;
  hasWasiya: boolean;
  wasiyaAmount: number;
};

// Heir.relation is a loose string for now; it will be narrowed to a
// union once the heir question tree is modelled from the farā'iḍ spec.
export type Heir = {
  id: string;
  name: string;
  relation: string;
};

export type FormData = {
  deceased: Deceased;
  assets: Asset[];
  liabilities: number;
  heirs: Heir[];
};

// --- Factories -------------------------------------------------------

// Hermes (React Native's JS engine) has no reliable crypto.randomUUID,
// so we build stable list ids from a timestamp plus a session counter.
let idCounter = 0;
export const makeId = (prefix = 'id'): string =>
  `${prefix}_${Date.now().toString(36)}_${(idCounter++).toString(36)}`;

export const emptyFormData = (): FormData => ({
  deceased: { name: '', gender: 'male', hasWasiya: false, wasiyaAmount: 0 },
  assets: [],
  liabilities: 0,
  heirs: [],
});

// --- Derived values --------------------------------------------------

export const totalAssets = (assets: Asset[]): number =>
  assets.reduce((sum, a) => sum + a.value, 0);

export const netEstate = (data: FormData): number =>
  totalAssets(data.assets) - data.liabilities;

export const maxWasiya = (data: FormData): number => netEstate(data) / 3;

export const isWasiyaValid = (data: FormData): boolean =>
  !data.deceased.hasWasiya || data.deceased.wasiyaAmount <= maxWasiya(data);
