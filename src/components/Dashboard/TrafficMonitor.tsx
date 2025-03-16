import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getNetworkTraffic, TrafficData } from '@/utils/networkScanner';

interface TrafficMonitorProps {
  className?: string;
}

const TrafficMonitor: React.FC<TrafficMonitorProps> = ({ className }) => {
  const [trafficHistory, setTrafficHistory] = useState<Array<TrafficData & { formattedTime: string }>>([]);

  useEffect(() => {
    // Initial traffic data
    const initialData = getNetworkTraffic();
    const newData = {
      ...initialData,
      formattedTime: new Date(initialData.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setTrafficHistory([newData]);
    
    // Update traffic data every 3 seconds
    const interval = setInterval(() => {
      const newTraffic = getNetworkTraffic();
      const formattedTraffic = {
        ...newTraffic,
        formattedTime: new Date(newTraffic.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setTrafficHistory(prev => {
        // Keep only the last 10 data points
        const newHistory = [...prev, formattedTraffic];
        if (newHistory.length > 10) {
          return newHistory.slice(newHistory.length - 10);
        }
        return newHistory;
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // Convert bytes to KB for better visualization
  const convertedData = trafficHistory.map(item => ({
    ...item,
    inboundKB: item.inbound / 1024,
    outboundKB: item.outbound / 1024
  }));

  // Custom tooltip to show values in formatted KB/MB
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const formatBytes = (bytes: number): string => {
        if (bytes < 1024) return `${bytes.toFixed(2)} KB`;
        return `${(bytes / 1024).toFixed(2)} MB`;
      };
      
      return (
        <div className="glass-panel p-3 border border-border rounded-lg shadow-sm">
          <p className="label font-medium">{label}</p>
          <p className="text-sm text-primary">
            ↓ Inbound: {formatBytes(payload[0].value)}
          </p>
          <p className="text-sm text-info">
            ↑ Outbound: {formatBytes(payload[1].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={cn('glass-card animate-slide-up [animation-delay:500ms]', className)}>
      <CardHeader>
        <CardTitle>Network Traffic</CardTitle>
        <CardDescription>Real-time monitoring of network traffic</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {trafficHistory.length > 1 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={convertedData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis 
                  dataKey="formattedTime" 
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: 'rgba(100, 116, 139, 0.5)' }}
                  axisLine={{ stroke: 'rgba(100, 116, 139, 0.5)' }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: 'rgba(100, 116, 139, 0.5)' }}
                  axisLine={{ stroke: 'rgba(100, 116, 139, 0.5)' }}
                  tickFormatter={(value) => value < 1024 ? `${value.toFixed(0)} KB` : `${(value / 1024).toFixed(0)} MB`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={(value) => value === 'inboundKB' ? 'Inbound' : 'Outbound'} />
                <Line 
                  type="monotone" 
                  dataKey="inboundKB" 
                  name="inboundKB"
                  stroke="hsl(var(--primary))" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                  dot={{ strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="outboundKB" 
                  name="outboundKB"
                  stroke="hsl(var(--info))" 
                  strokeWidth={2}
                  dot={{ strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <p>Collecting traffic data...</p>
                <div className="mt-2 flex justify-center">
                  <div className="network-wave"></div>
                  <div className="network-wave"></div>
                  <div className="network-wave"></div>
                  <div className="network-wave"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrafficMonitor;
