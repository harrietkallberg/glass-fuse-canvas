
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useCurveState } from '@/hooks/useCurveState';
import CurveChart from '@/components/curve-editor/CurveChart';
import PhasesTable from '@/components/curve-editor/PhasesTable';
import { Phase, calculateTotalTime } from '@/utils/curveUtils';
import { TemplateSettings } from '@/hooks/useTemplateState';
import { BarChart3, Table } from 'lucide-react';
import glassData from '../../tables.json';

interface TemplateCurveEditorProps {
  initialPhases: Phase[];
  initialSettings: TemplateSettings;
  onSave: (phases: Phase[], settings: TemplateSettings) => void;
  onChange?: () => void;
  isLoading?: boolean;
}

const TemplateCurveEditor = ({
  initialPhases,
  initialSettings,
  onSave,
  onChange,
  isLoading = false
}: TemplateCurveEditorProps) => {
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  const [hasChanges, setHasChanges] = useState(false);
  
  // Initialize curve state with the provided data
  const curveState = useCurveState({ initialPhases });

  // Local state for template settings
  const [settings, setSettings] = useState<TemplateSettings>(initialSettings);

  // Update curve state when initialPhases change
  useEffect(() => {
    if (initialPhases.length > 0) {
      curveState.setPhases(initialPhases);
    }
  }, [initialPhases]);

  // Update settings when initialSettings change
  useEffect(() => {
    setSettings(initialSettings);
    curveState.setSelectedGlass(initialSettings.selectedGlass);
    curveState.setRoomTemp(initialSettings.roomTemp);
    curveState.setGlassLayers(initialSettings.glassLayers);
    curveState.setGlassRadius(initialSettings.glassRadius);
    curveState.setFiringType(initialSettings.firingType);
    curveState.setTopTempMinutes(initialSettings.topTempMinutes);
    curveState.setOvenType(initialSettings.ovenType);
  }, [initialSettings]);

  const handleSettingChange = (key: keyof TemplateSettings, value: string | number) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    setHasChanges(true);
    onChange?.();

    // Update curve state accordingly
    switch (key) {
      case 'selectedGlass':
        curveState.setSelectedGlass(value as string);
        break;
      case 'roomTemp':
        curveState.setRoomTemp(value as number);
        break;
      case 'glassLayers':
        curveState.setGlassLayers(value as string);
        break;
      case 'glassRadius':
        curveState.setGlassRadius(value as string);
        break;
      case 'firingType':
        curveState.setFiringType(value as string);
        break;
      case 'topTempMinutes':
        curveState.setTopTempMinutes(value as string);
        break;
      case 'ovenType':
        curveState.setOvenType(value as string);
        break;
    }
  };

  const handlePhaseChange = () => {
    setHasChanges(true);
    onChange?.();
  };

  const handleApplyTemplate = () => {
    curveState.applyGlassTemplate();
    setHasChanges(true);
    onChange?.();
  };

  const handleSave = () => {
    onSave(curveState.phases, settings);
    setHasChanges(false);
  };

  // Use selectedGlassInfo property instead of getSelectedGlassInfo method
  const selectedGlassInfo = curveState.selectedGlassInfo;

  return (
    <div className="space-y-6">
      {/* Glass Settings Section */}
      <div className="bg-white/60 p-4 rounded-xl border border-white/50">
        <h4 className="font-medium mb-4 text-gray-800">Glass & Firing Parameters</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Glass Type */}
          <div>
            <Label htmlFor="glassType">Glass Type</Label>
            <Select
              value={settings.selectedGlass}
              onValueChange={(value) => handleSettingChange('selectedGlass', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select glass type" />
              </SelectTrigger>
              <SelectContent>
                {glassData.Glassorter.map((glass) => (
                  <SelectItem key={glass.namn} value={glass.namn}>
                    {glass.namn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Room Temperature */}
          <div>
            <Label htmlFor="roomTemp">Room Temperature (°C)</Label>
            <Input
              id="roomTemp"
              type="number"
              value={settings.roomTemp}
              onChange={(e) => handleSettingChange('roomTemp', parseInt(e.target.value) || 20)}
              className="mt-1"
            />
          </div>

          {/* Glass Layers */}
          <div>
            <Label htmlFor="glassLayers">Glass Layers</Label>
            <Select
              value={settings.glassLayers}
              onValueChange={(value) => handleSettingChange('glassLayers', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Layer</SelectItem>
                <SelectItem value="2">2 Layers</SelectItem>
                <SelectItem value="3">3 Layers</SelectItem>
                <SelectItem value="4">4 Layers</SelectItem>
                <SelectItem value="5">5 Layers</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Glass Radius */}
          <div>
            <Label htmlFor="glassRadius">Glass Radius (cm)</Label>
            <Input
              id="glassRadius"
              type="number"
              value={settings.glassRadius}
              onChange={(e) => handleSettingChange('glassRadius', e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Firing Type */}
          <div>
            <Label htmlFor="firingType">Firing Type</Label>
            <Select
              value={settings.firingType}
              onValueChange={(value) => handleSettingChange('firingType', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="f">Full Fuse</SelectItem>
                <SelectItem value="s">Slump</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Top Temperature Minutes */}
          <div>
            <Label htmlFor="topTempMinutes">Top Temperature Hold (min)</Label>
            <Input
              id="topTempMinutes"
              type="number"
              value={settings.topTempMinutes}
              onChange={(e) => handleSettingChange('topTempMinutes', e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Oven Type */}
          <div>
            <Label htmlFor="ovenType">Oven Type</Label>
            <Select
              value={settings.ovenType}
              onValueChange={(value) => handleSettingChange('ovenType', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="t">Top Heated</SelectItem>
                <SelectItem value="s">Side Heated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Apply Template Button */}
        <div className="mt-4 flex justify-end">
          <Button
            onClick={handleApplyTemplate}
            variant="outline"
            className="gap-2"
          >
            Generate Template
          </Button>
        </div>

        {/* Glass Info Display */}
        {selectedGlassInfo && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h5 className="font-medium text-blue-800 mb-2">Glass Information</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-blue-600">Category:</span>
                <span className="ml-2 font-medium">{selectedGlassInfo.kategori}</span>
              </div>
              <div>
                <span className="text-blue-600">Upper Annealing:</span>
                <span className="ml-2 font-medium">{selectedGlassInfo.o_astemp}°C</span>
              </div>
              <div>
                <span className="text-blue-600">Lower Annealing:</span>
                <span className="ml-2 font-medium">{selectedGlassInfo.n_astemp}°C</span>
              </div>
              <div>
                <span className="text-blue-600">Name:</span>
                <span className="ml-2 font-medium">{selectedGlassInfo.namn}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Curve Display Section */}
      <div className="bg-white/60 p-4 rounded-xl border border-white/50">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium text-gray-800">Template Firing Curve</h4>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Total time: {calculateTotalTime(curveState.phases)} min
            </div>
            
            {/* Enhanced View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1 border">
              <button
                onClick={() => setViewMode('chart')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  viewMode === 'chart' 
                    ? 'bg-white text-gray-900 shadow-sm border border-gray-200' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Visual
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  viewMode === 'table' 
                    ? 'bg-white text-gray-900 shadow-sm border border-gray-200' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Table className="w-4 h-4" />
                Tabular
              </button>
            </div>
          </div>
        </div>

        {/* Chart or Table View */}
        {viewMode === 'chart' ? (
          <CurveChart 
            phases={curveState.phases}
            roomTemp={curveState.roomTemp}
          />
        ) : (
          <PhasesTable 
            phases={curveState.phases}
            updatePhase={(id, field, value) => {
              curveState.updatePhase(id, field, value);
              handlePhaseChange();
            }}
            addPhase={() => {
              curveState.addPhase();
              handlePhaseChange();
            }}
            removePhase={(id) => {
              curveState.removePhase(id);
              handlePhaseChange();
            }}
            handleSave={handleSave}
            selectedGlassInfo={selectedGlassInfo}
          />
        )}
      </div>

      {/* Save Button - only show if there are changes and not in new curve mode */}
      {hasChanges && (
        <div className="flex justify-end">
          <Button 
            onClick={handleSave}
            className="bg-[#F97316] hover:bg-[#F97316]/90 text-white px-6 py-2"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Template Changes"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default TemplateCurveEditor;
