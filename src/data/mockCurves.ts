
interface CurveData {
  time: number;
  temperature: number;
}

export interface Curve {
  id: string;
  title: string;
  description: string;
  lastUpdated: string;
  isPrivate: boolean;
  glassType?: string;
  ovenType?: string;
  thickness?: string;
  projectType?: string;
  isModified?: boolean;
  curveData?: CurveData[];
  colorClass?: string;
}

// Mock data for curves with accurate curve data for visualization
export const mockCurves: Curve[] = [
  {
    id: "1",
    title: "Standard Bowl Fuse",
    description: "Full fuse for 10mm thick glass bowl project",
    lastUpdated: "2 days ago",
    isPrivate: false,
    glassType: "Bullseye",
    ovenType: "t", // Using "t" to match editor format for Top Heated
    thickness: "10mm",
    projectType: "Full Fuse",
    isModified: false,
    curveData: [
      {time: 0, temperature: 20},
      {time: 60, temperature: 250},
      {time: 120, temperature: 500},
      {time: 160, temperature: 750},
      {time: 190, temperature: 750},  // Hold at top temperature
      {time: 240, temperature: 520},  // Controlled cooldown to annealing point
      {time: 320, temperature: 460},  // Annealing
      {time: 380, temperature: 100},
      {time: 440, temperature: 20}
    ]
  },
  {
    id: "2",
    title: "Tack Fuse Experiment",
    description: "Light tack fuse preserving texture for wall art",
    lastUpdated: "1 week ago",
    isPrivate: true,
    glassType: "Float Glass",
    ovenType: "s", // Using "s" to match editor format for Side Heated
    thickness: "4mm",
    projectType: "Tack Fuse",
    isModified: true,
    curveData: [
      {time: 0, temperature: 20},
      {time: 60, temperature: 200},
      {time: 120, temperature: 400},
      {time: 180, temperature: 650},  // Lower top temperature for tack fuse
      {time: 200, temperature: 650},  // Short hold
      {time: 260, temperature: 510},  // Controlled cooldown
      {time: 330, temperature: 450},  // Annealing
      {time: 390, temperature: 100},
      {time: 450, temperature: 20}
    ],
    colorClass: "glass-yellow"
  },
  {
    id: "3",
    title: "Casting Schedule",
    description: "Slow schedule for thick cast glass sculptures",
    lastUpdated: "3 days ago",
    isPrivate: false,
    glassType: "System 96",
    ovenType: "Gas Kiln",
    thickness: "25mm",
    projectType: "Casting",
    isModified: true,
    curveData: [
      {time: 0, temperature: 20},
      {time: 120, temperature: 200},  // Slower ramp for thicker glass
      {time: 240, temperature: 450},
      {time: 360, temperature: 850},  // Higher top temperature for casting
      {time: 420, temperature: 850},  // Longer hold at top
      {time: 540, temperature: 560},  // Slower cooldown
      {time: 660, temperature: 480},  // Extended annealing
      {time: 780, temperature: 300},
      {time: 900, temperature: 20}
    ],
    colorClass: "glass-orange"
  },
  {
    id: "4",
    title: "Slumping Profile",
    description: "Gentle slumping for decorative plate",
    lastUpdated: "yesterday",
    isPrivate: false,
    glassType: "Spectrum",
    ovenType: "Electric Kiln",
    thickness: "6mm",
    projectType: "Slumping",
    isModified: false,
    curveData: [
      {time: 0, temperature: 20},
      {time: 60, temperature: 200},
      {time: 120, temperature: 400},
      {time: 180, temperature: 650},  // Lower temperature for slumping
      {time: 210, temperature: 650},  // Hold
      {time: 270, temperature: 500},
      {time: 330, temperature: 450},
      {time: 390, temperature: 100},
      {time: 450, temperature: 20}
    ],
    colorClass: "glass-green"
  },
  {
    id: "5",
    title: "Delicate Drape",
    description: "Careful schedule for thin glass draping",
    lastUpdated: "3 hours ago",
    isPrivate: true,
    glassType: "Bullseye",
    ovenType: "Ceramic Kiln",
    thickness: "3mm",
    projectType: "Draping",
    isModified: true,
    curveData: [
      {time: 0, temperature: 20},
      {time: 40, temperature: 150},
      {time: 80, temperature: 300},
      {time: 120, temperature: 600},  // Lower temperature for delicate draping
      {time: 140, temperature: 600},  // Short hold
      {time: 180, temperature: 500},
      {time: 240, temperature: 460},
      {time: 300, temperature: 100},
      {time: 360, temperature: 20}
    ],
    colorClass: "glass-turquoise"
  },
];
