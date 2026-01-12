import { GameConfig } from '../constants/GameConfig';

export type PolarPoint = {
  x: number;
  y: number;
  angleRad: number;
};

export const sectorToAngle = (sector: number, offset = 0): number => {
  const step = (Math.PI * 2) / GameConfig.sectorCount;
  return (sector + offset) * step;
};

export const sectorToCartesian = (
  sector: number,
  ring: number,
  offset = 0,
): PolarPoint => {
  const angleRad = sectorToAngle(sector, offset);
  const radius = GameConfig.coreRadius + ring * GameConfig.ringSpacing;
  return {
    angleRad,
    x: Math.cos(angleRad) * radius,
    y: Math.sin(angleRad) * radius,
  };
};
