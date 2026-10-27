'use client';
import { useMessages } from 'next-intl';
import { translate, type Dict, type T } from './core';

export function useT(): T {
  const m = useMessages() as { ui?: Dict };
  return (s, vars) => translate(m.ui, s, vars);
}
