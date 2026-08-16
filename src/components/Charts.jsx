import React from 'react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar as RBar, PieChart, Pie, Cell, Legend, LineChart, Line,
} from 'recharts';

const axis = { stroke: 'currentColor', opacity: 0.35, fontSize: 11 };
const tipStyle = { borderRadius: 14, border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.15)', background: 'rgba(255,255,255,0.95)', color: '#0F3D2E', fontSize: 12 };

export function AreaFlow({ data, x = 'm', y = 'amount', color = '#D4A017', height = 240, gradient = 'g1' }) {
  return (
    <div style={{ height }} className="text-forest-900 dark:text-sand-100">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.5} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.12} />
          <XAxis dataKey={x} tick={axis} axisLine={false} tickLine={false} />
          <YAxis tick={axis} axisLine={false} tickLine={false} width={44} />
          <Tooltip contentStyle={tipStyle} />
          <Area type="monotone" dataKey={y} stroke={color} strokeWidth={2.5} fill={`url(#${gradient})`} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DualBar({ data, x = 'm', a = 'in', b = 'out', height = 240 }) {
  return (
    <div style={{ height }} className="text-forest-900 dark:text-sand-100">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.12} />
          <XAxis dataKey={x} tick={axis} axisLine={false} tickLine={false} />
          <YAxis tick={axis} axisLine={false} tickLine={false} width={44} />
          <Tooltip contentStyle={tipStyle} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <RBar dataKey={a} name="Money in" fill="#279697" radius={[6, 6, 0, 0]} />
          <RBar dataKey={b} name="Money out" fill="#E76F51" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function Donut({ data, height = 220, colors = ['#0F3D2E', '#D4A017', '#279697', '#E76F51', '#9d4f9f'] }) {
  return (
    <div style={{ height }} className="text-forest-900 dark:text-sand-100">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius="58%" outerRadius="82%" paddingAngle={3}>
            {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
          </Pie>
          <Tooltip contentStyle={tipStyle} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ScoreLine({ data, height = 200 }) {
  return (
    <div style={{ height }} className="text-forest-900 dark:text-sand-100">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.12} />
          <XAxis dataKey="label" tick={axis} axisLine={false} tickLine={false} />
          <YAxis domain={[400, 900]} tick={axis} axisLine={false} tickLine={false} width={40} />
          <Tooltip contentStyle={tipStyle} />
          <Line type="monotone" dataKey="score" stroke="#9d4f9f" strokeWidth={3} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
