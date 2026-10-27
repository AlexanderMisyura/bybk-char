import type { SkinRef } from 'pollyroll';
import type { Character } from './character';

export const STORAGE_KEY = {
  CHAR: 'BYBK_char',
  THEME: 'BYBK_theme',
  SNAPSHOTS: 'BYBK_snapshots',
}

export const CUSTOM_EVENTS = {
  SNAPSHOT_LOADED: 'snapshot-loaded',
}

export const DAMAGE_DIE = 6;
export const SKILLS_NUMBER = 4;

export const INITIAL_CHARACTER: Character = {
  id: '',
  timestamp: '',
  name: '',
  maxVitality: '',
  vitality: '',
  physical: '',
  mental: '',
  armor: '',
  damageModifier: '',
  items: '',
  skills: Array.from({ length: SKILLS_NUMBER }).map(() => ({
    description: '',
    usage: '',
  })),
  other: '',
};

export const ANIMATION_TIMING = 200;

export const  THEME_OPTIONS = {
    light: 'light',
    dark: 'dark',
    system: 'system',
  } as const;
