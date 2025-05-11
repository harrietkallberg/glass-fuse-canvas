
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  Legend
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
  // Find key temperatures from the selected glass for reference lines
  const referenceTemps = selectedGlassInfo ? [
    { temp: selectedGlassInfo.o_astemp, label: 'Upper Annealing', color: '#8B5CF6' },
    { temp: selectedGlassInfo.n_astemp, label: 'Lower Annealing', color: '#F97316' }
  ] : [];
  
  // Custom colors for the chart - these match the colors used in the CurveCard component
  const chartColors = {
    line: '#FEC6A1',
    grid: '#F2FCE2',
    text: '#333333'
  };
  
  // Custom legend payload for reference lines
  const legendPayload = referenceTemps
    .filter(temp => temp.temp !== undefined)
    .map(temp => ({
      value: `${temp.label} (${temp.temp}°C)`,
      type: 'line',
      color: temp.color,
      id: temp.label
    }));
  
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
          
          {/* Reference lines for annealing temperatures - now with different colors and no labels */}
          {referenceTemps.map((temp, index) => (
            temp.temp && (
              <ReferenceLine 
                key={index}
                y={temp.temp} 
                stroke={temp.color}
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            )
          ))}
          
          {/* Custom legend for reference lines */}
          <Legend 
            content={({ payload }) => (
              <div className="flex justify-end gap-4 mt-1 mr-4 text-xs font-medium">
                {legendPayload.map((entry, index) => (
                  <div key={index} className="flex items-center">
                    <span 
                      className="inline-block w-4 h-[2px] mr-1"
                      style={{ 
                        backgroundColor: entry.color,
                        borderTop: `2px dashed ${entry.color}`
                      }} 
                    />
                    <span>{entry.value}</span>
                  </div>
                ))}
              </div>
            )}
            wrapperStyle={{ top: 0, right: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CurveChart;
