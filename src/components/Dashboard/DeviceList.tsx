
import React from 'react';
import { cn } from '@/lib/utils';
import { NetworkDevice } from '@/utils/networkScanner';
import { 
  getDeviceTypeIcon, 
  getDeviceTypeLabel 
} from '@/utils/deviceIdentifier';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { 
  LaptopIcon, 
  SmartphoneIcon, 
  MonitorIcon, 
  TabletIcon, 
  TvIcon, 
  CpuIcon,
  RouterIcon,
  HelpCircleIcon
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DeviceListProps {
  className?: string;
  devices: NetworkDevice[];
}

const DeviceList: React.FC<DeviceListProps> = ({ className, devices }) => {
  // Function to get the correct icon based on device type
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'smartphone':
        return <SmartphoneIcon className="h-5 w-5" />;
      case 'laptop':
        return <LaptopIcon className="h-5 w-5" />;
      case 'desktop':
        return <MonitorIcon className="h-5 w-5" />;
      case 'tablet':
        return <TabletIcon className="h-5 w-5" />;
      case 'smartTv':
        return <TvIcon className="h-5 w-5" />;
      case 'iot':
        return <CpuIcon className="h-5 w-5" />;
      case 'router':
        return <RouterIcon className="h-5 w-5" />;
      default:
        return <HelpCircleIcon className="h-5 w-5" />;
    }
  };

  // Format the date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Calculate time since first seen
  const getTimeSince = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  };

  return (
    <Card className={cn('glass-card animate-slide-up [animation-delay:500ms]', className)}>
      <CardHeader>
        <CardTitle>Connected Devices</CardTitle>
        <CardDescription>All devices currently connected to your network</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {devices.map((device) => (
              <div 
                key={device.id}
                className="flex items-center p-3 rounded-lg border border-border bg-background/50 hover:bg-background/80 transition-colors"
              >
                <div className="p-2 rounded-full bg-muted mr-4">
                  {getDeviceIcon(device.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium truncate">{device.name}</h4>
                    <div className="flex items-center">
                      <span className={cn(
                        "inline-block h-2 w-2 rounded-full mr-2", 
                        device.status === 'online' ? "bg-success animate-pulse-subtle" : "bg-muted"
                      )}></span>
                      <span className="text-xs font-medium text-muted-foreground">
                        {device.status === 'online' ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center text-xs text-muted-foreground mt-1 gap-1 sm:gap-3">
                    <div className="flex items-center">
                      <span className="font-medium mr-1">Type:</span> 
                      {getDeviceTypeLabel(device.type)}
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-1">IP:</span> 
                      {device.ip}
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-1">MAC:</span> 
                      {device.mac}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row text-xs text-muted-foreground mt-1 gap-1 sm:gap-3">
                    <div>
                      <span className="font-medium">First Seen:</span> {getTimeSince(device.firstSeen)}
                    </div>
                    <div>
                      <span className="font-medium">Last Seen:</span> {getTimeSince(device.lastSeen)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {devices.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <HelpCircleIcon className="mx-auto h-8 w-8 mb-2 opacity-50" />
                <p>No devices found on your network</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default DeviceList;
