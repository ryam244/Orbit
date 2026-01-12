import { GameConfig } from '../constants/GameConfig';

export type GridIndex = number;

export const getIndex = (ring: number, sector: number): GridIndex => {
  return ring * GameConfig.sectorCount + sector;
};

export const getRing = (index: GridIndex): number => {
  return Math.floor(index / GameConfig.sectorCount);
};

export const getSector = (index: GridIndex): number => {
  return index % GameConfig.sectorCount;
};

export const clampRing = (ring: number): number => {
  return Math.max(0, Math.min(GameConfig.ringCount - 1, ring));
};

export const wrapSector = (sector: number): number => {
  const count = GameConfig.sectorCount;
  return ((sector % count) + count) % count;
};
