export type Character = {
  id?: string;
  timestamp?: string;
  name: string;
  maxVitality: string;
  vitality: string;
  physical: string;
  mental: string;
  armor: string;
  damageModifier: string;
  diceRoll: string;
  items: string;
  skills: {
    description: string;
    usage: string;
  }[];
  other: string;
};

export type CharacterSaved = Character & { id: string, timestamp: string };
