import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';

import {
  type Asset,
  type Deceased,
  type FormData,
  emptyFormData,
  makeId,
} from './types';

type FormContextValue = {
  data: FormData;
  setDeceased: (patch: Partial<Deceased>) => void;
  addAsset: (asset?: Partial<Asset>) => void;
  updateAsset: (id: string, patch: Partial<Asset>) => void;
  removeAsset: (id: string) => void;
  setLiabilities: (value: number) => void;
  reset: () => void;
};

const FormContext = createContext<FormContextValue | null>(null);

export function FormProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<FormData>(emptyFormData);

  const setDeceased = useCallback((patch: Partial<Deceased>) => {
    setData((prev) => ({ ...prev, deceased: { ...prev.deceased, ...patch } }));
  }, []);

  const addAsset = useCallback((asset?: Partial<Asset>) => {
    setData((prev) => ({
      ...prev,
      assets: [
        ...prev.assets,
        { type: 'cash', value: 0, ...asset, id: makeId('asset') },
      ],
    }));
  }, []);

  const updateAsset = useCallback((id: string, patch: Partial<Asset>) => {
    setData((prev) => ({
      ...prev,
      assets: prev.assets.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    }));
  }, []);

  const removeAsset = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      assets: prev.assets.filter((a) => a.id !== id),
    }));
  }, []);

  const setLiabilities = useCallback((value: number) => {
    setData((prev) => ({ ...prev, liabilities: value }));
  }, []);

  const reset = useCallback(() => setData(emptyFormData()), []);

  const value = useMemo(
    () => ({
      data,
      setDeceased,
      addAsset,
      updateAsset,
      removeAsset,
      setLiabilities,
      reset,
    }),
    [data, setDeceased, addAsset, updateAsset, removeAsset, setLiabilities, reset],
  );

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

export function useForm(): FormContextValue {
  const ctx = useContext(FormContext);
  if (!ctx) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return ctx;
}
