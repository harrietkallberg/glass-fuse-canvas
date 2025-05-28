
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { generateChartData } from '@/utils/curveUtils';
import { Phase } from '@/utils/curveUtils';

interface CurveChartProps {
  phases: Phase[];
  roomTemp?: number;
  templatePhases?: Phase[];
  isTemplateMode?: boolean;
}

const CurveChart = ({ phases, roomTemp = 20, templatePhases = [], isTemplateMode = false }: CurveChartProps) => {
  const currentData = generateChartData(phases, roomTemp);
  const templateData = generateChartData(templatePhases, roomTemp);

  // Create more linear time points for smoother visualization
  const maxTime = Math.max(
    currentData.length > 0 ? Math.max(...currentData.map(d => d.time)) : 0,
    templateData.length > 0 ? Math.max(...templateData.map(d => d.time)) : 0
  );

  // Generate linear time intervals
  const timeInterval = Math.max(1, Math.floor(maxTime / 100)); // Create ~100 points for smooth curve
  const linearTimePoints = [];
  for (let t = 0; t <= maxTime; t += timeInterval) {
    linearTimePoints.push(t);
  }
  if (linearTimePoints[linearTimePoints.length - 1] !== maxTime) {
    linearTimePoints.push(maxTime);
  }

  // Interpolate data for linear time points
  const interpolateTemperature = (data: any[], time: number) => {
    if (data.length === 0) return null;
    
    // Find the two points that bracket this time
    let beforePoint = data[0];
    let afterPoint = data[data.length - 1];
    
    for (let i = 0; i < data.length - 1; i++) {
      if (data[i].time <= time && data[i + 1].time >= time) {
        beforePoint = data[i];
        afterPoint = data[i + 1];
        break;
      }
    }
    
    // Linear interpolation
    if (beforePoint.time === afterPoint.time) {
      return beforePoint.temperature;
    }
    
    const ratio = (time - beforePoint.time) / (afterPoint.time - beforePoint.time);
    return beforePoint.temperature + ratio * (afterPoint.temperature - beforePoint.temperature);
  };

  const combinedData = linearTimePoints.map(time => ({
    time,
    currentTemp: interpolateTemperature(currentData, time),
    templateTemp: interpolateTemperature(templateData, time),
  }));

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={combinedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="time" 
            type="number"
            scale="linear"
            domain={['dataMin', 'dataMax']}
            label={{ value: 'Time (minutes)', position: 'insideBottom', offset: -10 }}
          />
          <YAxis 
            label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value, name) => [
              value ? `${Math.round(value as number)}°C` : 'N/A', 
              name === 'currentTemp' ? 'Current Version' : 'Template'
            ]}
            labelFormatter={(value) => `Time: ${value} minutes`}
          />
          {!isTemplateMode && <Legend />}
          {templatePhases.length > 0 && (
            <Line 
              type="linear" 
              dataKey="templateTemp" 
              stroke="#D1D5DB" 
              strokeWidth={3}
              strokeDasharray="5 5"
              name="Template Curve"
              connectNulls={false}
              dot={false}
            />
          )}
          <Line 
            type="linear" 
            dataKey="currentTemp" 
            stroke="#F97316" 
            strokeWidth={3}
            name={isTemplateMode ? "Template Curve" : "Current Version"}
            connectNulls={false}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CurveChart;
