
import { Phase } from './curveUtils';
import { calculatePhaseDuration, calculateVelocities } from './phaseCalculations';

interface GlassInfo {
  namn: string;
  kategori: string;
  f_topptemp: number[];
  s_topptemp: number[];
  t_topptemp: number;
  o_astemp: number;
  n_astemp: number;
}

interface GlassData {
  Glassorter: GlassInfo[];
  "Tider for uppvarmning": any[];
  "Halltider": any[];
  "Avspanningstider": any[];
  "Inledande_smaltpunkt": number;
}

export const getTopTemperature = (selectedGlassInfo: GlassInfo, firingType: string): number => {
  if (firingType === "f") {
    // Exact Python logic: round((glass_info.get("f_topptemp")[0] + glass_info.get("f_topptemp")[1]) / 2)
    return Math.round((selectedGlassInfo.f_topptemp[0] + selectedGlassInfo.f_topptemp[1]) / 2);
  } else if (firingType === "s") {
    // Exact Python logic: round((glass_info.get("s_topptemp")[0] + glass_info.get("s_topptemp")[1]) / 2)
    return Math.round((selectedGlassInfo.s_topptemp[0] + selectedGlassInfo.s_topptemp[1]) / 2);
  } else {
    // Exact Python logic: glass_info.get("t_topptemp")
    return selectedGlassInfo.t_topptemp;
  }
};

export const getTimeFromTable = (table: any, radius: string, layers: string): number => {
  // Exact Python logic: for row in table: if str(radius) in row: return row[str(radius)][str(layers)]
  const radiusRow = table.tabell.find((row: any) => radius in row);
  if (!radiusRow) {
    throw new Error("Radius or layers not found in the table");
  }
  return radiusRow[radius][layers];
};

export const extractTableTimes = (
  glassData: GlassData,
  selectedGlassInfo: GlassInfo,
  ovenType: string,
  glassRadius: string,
  glassLayers: string
) => {
  // Exact Python logic for extracting tables
  const uppvarmningTable = glassData["Tider for uppvarmning"].find(
    item => item.kategori === selectedGlassInfo.kategori && item.ugn === ovenType
  );
  
  const halltiderTable = glassData["Halltider"].find(
    item => item.kategori === selectedGlassInfo.kategori
  );
  
  const avspanningTable = glassData["Avspanningstider"].find(
    item => item.kategori === selectedGlassInfo.kategori
  );

  if (!uppvarmningTable || !halltiderTable || !avspanningTable) {
    throw new Error("Required table not found for the selected glass category and oven type");
  }

  const uppvarmningTime = getTimeFromTable(uppvarmningTable, glassRadius, glassLayers);
  const halltiderTime = getTimeFromTable(halltiderTable, glassRadius, glassLayers);
  const avspanningTime = getTimeFromTable(avspanningTable, glassRadius, glassLayers);

  return { uppvarmningTime, halltiderTime, avspanningTime };
};

export const createGlassTemplatePhases = (
  selectedGlassInfo: GlassInfo,
  glassData: GlassData,
  firingType: string,
  ovenType: string,
  glassRadius: string,
  glassLayers: string,
  topTempMinutes: string,
  roomTemp: number
): Phase[] => {
  const toppTemp = getTopTemperature(selectedGlassInfo, firingType);
  const { uppvarmningTime, halltiderTime, avspanningTime } = extractTableTimes(
    glassData, selectedGlassInfo, ovenType, glassRadius, glassLayers
  );

  const inledandeSmaltpunkt = glassData["Inledande_smaltpunkt"];
  // Exact Python logic: int() conversions
  const oAstemp = Math.floor(selectedGlassInfo.o_astemp);
  const nAstemp = Math.floor(selectedGlassInfo.n_astemp);
  const topTempHoldTime = parseInt(topTempMinutes) || 10;

  // Calculate velocities exactly like Python
  const velocities = calculateVelocities(
    inledandeSmaltpunkt,
    roomTemp,
    uppvarmningTime,
    oAstemp,
    toppTemp,
    halltiderTime,
    nAstemp,
    avspanningTime
  );

  // Calculate durations using the Python _calculateTime logic exactly
  const phase1Duration = calculatePhaseDuration(roomTemp, inledandeSmaltpunkt, velocities.firstHeatingVelocity, 0);
  const phase2Duration = calculatePhaseDuration(inledandeSmaltpunkt, toppTemp, velocities.secondHeatingVelocity, topTempHoldTime);
  const phase3Duration = calculatePhaseDuration(toppTemp, oAstemp, velocities.firstCoolingVelocity, 0);
  const phase4Duration = calculatePhaseDuration(oAstemp, nAstemp, velocities.secondCoolingVelocity, 0);
  const phase5Duration = calculatePhaseDuration(nAstemp, roomTemp, velocities.lastCoolingVelocity, 0);

  console.log('Calculated velocities (matching Python):', velocities);
  console.log('Calculated durations (matching Python):', {
    phase1Duration,
    phase2Duration,
    phase3Duration,
    phase4Duration,
    phase5Duration
  });

  // Create phases exactly like Python script order and store the ORIGINAL velocities (including negative signs):
  // curve.newPhase(first_heating_velocity, inledande_smaltpunkt)
  // curve.newPhase(second_heating_velocity, topptemp, minutes)
  // curve.newPhase(first_cooling_velocity, o_astemp)
  // curve.newPhase(second_cooling_velocity, n_astemp)
  // curve.newPhase(last_cooling_velocity, room_temp)
  return [
    { 
      id: '1', 
      targetTemp: inledandeSmaltpunkt, 
      duration: phase1Duration, 
      holdTime: 0,
      velocity: velocities.firstHeatingVelocity // Store original velocity
    },
    { 
      id: '2', 
      targetTemp: toppTemp, 
      duration: phase2Duration,
      holdTime: topTempHoldTime,
      velocity: velocities.secondHeatingVelocity // Store original velocity
    },
    { 
      id: '3', 
      targetTemp: oAstemp, 
      duration: phase3Duration, 
      holdTime: 0,
      velocity: velocities.firstCoolingVelocity // Store original velocity (negative)
    },
    { 
      id: '4', 
      targetTemp: nAstemp, 
      duration: phase4Duration, 
      holdTime: 0,
      velocity: velocities.secondCoolingVelocity // Store original velocity (negative)
    },
    { 
      id: '5', 
      targetTemp: roomTemp, 
      duration: phase5Duration,
      holdTime: 0,
      velocity: velocities.lastCoolingVelocity // Store original velocity (-20)
    }
  ];
};

// Add backward compatibility alias
export const generateGlassCurve = createGlassTemplatePhases;
