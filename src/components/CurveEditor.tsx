
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Save, ChartBar } from 'lucide-react';
import { ChartContainer } from '@/components/ui/chart';
import glassData from '../tables.json';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface Phase {
  id: string;
  targetTemp: number;
  duration: number;
  holdTime: number;
}

interface CurveEditorProps {
  initialPhases?: Phase[];
  onSave?: (phases: Phase[]) => void;
}

const CurveEditor = ({ initialPhases = [], onSave }: CurveEditorProps) => {
  const [phases, setPhases] = useState<Phase[]>(
    initialPhases.length > 0 
      ? initialPhases 
      : [{ id: '1', targetTemp: 700, duration: 30, holdTime: 10 }]
  );
  
  const [activeTab, setActiveTab] = useState('chart');
  const [selectedGlass, setSelectedGlass] = useState<string>(glassData.Glassorter[0].namn);
  const [roomTemp, setRoomTemp] = useState<number>(20);
  const [glassLayers, setGlassLayers] = useState<string>("1");
  const [glassRadius, setGlassRadius] = useState<string>("10");
  const [firingType, setFiringType] = useState<string>("f");
  const [chartData, setChartData] = useState<any[]>([]);

  // Find selected glass info
  const selectedGlassInfo = glassData.Glassorter.find(glass => glass.namn === selectedGlass);

  useEffect(() => {
    generateChartData();
  }, [phases]);

  // Generate data for the chart
  const generateChartData = () => {
    let data = [];
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
    
    setChartData(data);
  };

  const addPhase = () => {
    const lastPhase = phases[phases.length - 1];
    const newPhase = {
      id: Date.now().toString(),
      targetTemp: lastPhase?.targetTemp || 700,
      duration: 30,
      holdTime: 10,
    };
    setPhases([...phases, newPhase]);
  };

  const removePhase = (id: string) => {
    if (phases.length <= 1) return;
    setPhases(phases.filter(phase => phase.id !== id));
  };

  const updatePhase = (id: string, field: keyof Phase, value: number) => {
    setPhases(
      phases.map(phase => 
        phase.id === id ? { ...phase, [field]: value } : phase
      )
    );
  };

  const handleSave = () => {
    if (onSave) onSave(phases);
  };

  // Calculate total time
  const calculateTotalTime = () => {
    return phases.reduce((total, phase) => total + phase.duration + phase.holdTime, 0);
  };

  // Apply template based on glass info
  const applyGlassTemplate = () => {
    if (!selectedGlassInfo) return;
    
    let toppTemp;
    
    // Select proper top temperature based on firing type
    if (firingType === "f") {
      toppTemp = Math.round((selectedGlassInfo.f_topptemp[0] + selectedGlassInfo.f_topptemp[1]) / 2);
    } else if (firingType === "s") {
      toppTemp = Math.round((selectedGlassInfo.s_topptemp[0] + selectedGlassInfo.s_topptemp[1]) / 2);
    } else {
      toppTemp = selectedGlassInfo.t_topptemp;
    }

    // Get matching table for the selected glass category and oven type
    const uppvarmningTable = glassData["Tider for uppvarmning"].find(
      item => item.kategori === selectedGlassInfo.kategori && item.ugn === "t"
    );
    
    const halltiderTable = glassData["Halltider"].find(
      item => item.kategori === selectedGlassInfo.kategori
    );
    
    const avspanningTable = glassData["Avspanningstider"].find(
      item => item.kategori === selectedGlassInfo.kategori
    );

    // Extract times from tables
    const getTimeFromTable = (table: any, radius: string, layers: string) => {
      const radiusRow = table.tabell.find((row: any) => radius in row);
      return radiusRow ? radiusRow[radius][layers] : 30; // Default to 30 if not found
    };

    const uppvarmningTime = uppvarmningTable ? 
      getTimeFromTable(uppvarmningTable, glassRadius, glassLayers) : 30;
    
    const halltiderTime = halltiderTable ? 
      getTimeFromTable(halltiderTable, glassRadius, glassLayers) : 20;
    
    const avspanningTime = avspanningTable ? 
      getTimeFromTable(avspanningTable, glassRadius, glassLayers) : 60;

    // Create phases based on the firing curve algorithm in the Python script
    const inledandeSmaltpunkt = glassData["Inledande_smaltpunkt"];
    const oAstemp = selectedGlassInfo.o_astemp;
    const nAstemp = selectedGlassInfo.n_astemp;

    // Calculate velocities (converted from hourly to per-minute)
    const firstHeatingVelocity = Math.min(
      999, 
      Math.floor(60 * (inledandeSmaltpunkt - roomTemp) / uppvarmningTime)
    );
    
    const firstCoolingVelocity = Math.floor(60 * (oAstemp - toppTemp) / halltiderTime);
    const secondCoolingVelocity = Math.floor(60 * (nAstemp - oAstemp) / avspanningTime);
    
    // Create the new phases
    const newPhases = [
      { 
        id: '1', 
        targetTemp: inledandeSmaltpunkt, 
        duration: uppvarmningTime, 
        holdTime: 0 
      },
      { 
        id: '2', 
        targetTemp: toppTemp, 
        duration: 15, // Fast rise to top temp
        holdTime: 10 // Default hold time
      },
      { 
        id: '3', 
        targetTemp: oAstemp, 
        duration: halltiderTime, 
        holdTime: 0 
      },
      { 
        id: '4', 
        targetTemp: nAstemp, 
        duration: avspanningTime, 
        holdTime: 0 
      },
      { 
        id: '5', 
        targetTemp: roomTemp, 
        duration: 60, // Slow cooling to room temp
        holdTime: 0 
      }
    ];
    
    setPhases(newPhases);
  };

  const renderChart = () => {
    // Find key temperatures from the selected glass for reference lines
    const referenceTemps = selectedGlassInfo ? [
      { temp: selectedGlassInfo.o_astemp, label: 'Upper Annealing' },
      { temp: selectedGlassInfo.n_astemp, label: 'Lower Annealing' }
    ] : [];
    
    // Custom colors for the chart
    const chartColors = {
      line: '#FEC6A1',
      grid: '#F2FCE2',
      text: '#333333'
    };
    
    return (
      <div className="h-[400px] w-full bg-glass-100/20 rounded-lg p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={chartData}
            margin={{ top: 5, right: 20, left: 20, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
            <XAxis 
              dataKey="time" 
              label={{ value: 'Time (minutes)', position: 'insideBottomRight', offset: -10 }}
              stroke={chartColors.text}
            />
            <YAxis 
              label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
              domain={[0, 'auto']}
              stroke={chartColors.text}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255,255,255,0.9)', 
                borderColor: chartColors.line,
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}
              formatter={(value, name) => [
                `${Math.round(Number(value))}${name === 'temperature' ? '°C' : ' min'}`, 
                name === 'temperature' ? 'Temperature' : 'Time'
              ]}
            />
            <Line 
              type="monotone" 
              dataKey="temperature" 
              stroke={chartColors.line} 
              strokeWidth={3}
              dot={{ fill: '#FFDEE2', strokeWidth: 2, r: 4, strokeDasharray: '' }}
              activeDot={{ r: 6, fill: '#FDE1D3' }}
            />
            
            {/* Reference lines for annealing temperatures */}
            {referenceTemps.map((temp, index) => (
              <ReferenceLine 
                key={index}
                y={temp.temp} 
                stroke="#E5DEFF" 
                strokeDasharray="3 3" 
                label={{ 
                  value: `${temp.label}: ${temp.temp}°C`, 
                  fill: '#683bfa',
                  position: 'right'
                }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderTable = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-4 px-2 py-2 bg-muted/30 rounded-lg">
          <div className="font-medium">Phase</div>
          <div className="font-medium">Target Temp (°C)</div>
          <div className="font-medium">Rise Time (min)</div>
          <div className="font-medium">Hold Time (min)</div>
        </div>
        
        {phases.map((phase, index) => (
          <div key={phase.id} className="grid grid-cols-4 gap-4 items-center">
            <div>Phase {index + 1}</div>
            
            <div>
              <Input
                type="number"
                value={phase.targetTemp}
                onChange={(e) => updatePhase(phase.id, 'targetTemp', parseInt(e.target.value) || 0)}
                className="h-9"
              />
            </div>
            
            <div>
              <Input
                type="number"
                value={phase.duration}
                onChange={(e) => updatePhase(phase.id, 'duration', parseInt(e.target.value) || 0)}
                className="h-9"
              />
            </div>
            
            <div className="flex gap-2">
              <Input
                type="number"
                value={phase.holdTime}
                onChange={(e) => updatePhase(phase.id, 'holdTime', parseInt(e.target.value) || 0)}
                className="h-9"
              />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => removePhase(phase.id)}
                className="h-9 w-9"
                disabled={phases.length <= 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        
        <div className="flex justify-between">
          <Button onClick={addPhase} variant="outline" className="gap-1">
            <Plus className="h-4 w-4" /> Add Phase
          </Button>
          
          <Button onClick={handleSave} className="gap-1">
            <Save className="h-4 w-4" /> Save Changes
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Glass Selection and Parameters */}
      <div className="glass p-6 rounded-2xl bg-glass-100/20">
        <h3 className="text-lg font-medium mb-4">Glass Settings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="glass-type">Glass Type</Label>
            <Select 
              value={selectedGlass} 
              onValueChange={setSelectedGlass}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select glass type" />
              </SelectTrigger>
              <SelectContent>
                {glassData.Glassorter.map((glass) => (
                  <SelectItem key={glass.namn} value={glass.namn}>
                    {glass.namn} ({glass.kategori})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="room-temp">Room Temperature (°C)</Label>
            <Input
              id="room-temp"
              type="number"
              value={roomTemp}
              onChange={(e) => setRoomTemp(parseInt(e.target.value) || 20)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="firing-type">Firing Type</Label>
            <Select 
              value={firingType} 
              onValueChange={setFiringType}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select firing type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="f">Full Fusing</SelectItem>
                <SelectItem value="s">Slumping</SelectItem>
                <SelectItem value="t">Tack Fusing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="glass-layers">Glass Layers</Label>
            <Select 
              value={glassLayers} 
              onValueChange={setGlassLayers}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select layers" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? 'Layer' : 'Layers'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="glass-radius">Max Radius (cm)</Label>
            <Select 
              value={glassRadius} 
              onValueChange={setGlassRadius}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select max radius" />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 30, 40, 50, 60].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} cm
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button 
              onClick={applyGlassTemplate} 
              className="w-full gap-1"
            >
              <ChartBar className="h-4 w-4" />
              Generate Curve
            </Button>
          </div>
        </div>
      </div>

      {/* Curve Editor */}
      <div className="glass p-6 rounded-2xl">
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-medium">Firing Curve</h3>
          <div className="text-sm text-muted-foreground">
            Total time: {calculateTotalTime()} min
          </div>
        </div>
        
        <Tabs defaultValue="chart" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="chart">Visual Curve</TabsTrigger>
            <TabsTrigger value="table">Table View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart" className="mt-0">
            {renderChart()}
          </TabsContent>
          
          <TabsContent value="table" className="mt-0">
            {renderTable()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CurveEditor;
