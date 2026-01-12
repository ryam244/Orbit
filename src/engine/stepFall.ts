export type FallState = {
  ringPos: number;
  velocity: number;
};

export type FallStepResult = {
  ringPos: number;
  didLand: boolean;
};

export const stepFall = (state: FallState, deltaSeconds: number): FallStepResult => {
  // TODO:
  // - advance ring position by velocity * dt
  // - clamp to the last available ring
  // - signal landing when the next step would exceed the grid
  const ringPos = state.ringPos + state.velocity * deltaSeconds;
  return {
    ringPos,
    didLand: false,
  };
};
