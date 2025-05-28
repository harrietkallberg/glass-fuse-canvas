
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { generateChartData } from '@/utils/curveUtils';
import { Phase } from '@/utils/curveUtils';

interface CurveChartProps {
  phases: Phase[];
  roomTemp?: number;
  templatePhases?: Phase[];
}

const CurveChart = ({ phases, roomTemp = 20, templatePhases = [] }: CurveChartProps) => {
  const currentData = generateChartData(phases, roomTemp);
  const templateData = generateChartData(templatePhases, roomTemp);

  // Combine data for display, ensuring all time points are included
  const allTimePoints = new Set([
    ...currentData.map(d => d.time),
    ...templateData.map(d => d.time)
  ]);

  const combinedData = Array.from(allTimePoints).sort((a, b) => a - b).map(time => {
    const currentPoint = currentData.find(d => d.time === time);
    const templatePoint = templateData.find(d => d.time === time);
    
    return {
      time,
      currentTemp: currentPoint?.temperature || null,
      templateTemp: templatePoint?.temperature || null,
    };
  });

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={combinedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="time" 
            label={{ value: 'Time (minutes)', position: 'insideBottom', offset: -10 }}
          />
          <YAxis 
            label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value, name) => [
              value ? `${value}°C` : 'N/A', 
              name === 'currentTemp' ? 'Firing Curve' : 'Template'
            ]}
            labelFormatter={(value) => `Time: ${value} minutes`}
          />
          {templatePhases.length > 0 && (
            <Line 
              type="linear" 
              dataKey="templateTemp" 
              stroke="#D1D5DB" 
              strokeWidth={3}
              strokeDasharray="5 5"
              name="Template Curve"
              connectNulls={false}
              dot={{ fill: '#D1D5DB', strokeWidth: 2, r: 4 }}
            />
          )}
          <Line 
            type="linear" 
            dataKey="currentTemp" 
            stroke="#F97316" 
            strokeWidth={3}
            name="Firing Curve"
            connectNulls={false}
            dot={{ fill: '#F97316', strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CurveChart;
