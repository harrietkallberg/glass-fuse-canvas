import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface GlassSettingsProps {
  glassData: any;
  selectedGlass: string;
  setSelectedGlass: (glass: string) => void;
  roomTemp: number;
  setRoomTemp: (temp: number) => void;
  glassLayers: string;
  setGlassLayers: (layers: string) => void;
  glassRadius: string;
  setGlassRadius: (radius: string) => void;
  firingType: string;
  setFiringType: (type: string) => void;
  topTempMinutes: string;
  setTopTempMinutes: (minutes: string) => void;
  viewGlassTemplate: () => void;
  ovenType: string;
  setOvenType: (type: string) => void;
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
  viewGlassTemplate,
  ovenType,
  setOvenType
}: GlassSettingsProps) => {
  const glassList = glassData.Glassorter;

  const getTranslatedOvenType = (type: string) => {
    switch(type) {
      case "t": return "Top Heated";
      case "s": return "Side Heated";
      default: return "Top Heated";
    }
  };

  return (
    <div className="glass p-6 rounded-2xl space-y-6">
      <h3 className="text-lg font-medium">Glass Settings</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="glass-type">Glass Type</Label>
          <Select value={selectedGlass} onValueChange={setSelectedGlass}>
            <SelectTrigger id="glass-type">
              <SelectValue placeholder="Select glass type" />
            </SelectTrigger>
            <SelectContent>
              {glassList.map((glass: any) => (
                <SelectItem key={glass.namn} value={glass.namn}>
                  {glass.namn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="oven-type">Oven Type</Label>
          <Select value={ovenType} onValueChange={setOvenType}>
            <SelectTrigger id="oven-type">
              <SelectValue placeholder="Select oven type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="t">{getTranslatedOvenType("t")}</SelectItem>
              <SelectItem value="s">{getTranslatedOvenType("s")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="room-temp">Room Temperature (°C)</Label>
          <Input 
            id="room-temp"
            type="number" 
            value={roomTemp} 
            onChange={e => setRoomTemp(Number(e.target.value))}
          />
        </div>
        
        <div>
          <Label htmlFor="glass-layers">Glass Layers</Label>
          <Select value={glassLayers} onValueChange={setGlassLayers}>
            <SelectTrigger id="glass-layers">
              <SelectValue placeholder="Select layers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 layer</SelectItem>
              <SelectItem value="2">2 layers</SelectItem>
              <SelectItem value="3">3 layers</SelectItem>
              <SelectItem value="4">4 layers</SelectItem>
              <SelectItem value="5">5 layers</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="glass-radius">Glass Radius (cm)</Label>
          <Select value={glassRadius} onValueChange={setGlassRadius}>
            <SelectTrigger id="glass-radius">
              <SelectValue placeholder="Select radius" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 cm</SelectItem>
              <SelectItem value="10">10 cm</SelectItem>
              <SelectItem value="20">20 cm</SelectItem>
              <SelectItem value="30">30 cm</SelectItem>
              <SelectItem value="40">40 cm</SelectItem>
              <SelectItem value="50">50 cm</SelectItem>
              <SelectItem value="60">60 cm</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="firing-type">Firing Type</Label>
          <Select value={firingType} onValueChange={setFiringType}>
            <SelectTrigger id="firing-type">
              <SelectValue placeholder="Select firing type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="f">Full Fuse</SelectItem>
              <SelectItem value="s">Slumping</SelectItem>
              <SelectItem value="t">Tack Fuse</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="top-temp-minutes">Hold at Top Temp (minutes)</Label>
          <Input 
            id="top-temp-minutes"
            type="number" 
            value={topTempMinutes} 
            onChange={e => setTopTempMinutes(e.target.value)}
          />
        </div>
        
        <div className="md:col-span-2 flex justify-end">
          <Button onClick={viewGlassTemplate}>
            View Glass Template
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GlassSettings;
