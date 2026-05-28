// Form data model for the inheritance input flow.
//
// Each asset is tracked in its *natural* unit (a count of grams for gold,
// 2400 shares for real estate, etc.) so the later farā'iḍ engine can split
// every pot correctly. In addition, every asset carries a `value` in the
// single estate `currency` — that value is used *only* to total the estate
// and derive the wasiya ceiling (max one third), never for the per-pot
// distribution.
//
// State stays a plain serialisable object that React can replace immutably
// on every update; derived values live as pure functions, not methods.

export type Gender = 'male' | 'female';

// One currency is chosen once for the whole estate (see FormData.currency),
// matching the single picker at the top of the input screen.
export type Currency = 'SAR' | 'USD' | 'EUR';

// A property is conventionally divided into 24 qirat × 100 = 2400 sahm.
export const PROPERTY_SHARES = 2400;

export type AssetKind = 'cash' | 'gold' | 'realEstate' | 'vehicle' | 'other';

type AssetBase = {
  id: string;
  label?: string;
  // Monetary worth in the estate currency. Feeds the estate total and the
  // wasiya ceiling only — distribution uses the unit fields below.
  value: number;
};

export type CashAsset = AssetBase & { kind: 'cash' };
export type GoldAsset = AssetBase & { kind: 'gold'; grams: number };
export type RealEstateAsset = AssetBase & {
  kind: 'realEstate';
  description: string;
  shares: number; // defaults to PROPERTY_SHARES
};
export type VehicleAsset = AssetBase & { kind: 'vehicle'; description?: string };
export type OtherAsset = AssetBase & { kind: 'other'; description?: string };

export type Asset =
  | CashAsset
  | GoldAsset
  | RealEstateAsset
  | VehicleAsset
  | OtherAsset;

// Any subset of editable fields across all asset kinds. `id` and `kind`
// are fixed once an asset is created, so callers can only patch the rest.
// Listed explicitly rather than derived from an intersection of the union
// members: intersecting their conflicting `kind` literals collapses to
// `never` and breaks the field types (TS reports "not assignable to
// 'undefined'" on every patch).
export type AssetPatch = Partial<{
  label: string;
  value: number;
  grams: number;
  description: string;
  shares: number;
}>;

export type Deceased = {
  name: string;
  gender: Gender;
  hasWasiya: boolean;
  wasiyaAmount: number; // in the estate currency
};

// Relations a heir can have to the deceased. Extend as the question tree
// grows; only relations the tree actually collects need to be used.
export type HeirRelation =
  | 'husband'
  | 'wife'
  | 'son'
  | 'daughter'
  | 'father'
  | 'mother'
  | 'fullBrother' // shaqīq: same father and mother
  | 'fullSister' // shaqīqa: same father and mother
  | 'paternalBrother' // akh li-ab: same father only
  | 'paternalSister' // ukht li-ab: same father only
  | 'maternalSibling' // akh/ukht li-umm: same mother only (sex-neutral for shares)
  | 'grandfather'
  | 'grandmother'
  | 'grandson'
  | 'granddaughter';

export type Heir = {
  id: string;
  name: string;
  relation: HeirRelation;
};

export type FormData = {
  deceased: Deceased;
  currency: Currency;
  assets: Asset[];
  liabilities: number; // in the estate currency
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
  currency: 'SAR',
  assets: [],
  liabilities: 0,
  heirs: [],
});

// Build a blank asset of the given kind with a fresh id and a zero value.
// The screen calls this on "+" and then fills the fields via updateAsset.
export const makeAsset = (kind: AssetKind): Asset => {
  const base = { id: makeId('asset'), value: 0 };
  switch (kind) {
    case 'gold':
      return { ...base, kind, grams: 0 };
    case 'realEstate':
      return { ...base, kind, description: '', shares: PROPERTY_SHARES };
    case 'vehicle':
      return { ...base, kind };
    case 'other':
      return { ...base, kind };
    case 'cash':
    default:
      return { ...base, kind: 'cash' };
  }
};

// --- Derived values --------------------------------------------------

export const totalAssets = (assets: Asset[]): number =>
  assets.reduce((sum, a) => sum + a.value, 0);

export const netEstate = (data: FormData): number =>
  totalAssets(data.assets) - data.liabilities;

export const maxWasiya = (data: FormData): number => netEstate(data) / 3;

export const isWasiyaValid = (data: FormData): boolean =>
  !data.deceased.hasWasiya || data.deceased.wasiyaAmount <= maxWasiya(data);
