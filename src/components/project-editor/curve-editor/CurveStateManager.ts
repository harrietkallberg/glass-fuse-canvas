
import { Phase } from "@/utils/curveUtils";

export const createCurveState = (currentVersionData: any, templateCurveData: any) => {
  if (currentVersionData) {
    return {
      selectedGlass: currentVersionData.version?.selected_glass || "Bullseye Opaleszent",
      roomTemp: currentVersionData.version?.room_temp || 20,
      glassLayers: currentVersionData.version?.glass_layers || "1",
      glassRadius: currentVersionData.version?.glass_radius || "10",
      firingType: currentVersionData.version?.firing_type || "f",
      topTempMinutes: currentVersionData.version?.top_temp_minutes || "10",
      ovenType: currentVersionData.version?.oven_type || "t",
      phases: currentVersionData.phases ? currentVersionData.phases.map((phase: any) => {
        console.log(`Loading phase from DB: targetTemp=${phase.target_temp}, holdTime=${phase.hold_time}, velocity=${phase.velocity}`);
        return {
          id: phase.id,
          targetTemp: phase.target_temp || 0, // Use target_temp from database
          duration: phase.duration || 0,
          holdTime: phase.hold_time || 0, // Use hold_time from database
          velocity: phase.velocity || 0
        };
      }) : []
    };
  }

  // Create default curve state based on template or empty state
  if (templateCurveData?.phases) {
    console.log('Using template curve data with phases:', templateCurveData.phases);
    const phasesWithVelocity = templateCurveData.phases.map((phase: any) => {
      console.log(`Template phase: targetTemp=${phase.targetTemp}, velocity=${phase.velocity}`);
      return {
        ...phase,
        velocity: phase.velocity || 0
      };
    });
    
    return {
      selectedGlass: templateCurveData.settings?.selectedGlass || "Bullseye Opaleszent",
      roomTemp: templateCurveData.settings?.roomTemp || 20,
      glassLayers: templateCurveData.settings?.glassLayers || "1",
      glassRadius: templateCurveData.settings?.glassRadius || "10",
      firingType: templateCurveData.settings?.firingType || "f",
      topTempMinutes: templateCurveData.settings?.topTempMinutes || "10",
      ovenType: templateCurveData.settings?.ovenType || "t",
      phases: phasesWithVelocity
    };
  }
  
  // Default empty state
  return {
    selectedGlass: "Bullseye Opaleszent",
    roomTemp: 20,
    glassLayers: "1",
    glassRadius: "10",
    firingType: "f",
    topTempMinutes: "10",
    ovenType: "t",
    phases: []
  };
};
