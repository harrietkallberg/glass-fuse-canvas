
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  Scatter
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
  // Find key temperatures from the selected glass for reference points
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
  
  // Custom legend payload for reference points
  const legendPayload = referenceTemps
    .filter(temp => temp.temp !== undefined)
    .map(temp => ({
      value: `${temp.label} (${temp.temp}°C)`,
      type: 'circle',
      color: temp.color,
      id: temp.label
    }));
  
  // Find the time points where temperature crosses the reference temperatures
  const findReferencePoints = () => {
    const points = [];
    
    if (!chartData || chartData.length < 2 || !selectedGlassInfo) return points;
    
    referenceTemps.forEach(refTemp => {
      if (!refTemp.temp) return;
      
      // Look for where the temperature crosses the reference temperature
      for (let i = 1; i < chartData.length; i++) {
        const prevTemp = chartData[i-1].temperature;
        const currTemp = chartData[i].temperature;
        
        // Check if temperature crosses the reference point (either direction)
        if ((prevTemp <= refTemp.temp && currTemp >= refTemp.temp) || 
            (prevTemp >= refTemp.temp && currTemp <= refTemp.temp)) {
          
          // Interpolate to find the exact time where temperature = reference temp
          const ratio = (refTemp.temp - prevTemp) / (currTemp - prevTemp);
          const time = chartData[i-1].time + ratio * (chartData[i].time - chartData[i-1].time);
          
          points.push({
            time: time,
            temperature: refTemp.temp,
            color: refTemp.color,
            label: refTemp.label
          });
        }
      }
    });
    
    return points;
  };
  
  const referencePoints = findReferencePoints();
  
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
          
          {/* Render special dots for reference temperature points */}
          {referencePoints.map((point, index) => (
            <Scatter 
              key={index}
              name={point.label}
              data={[point]}
              fill={point.color}
              line={false}
              shape={(props) => {
                const { cx, cy } = props;
                return (
                  <circle 
                    cx={cx} 
                    cy={cy} 
                    r={7} 
                    fill={point.color} 
                    stroke="#fff"
                    strokeWidth={2}
                    style={{ opacity: 0.8 }}
                  />
                );
              }}
            />
          ))}
          
          {/* Custom legend for reference points - stacked vertically */}
          <Legend 
            content={() => (
              <div className="flex flex-col items-end gap-2 mt-2 mr-6 text-sm font-medium text-gray-700">
                {legendPayload.map((entry, index) => (
                  <div key={index} className="flex items-center">
                    <span 
                      className="inline-block w-3 h-3 mr-2 rounded-full"
                      style={{ 
                        backgroundColor: entry.color
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
