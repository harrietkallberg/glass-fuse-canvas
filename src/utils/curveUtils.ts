
export interface Phase {
  id: string;
  targetTemp: number;
  duration: number;
  holdTime: number;
  velocity?: number; // Store the original velocity used to create this phase
}

export interface ChartDataPoint {
  time: number;
  temperature: number;
  phase: string;
}

export const generateChartData = (phases: Phase[], roomTemp: number): ChartDataPoint[] => {
  let data: ChartDataPoint[] = [];
  let currentTime = 0;
  let currentTemp = roomTemp;
  
  // Add starting point
  data.push({
    time: currentTime,
    temperature: currentTemp,
    phase: "Start"
  });
  
  // Process each phase
  phases.forEach((phase, index) => {
    // Calculate rise time
    if (phase.duration > 0) {
      const timePoints = Math.min(10, phase.duration); // Max 10 points per phase for smooth visualization
      const timeIncrement = phase.duration / timePoints;
      const tempIncrement = (phase.targetTemp - currentTemp) / timePoints;
      
      for (let i = 1; i <= timePoints; i++) {
        currentTime += timeIncrement;
        currentTemp += tempIncrement;
        data.push({
          time: currentTime,
          temperature: currentTemp,
          phase: `Phase ${index + 1} Rise`
        });
      }
    }
    
    // Hold time
    if (phase.holdTime > 0) {
      // Start of hold
      data.push({
        time: currentTime,
        temperature: phase.targetTemp,
        phase: `Phase ${index + 1} Hold Start`
      });
      
      // End of hold
      currentTime += phase.holdTime;
      data.push({
        time: currentTime,
        temperature: phase.targetTemp,
        phase: `Phase ${index + 1} Hold End`
      });
    }
  });
  
  return data;
};

// Calculate total time for the curve
export const calculateTotalTime = (phases: Phase[]): number => {
  return phases.reduce((total, phase) => total + phase.duration + phase.holdTime, 0);
};
