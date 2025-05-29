
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { generateChartData, calculateTotalTime } from '@/utils/curveUtils';
import { Phase } from '@/utils/curveUtils';

interface CurveChartProps {
  phases: Phase[];
  roomTemp?: number;
  templatePhases?: Phase[];
}

const CurveChart = ({ phases, roomTemp = 20, templatePhases = [] }: CurveChartProps) => {
  const currentData = generateChartData(phases, roomTemp);
  const templateData = generateChartData(templatePhases, roomTemp);

  // Calculate total time in hours and minutes
  const totalMinutes = calculateTotalTime(phases);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const timeDisplay = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

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
    <div className="w-full">
      {/* Time Display */}
      <div className="text-center mb-4">
        <div className="inline-block glass-vibrant-orange px-6 py-3 rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800">
            Total Firing Time: {timeDisplay}
          </h3>
        </div>
      </div>
      
      {/* Chart Container with Enhanced Glass Effect - Match project info site width */}
      <div className="enhanced-glass-card p-6 h-96 w-full max-w-[800px] mx-auto">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={combinedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.3)" />
            <XAxis 
              dataKey="time" 
              label={{ value: 'Time (minutes)', position: 'insideBottom', offset: -10 }}
              stroke="rgba(75, 85, 99, 0.8)"
            />
            <YAxis 
              label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
              stroke="rgba(75, 85, 99, 0.8)"
            />
            <Tooltip 
              formatter={(value, name) => [
                value ? `${value}°C` : 'N/A', 
                name === 'currentTemp' ? 'Current Version' : 'Template'
              ]}
              labelFormatter={(value) => `Time: ${value} minutes`}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}
            />
            {templatePhases.length > 0 && (
              <Line 
                type="linear" 
                dataKey="templateTemp" 
                stroke="#9CA3AF" 
                strokeWidth={3}
                strokeDasharray="8 4"
                name="Template"
                connectNulls={false}
                dot={{ fill: '#9CA3AF', strokeWidth: 2, r: 4 }}
              />
            )}
            <Line 
              type="linear" 
              dataKey="currentTemp" 
              stroke="#F97316" 
              strokeWidth={3}
              name="Current Version"
              connectNulls={false}
              dot={{ fill: '#F97316', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CurveChart;
