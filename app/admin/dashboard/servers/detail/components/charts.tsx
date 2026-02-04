'use client';

import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { EChartsOption } from 'echarts';
import { MetricPoint } from '../types';

interface ChartProps {
  data: MetricPoint[];
  height?: string;
}

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

// CPU & 内存图表
export function CpuMemoryChart({ data, height = '300px' }: ChartProps) {
  const option: EChartsOption = useMemo(() => {
    const times = data.map((d) => formatTime(d.timestamp));
    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
      },
      legend: {
        data: ['CPU使用率', '内存使用率'],
        textStyle: { color: '#888' },
        top: 10,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '20%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: times,
        axisLabel: {
          color: '#888',
          interval: 'auto',
          rotate: 30,
        },
        axisLine: { lineStyle: { color: '#333' } },
      },
      yAxis: {
        type: 'value',
        max: 100,
        axisLabel: { color: '#888', formatter: '{value}%' },
        splitLine: { lineStyle: { color: '#333' } },
      },
      series: [
        {
          name: 'CPU使用率',
          type: 'line',
          smooth: true,
          data: data.map((d) => d.cpu.toFixed(1)),
          lineStyle: { color: '#3b82f6', width: 2 },
          itemStyle: { color: '#3b82f6' },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
                { offset: 1, color: 'rgba(59, 130, 246, 0.05)' },
              ],
            },
          },
        },
        {
          name: '内存使用率',
          type: 'line',
          smooth: true,
          data: data.map((d) => d.memory.toFixed(1)),
          lineStyle: { color: '#10b981', width: 2 },
          itemStyle: { color: '#10b981' },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
                { offset: 1, color: 'rgba(16, 185, 129, 0.05)' },
              ],
            },
          },
        },
      ],
      dataZoom: [
        { type: 'inside', start: 70, end: 100 },
        { start: 70, end: 100, height: 20, bottom: 10 },
      ],
    };
  }, [data]);

  return <ReactECharts option={option} style={{ height, width: '100%' }} theme="dark" />;
}

// 网络图表
export function NetworkChart({ data, height = '280px' }: ChartProps) {
  const option: EChartsOption = useMemo(() => {
    const times = data.map((d) => formatTime(d.timestamp));
    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
      },
      legend: {
        data: ['上行速度', '下行速度'],
        textStyle: { color: '#888' },
        top: 10,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '20%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: times,
        axisLabel: {
          color: '#888',
          interval: 'auto',
          rotate: 30,
        },
        axisLine: { lineStyle: { color: '#333' } },
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#888', formatter: '{value} Mbps' },
        splitLine: { lineStyle: { color: '#333' } },
      },
      series: [
        {
          name: '上行速度',
          type: 'line',
          smooth: true,
          data: data.map((d) => d.networkUp.toFixed(1)),
          lineStyle: { color: '#f59e0b', width: 2 },
          itemStyle: { color: '#f59e0b' },
        },
        {
          name: '下行速度',
          type: 'line',
          smooth: true,
          data: data.map((d) => d.networkDown.toFixed(1)),
          lineStyle: { color: '#8b5cf6', width: 2 },
          itemStyle: { color: '#8b5cf6' },
        },
      ],
      dataZoom: [
        { type: 'inside', start: 70, end: 100 },
        { start: 70, end: 100, height: 20, bottom: 10 },
      ],
    };
  }, [data]);

  return <ReactECharts option={option} style={{ height, width: '100%' }} theme="dark" />;
}

// 硬盘图表
export function DiskChart({ data, height = '280px' }: ChartProps) {
  const option: EChartsOption = useMemo(() => {
    const times = data.map((d) => formatTime(d.timestamp));
    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
      },
      legend: {
        data: ['硬盘使用率'],
        textStyle: { color: '#888' },
        top: 10,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '20%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: times,
        axisLabel: {
          color: '#888',
          interval: 'auto',
          rotate: 30,
        },
        axisLine: { lineStyle: { color: '#333' } },
      },
      yAxis: {
        type: 'value',
        max: 100,
        axisLabel: { color: '#888', formatter: '{value}%' },
        splitLine: { lineStyle: { color: '#333' } },
      },
      series: [
        {
          name: '硬盘使用率',
          type: 'line',
          smooth: true,
          data: data.map((d) => d.disk.toFixed(1)),
          lineStyle: { color: '#ef4444', width: 2 },
          itemStyle: { color: '#ef4444' },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(239, 68, 68, 0.3)' },
                { offset: 1, color: 'rgba(239, 68, 68, 0.05)' },
              ],
            },
          },
        },
      ],
      dataZoom: [
        { type: 'inside', start: 70, end: 100 },
        { start: 70, end: 100, height: 20, bottom: 10 },
      ],
    };
  }, [data]);

  return <ReactECharts option={option} style={{ height, width: '100%' }} theme="dark" />;
}
