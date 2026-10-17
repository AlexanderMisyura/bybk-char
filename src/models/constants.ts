import type { Character } from './character';

export const STORAGE_CHAR_KEY = 'BYBK_char';
export const STORAGE_THEME_KEY = 'BYBK_theme';
export const DAMAGE_DIE = 6;
export const SKILLS_NUMBER = 4;

export const INITIAL_CHARACTER: Character = {
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
