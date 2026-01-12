export type LockInput = {
  grid: Uint8Array;
  index: number;
  color: number;
};

export const lockBlock = ({ grid, index, color }: LockInput): Uint8Array => {
  // TODO:
  // - copy the grid if immutability is required
  // - write the color into the specified index
  // - return the updated grid
  const next = new Uint8Array(grid);
  next[index] = color;
  return next;
};
