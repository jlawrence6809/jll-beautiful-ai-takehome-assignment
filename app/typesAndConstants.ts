export type BoxCoord = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export type Box = {
  id: string;
  coords: BoxCoord;
  isSelected: boolean;
};

export const DEFAULT_COORDS: BoxCoord = {
  top: 0,
  left: 0,
  bottom: 100,
  right: 100,
};

export const CONTROL_HEIGHT = 20;
