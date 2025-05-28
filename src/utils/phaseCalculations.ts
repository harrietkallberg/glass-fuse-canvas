
// Helper function to calculate duration based on velocity (matching Python's _calculateTime exactly)
export const calculatePhaseDuration = (startTemp: number, endTemp: number, velocity: number, holdTime: number): number => {
  if (velocity === 0) {
    return holdTime;
  } else {
    // This matches the Python _calculateTime method exactly
    const calculated_time_minutes = Math.ceil(Math.abs((endTemp - startTemp) / (velocity/60)) + holdTime);
    return calculated_time_minutes;
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
  // Exact Python logic: first_heating_velocity = 999 if np.trunc(60*(inledande_smaltpunkt - room_temp)/uppvarmning_time) >= 999 else np.trunc(60*(inledande_smaltpunkt - room_temp)/uppvarmning_time)
  const firstHeatingVelocity = Math.trunc(60 * (inledandeSmaltpunkt - roomTemp) / uppvarmningTime) >= 999 
    ? 999 
    : Math.trunc(60 * (inledandeSmaltpunkt - roomTemp) / uppvarmningTime);
  
  // Exact Python logic: second_heating_velocity = 999
  const secondHeatingVelocity = 999;
  
  // Exact Python logic: first_cooling_velocity = np.trunc(60*(o_astemp - topptemp)/halltider_time)
  const firstCoolingVelocity = Math.trunc(60 * (oAstemp - toppTemp) / halltiderTime);
  
  // Exact Python logic: second_cooling_velocity = np.trunc(60*(n_astemp - o_astemp)/avspanning_time)
  const secondCoolingVelocity = Math.trunc(60 * (nAstemp - oAstemp) / avspanningTime);
  
  // Exact Python logic: last_cooling_velocity = -20
  const lastCoolingVelocity = -20;

  return {
    firstHeatingVelocity,
    secondHeatingVelocity,
    firstCoolingVelocity,
    secondCoolingVelocity,
    lastCoolingVelocity
  };
};
