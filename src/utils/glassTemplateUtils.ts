
import { Phase } from './curveUtils';
import { calculatePhaseDuration, calculateVelocities } from './phaseCalculations';

interface GlassInfo {
  namn: string;
  kategori: string;
  f_topptemp: [number, number];
  s_topptemp: [number, number];
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
    return Math.round((selectedGlassInfo.f_topptemp[0] + selectedGlassInfo.f_topptemp[1]) / 2);
  } else if (firingType === "s") {
    return Math.round((selectedGlassInfo.s_topptemp[0] + selectedGlassInfo.s_topptemp[1]) / 2);
  } else {
    return selectedGlassInfo.t_topptemp;
  }
};

export const getTimeFromTable = (table: any, radius: string, layers: string): number => {
  const radiusRow = table.tabell.find((row: any) => radius in row);
  return radiusRow ? radiusRow[radius][layers] : 30; // Default to 30 if not found
};

export const extractTableTimes = (
  glassData: GlassData,
  selectedGlassInfo: GlassInfo,
  ovenType: string,
  glassRadius: string,
  glassLayers: string
) => {
  const uppvarmningTable = glassData["Tider for uppvarmning"].find(
    item => item.kategori === selectedGlassInfo.kategori && item.ugn === ovenType
  );
  
  const halltiderTable = glassData["Halltider"].find(
    item => item.kategori === selectedGlassInfo.kategori
  );
  
  const avspanningTable = glassData["Avspanningstider"].find(
    item => item.kategori === selectedGlassInfo.kategori
  );

  const uppvarmningTime = uppvarmningTable ? 
    getTimeFromTable(uppvarmningTable, glassRadius, glassLayers) : 30;
  
  const halltiderTime = halltiderTable ? 
    getTimeFromTable(halltiderTable, glassRadius, glassLayers) : 20;
  
  const avspanningTime = avspanningTable ? 
    getTimeFromTable(avspanningTable, glassRadius, glassLayers) : 60;

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
  const oAstemp = selectedGlassInfo.o_astemp;
  const nAstemp = selectedGlassInfo.n_astemp;
  const topTempHoldTime = parseInt(topTempMinutes) || 10;

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

  // Calculate durations using the Python _calculateTime logic
  const phase1Duration = calculatePhaseDuration(roomTemp, inledandeSmaltpunkt, velocities.firstHeatingVelocity, 0);
  const phase2Duration = calculatePhaseDuration(inledandeSmaltpunkt, toppTemp, velocities.secondHeatingVelocity, topTempHoldTime);
  const phase3Duration = calculatePhaseDuration(toppTemp, oAstemp, Math.abs(velocities.firstCoolingVelocity), 0);
  const phase4Duration = calculatePhaseDuration(oAstemp, nAstemp, Math.abs(velocities.secondCoolingVelocity), 0);
  const phase5Duration = calculatePhaseDuration(nAstemp, roomTemp, Math.abs(velocities.lastCoolingVelocity), 0);

  console.log('Calculated velocities (matching Python):', velocities);
  console.log('Calculated durations (matching Python):', {
    phase1Duration,
    phase2Duration,
    phase3Duration,
    phase4Duration,
    phase5Duration
  });

  return [
    { 
      id: '1', 
      targetTemp: inledandeSmaltpunkt, 
      duration: phase1Duration, 
      holdTime: 0 
    },
    { 
      id: '2', 
      targetTemp: toppTemp, 
      duration: phase2Duration,
      holdTime: topTempHoldTime 
    },
    { 
      id: '3', 
      targetTemp: oAstemp, 
      duration: phase3Duration, 
      holdTime: 0 
    },
    { 
      id: '4', 
      targetTemp: nAstemp, 
      duration: phase4Duration, 
      holdTime: 0 
    },
    { 
      id: '5', 
      targetTemp: roomTemp, 
      duration: phase5Duration,
      holdTime: 0 
    }
  ];
};
