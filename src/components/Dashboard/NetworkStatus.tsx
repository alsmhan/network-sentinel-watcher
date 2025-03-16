
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Activity, ShieldCheck, Waves, Wifi } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getNetworkTraffic, TrafficData } from '@/utils/networkScanner';

interface NetworkStatusProps {
  className?: string;
  devices?: number;
  activeConnections?: number;
}

const NetworkStatus: React.FC<NetworkStatusProps> = ({ 
  className, 
  devices = 0,
  activeConnections = 0 
}) => {
  const [traffic, setTraffic] = useState<TrafficData | null>(null);

  useEffect(() => {
    // Initial traffic data
    setTraffic(getNetworkTraffic());
    
    // Update traffic data every 3 seconds
    const interval = setInterval(() => {
      setTraffic(getNetworkTraffic());
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4', className)}>
      <Card className="glass-card animate-slide-up [animation-delay:100ms]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Network Status</CardTitle>
          <Wifi className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-1">Active</div>
          <div className="flex items-center">
            <div className="network-wave"></div>
            <div className="network-wave"></div>
            <div className="network-wave"></div>
            <div className="network-wave"></div>
            <p className="text-xs text-muted-foreground ml-2">Strong connection</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card animate-slide-up [animation-delay:200ms]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Connected Devices</CardTitle>
          <ShieldCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-1">{devices}</div>
          <p className="text-xs text-muted-foreground">All devices secured</p>
        </CardContent>
      </Card>
      
      <Card className="glass-card animate-slide-up [animation-delay:300ms]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-1">{activeConnections}</div>
          <p className="text-xs text-muted-foreground">Connections monitored</p>
        </CardContent>
      </Card>
      
      <Card className="glass-card animate-slide-up [animation-delay:400ms]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Network Traffic</CardTitle>
          <Waves className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-1">
            {traffic ? formatBytes(traffic.inbound + traffic.outbound) : '0 B'}
          </div>
          <div className="flex text-xs text-muted-foreground gap-2">
            <div className="flex items-center">
              <span className="inline-block w-2 h-2 bg-primary rounded-full mr-1"></span>
              <span>↓ {traffic ? formatBytes(traffic.inbound) : '0 B'}</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-2 h-2 bg-info rounded-full mr-1"></span>
              <span>↑ {traffic ? formatBytes(traffic.outbound) : '0 B'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkStatus;
