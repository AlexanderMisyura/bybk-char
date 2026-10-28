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
  diceRoll: '',
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

export const DICE_SKIN = {
  WHITE_PLASTIC: {
    material: 'stone',
    color: ['#f4f1ea', '#dad6ce'],
    labelColor: '#b32a20',
    labelStyle: 'engraved',
    pattern: 'marble',
  } as SkinRef,
  OBSIDIAN_STONE: {
    material: 'stone',
    color: ['#0b0b0f', '#2c2c36'],
    labelColor: '#df736f',
    labelStyle: 'engraved',
    pattern: 'marble',
  } as SkinRef,
};