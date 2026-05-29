import React, { useState } from 'react';
import Card from '../ui/Card';
import { BarChart2, TrendingUp as LineChartIcon } from 'lucide-react';

interface ChartDataPoint {
  month: string;
  pemasukan: number;
  pengeluaran: number;
}

interface FinancialChartProps {
  data?: ChartDataPoint[];
  className?: string;
}

const defaultChartData: ChartDataPoint[] = [
  { month: 'Jan', pemasukan: 4500000, pengeluaran: 3000000 },
  { month: 'Feb', pemasukan: 5000000, pengeluaran: 3200000 },
  { month: 'Mar', pemasukan: 4800000, pengeluaran: 4100000 },
  { month: 'Apr', pemasukan: 6200000, pengeluaran: 3500000 },
  { month: 'Mei', pemasukan: 7500000, pengeluaran: 4800000 },
  { month: 'Jun', pemasukan: 8000000, pengeluaran: 5200000 }
];

export const FinancialChart: React.FC<FinancialChartProps> = ({
  data = defaultChartData,
  className = ''
}) => {
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoveredType, setHoveredType] = useState<'pemasukan' | 'pengeluaran' | null>(null);

  const formatIDR = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Find max value to scale chart appropriately
  const maxVal = Math.max(
    ...data.flatMap(d => [d.pemasukan, d.pengeluaran]),
    5000000 // min ceiling
  ) * 1.15; // 15% headroom

  const chartHeight = 200;
  const chartWidth = 500;
  const padding = { top: 20, right: 20, bottom: 30, left: 60 };

  const usableWidth = chartWidth - padding.left - padding.right;
  const usableHeight = chartHeight - padding.top - padding.bottom;

  // Grid lines
  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <Card className={`flex flex-col gap-6 bg-bg-custom ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-dark-custom select-none">Analisis Arus Kas</h3>
          <p className="text-xs font-semibold text-secondary-custom select-none">
            Perbandingan pemasukan & pengeluaran Anda
          </p>
        </div>

        {/* Toggle Chart Type */}
        <div className="flex gap-2 p-1 bg-bg-custom shadow-neumorph-sm-in rounded-[14px] self-start sm:self-auto">
          <button
            onClick={() => setChartType('bar')}
            className={`p-2 rounded-[10px] transition-all duration-200 ${
              chartType === 'bar'
                ? 'bg-bg-custom text-primary-custom shadow-neumorph-sm-out font-bold'
                : 'text-secondary-custom hover:text-dark-custom'
            }`}
            title="Grafik Batang"
          >
            <BarChart2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`p-2 rounded-[10px] transition-all duration-200 ${
              chartType === 'line'
                ? 'bg-bg-custom text-primary-custom shadow-neumorph-sm-out font-bold'
                : 'text-secondary-custom hover:text-dark-custom'
            }`}
            title="Grafik Garis Area"
          >
            <LineChartIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full aspect-[21/9] min-h-[220px]">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-full overflow-visible font-sans"
        >
          {/* Gradients */}
          <defs>
            <linearGradient id="pemasukanGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4CAF50" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#4CAF50" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="pengeluaranGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF5C5C" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FF5C5C" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Grid lines & Y Axis labels */}
          {gridLines.map((ratio, i) => {
            const y = padding.top + usableHeight * (1 - ratio);
            const val = maxVal * ratio;
            return (
              <g key={i} className="opacity-40">
                <line
                  x1={padding.left}
                  y1={y}
                  x2={chartWidth - padding.right}
                  y2={y}
                  stroke="#BEC3C9"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="9"
                  fontWeight="600"
                  fill="#718096"
                >
                  {val >= 1000000
                    ? `${(val / 1000000).toFixed(1)}Jt`
                    : val >= 1000
                    ? `${(val / 1000).toFixed(0)}Rb`
                    : val.toFixed(0)}
                </text>
              </g>
            );
          })}

          {/* Render Bars */}
          {chartType === 'bar' &&
            data.map((d, index) => {
              const groupWidth = usableWidth / data.length;
              const barWidth = Math.min(14, groupWidth * 0.3);
              const xGroup = padding.left + index * groupWidth + groupWidth / 2;

              const hPem = (d.pemasukan / maxVal) * usableHeight;
              const yPem = padding.top + usableHeight - hPem;
              const xPem = xGroup - barWidth - 2;

              const hPeng = (d.pengeluaran / maxVal) * usableHeight;
              const yPeng = padding.top + usableHeight - hPeng;
              const xPeng = xGroup + 2;

              return (
                <g key={index} className="transition-all duration-300">
                  {/* Pemasukan Bar (Green) */}
                  <rect
                    x={xPem}
                    y={yPem}
                    width={barWidth}
                    height={hPem}
                    rx={barWidth / 2}
                    fill="#4CAF50"
                    className="cursor-pointer transition-all duration-300 hover:brightness-105"
                    onMouseEnter={() => {
                      setHoveredIndex(index);
                      setHoveredType('pemasukan');
                    }}
                    onMouseLeave={() => {
                      setHoveredIndex(null);
                      setHoveredType(null);
                    }}
                  />

                  {/* Pengeluaran Bar (Red) */}
                  <rect
                    x={xPeng}
                    y={yPeng}
                    width={barWidth}
                    height={hPeng}
                    rx={barWidth / 2}
                    fill="#FF5C5C"
                    className="cursor-pointer transition-all duration-300 hover:brightness-105"
                    onMouseEnter={() => {
                      setHoveredIndex(index);
                      setHoveredType('pengeluaran');
                    }}
                    onMouseLeave={() => {
                      setHoveredIndex(null);
                      setHoveredType(null);
                    }}
                  />

                  {/* X Axis Label */}
                  <text
                    x={xGroup}
                    y={chartHeight - 8}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="600"
                    fill="#718096"
                    className="select-none"
                  >
                    {d.month}
                  </text>
                </g>
              );
            })}

          {/* Render Area/Line Charts */}
          {chartType === 'line' && (() => {
            const pointsPem: string[] = [];
            const pointsPeng: string[] = [];
            const groupWidth = usableWidth / (data.length - 1);

            data.forEach((d, index) => {
              const x = padding.left + index * groupWidth;
              const yPem = padding.top + usableHeight - (d.pemasukan / maxVal) * usableHeight;
              const yPeng = padding.top + usableHeight - (d.pengeluaran / maxVal) * usableHeight;
              pointsPem.push(`${x},${yPem}`);
              pointsPeng.push(`${x},${yPeng}`);
            });

            const pathPem = `M ${pointsPem.join(' L ')}`;
            const pathPeng = `M ${pointsPeng.join(' L ')}`;

            const areaPem = `${pathPem} L ${padding.left + usableWidth},${padding.top + usableHeight} L ${padding.left},${padding.top + usableHeight} Z`;
            const areaPeng = `${pathPeng} L ${padding.left + usableWidth},${padding.top + usableHeight} L ${padding.left},${padding.top + usableHeight} Z`;

            return (
              <g>
                {/* Area fills */}
                <path d={areaPem} fill="url(#pemasukanGrad)" className="transition-all duration-300 opacity-60" />
                <path d={areaPeng} fill="url(#pengeluaranGrad)" className="transition-all duration-300 opacity-60" />

                {/* Stroke lines */}
                <path d={pathPem} fill="none" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d={pathPeng} fill="none" stroke="#FF5C5C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                {/* Interactive Anchor points */}
                {data.map((d, index) => {
                  const x = padding.left + index * groupWidth;
                  const yPem = padding.top + usableHeight - (d.pemasukan / maxVal) * usableHeight;
                  const yPeng = padding.top + usableHeight - (d.pengeluaran / maxVal) * usableHeight;

                  return (
                    <g key={index}>
                      {/* Pemasukan Dot */}
                      <circle
                        cx={x}
                        cy={yPem}
                        r={hoveredIndex === index && hoveredType === 'pemasukan' ? 7 : 4}
                        fill="#4CAF50"
                        stroke="#E0E5EC"
                        strokeWidth="2"
                        className="cursor-pointer transition-all duration-200"
                        onMouseEnter={() => {
                          setHoveredIndex(index);
                          setHoveredType('pemasukan');
                        }}
                        onMouseLeave={() => {
                          setHoveredIndex(null);
                          setHoveredType(null);
                        }}
                      />
                      {/* Pengeluaran Dot */}
                      <circle
                        cx={x}
                        cy={yPeng}
                        r={hoveredIndex === index && hoveredType === 'pengeluaran' ? 7 : 4}
                        fill="#FF5C5C"
                        stroke="#E0E5EC"
                        strokeWidth="2"
                        className="cursor-pointer transition-all duration-200"
                        onMouseEnter={() => {
                          setHoveredIndex(index);
                          setHoveredType('pengeluaran');
                        }}
                        onMouseLeave={() => {
                          setHoveredIndex(null);
                          setHoveredType(null);
                        }}
                      />
                      
                      {/* X Axis Label */}
                      <text
                        x={x}
                        y={chartHeight - 8}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="600"
                        fill="#718096"
                        className="select-none"
                      >
                        {d.month}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })()}
        </svg>

        {/* Floating Tooltip HTML Overlay */}
        {hoveredIndex !== null && hoveredType !== null && (() => {
          const item = data[hoveredIndex];
          const val = hoveredType === 'pemasukan' ? item.pemasukan : item.pengeluaran;
          const groupWidth = usableWidth / (chartType === 'bar' ? data.length : data.length - 1);
          const xOffset = chartType === 'bar'
            ? padding.left + hoveredIndex * groupWidth + groupWidth / 2
            : padding.left + hoveredIndex * groupWidth;

          return (
            <div
              className={`absolute top-0 bg-bg-custom text-dark-custom px-4 py-2.5 rounded-[16px] shadow-neumorph-sm-out border border-white/40 pointer-events-none transition-all duration-200 transform -translate-x-1/2 -translate-y-12 flex flex-col gap-0.5`}
              style={{
                left: `${(xOffset / chartWidth) * 100}%`,
              }}
            >
              <span className="text-[10px] font-bold text-secondary-custom uppercase tracking-wider select-none">
                {hoveredType} • {item.month}
              </span>
              <span className={`text-sm font-extrabold select-none ${
                hoveredType === 'pemasukan' ? 'text-success-custom' : 'text-danger-custom'
              }`}>
                {formatIDR(val)}
              </span>
            </div>
          );
        })()}
      </div>

      {/* Legend indicators */}
      <div className="flex gap-6 mt-2 justify-center select-none text-xs font-bold">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-success-custom shadow-[0_0_6px_rgba(76,175,80,0.3)]" />
          <span className="text-secondary-custom">Pemasukan</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-danger-custom shadow-[0_0_6px_rgba(255,92,92,0.3)]" />
          <span className="text-secondary-custom">Pengeluaran</span>
        </div>
      </div>
    </Card>
  );
};

export default FinancialChart;
