import type { Character, CharacterSaved } from '@/models/character';
import {
  STORAGE_KEY,
  INITIAL_CHARACTER
} from '@/models/constants';

export function getCharDataFromStorage(): Character {
  const storedData = localStorage.getItem(STORAGE_KEY.CHAR);

  return storedData ? JSON.parse(storedData) : INITIAL_CHARACTER;
}

export function setCharDataToStorage(character: Character): void {
  localStorage.setItem(STORAGE_KEY.CHAR, JSON.stringify(character));
}

export function checkSnapshotExists(snapshotId: string): boolean {
  const stored = localStorage.getItem(STORAGE_KEY.SNAPSHOTS);
  if (!stored) return false;
  const snapshots: Character[] = JSON.parse(stored);
  return snapshots.some((snapshot) => snapshot.id === snapshotId);
}

export function isCharDataSameAsSnapshot(character: Character, snapshotId: string): boolean {
  const snapshot = getSingleSnapshotFromStorage(snapshotId);
  return JSON.stringify({...character, timestamp: ''}) === JSON.stringify({...snapshot, timestamp: ''});
}

export function setSnapshotToStorage(character: CharacterSaved): void {
  const snapshots: CharacterSaved[] = getSnapshotsFromStorage();

  if (checkSnapshotExists(character.id)) {
    const index = snapshots.findIndex((snapshot) => snapshot.id === character.id);
    snapshots[index] = character;
  } else {
    snapshots.push(character);
  }

  localStorage.setItem(STORAGE_KEY.SNAPSHOTS, JSON.stringify(snapshots));
}

export function getSnapshotsFromStorage(): CharacterSaved[] {
  const stored = localStorage.getItem(STORAGE_KEY.SNAPSHOTS);
  return stored ? JSON.parse(stored) : [];
}

export function getSingleSnapshotFromStorage(snapshotId: string): CharacterSaved | undefined {
  const snapshots = getSnapshotsFromStorage();
  return snapshots.find((snapshot) => snapshot.id === snapshotId);
}
