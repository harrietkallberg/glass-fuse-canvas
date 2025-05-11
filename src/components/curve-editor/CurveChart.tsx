
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

interface CurveChartProps {
  chartData: any[];
  selectedGlassInfo: {
    o_astemp?: number;
    n_astemp?: number;
    [key: string]: any;
  } | undefined;
}

const CurveChart = ({ chartData, selectedGlassInfo }: CurveChartProps) => {
  // Custom colors for the chart - these match the colors used in the CurveCard component
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
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CurveChart;
