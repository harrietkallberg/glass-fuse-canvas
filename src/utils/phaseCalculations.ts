
// Helper function to calculate duration based on velocity (matching Python's _calculateTime)
export const calculatePhaseDuration = (startTemp: number, endTemp: number, velocity: number, holdTime: number): number => {
  if (velocity === 0) {
    return holdTime;
  } else {
    return Math.ceil(Math.abs((endTemp - startTemp) / (velocity / 60)) + holdTime);
  }
};

// Calculate velocities exactly like in Python code using Math.trunc
export const calculateVelocities = (
  inledandeSmaltpunkt: number,
  roomTemp: number,
  uppvarmningTime: number,
  oAstemp: number,
  toppTemp: number,
  halltiderTime: number,
  nAstemp: number,
  avspanningTime: number
) => {
  const firstHeatingVelocity = Math.trunc(60 * (inledandeSmaltpunkt - roomTemp) / uppvarmningTime) >= 999 
    ? 999 
    : Math.trunc(60 * (inledandeSmaltpunkt - roomTemp) / uppvarmningTime);
  const secondHeatingVelocity = 999; // Very high velocity to top temp
  const firstCoolingVelocity = Math.trunc(60 * (oAstemp - toppTemp) / halltiderTime);
  const secondCoolingVelocity = Math.trunc(60 * (nAstemp - oAstemp) / avspanningTime);
  const lastCoolingVelocity = -20;

  return {
    firstHeatingVelocity,
    secondHeatingVelocity,
    firstCoolingVelocity,
    secondCoolingVelocity,
    lastCoolingVelocity
  };
};
