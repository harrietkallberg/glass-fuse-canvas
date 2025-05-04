
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartBar } from 'lucide-react';

interface GlassType {
  namn: string;
  kategori: string;
  [key: string]: any;
}

interface GlassSettingsProps {
  glassData: {
    Glassorter: GlassType[];
  };
  selectedGlass: string;
  setSelectedGlass: (value: string) => void;
  roomTemp: number;
  setRoomTemp: (value: number) => void;
  glassLayers: string;
  setGlassLayers: (value: string) => void;
  glassRadius: string;
  setGlassRadius: (value: string) => void;
  firingType: string;
  setFiringType: (value: string) => void;
  topTempMinutes: string;
  setTopTempMinutes: (value: string) => void;
  applyGlassTemplate: () => void;
}

const GlassSettings = ({
  glassData,
  selectedGlass,
  setSelectedGlass,
  roomTemp,
  setRoomTemp,
  glassLayers,
  setGlassLayers,
  glassRadius,
  setGlassRadius,
  firingType,
  setFiringType,
  topTempMinutes,
  setTopTempMinutes,
  applyGlassTemplate
}: GlassSettingsProps) => {
  return (
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

        <div>
          <Label htmlFor="top-temp-minutes">Top Temp Hold (min)</Label>
          <Input
            id="top-temp-minutes"
            type="number"
            value={topTempMinutes}
            min="1"
            max="60"
            onChange={(e) => setTopTempMinutes(e.target.value)}
            className="mt-1"
          />
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
  );
};

export default GlassSettings;
