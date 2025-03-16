
import React, { useEffect, useState } from 'react';
import Header from '@/components/Dashboard/Header';
import NetworkStatus from '@/components/Dashboard/NetworkStatus';
import DeviceList from '@/components/Dashboard/DeviceList';
import SecurityAlerts from '@/components/Dashboard/SecurityAlerts';
import TrafficMonitor from '@/components/Dashboard/TrafficMonitor';
import AttackSimulation from '@/components/Dashboard/AttackSimulation';
import { 
  scanNetwork, 
  startNetworkMonitoring,
  NetworkScanResult,
  NetworkDevice
} from '@/utils/networkScanner';
import { 
  getSecurityEvents, 
  resolveSecurityEvent, 
  startSecurityMonitoring,
  SecurityEvent
} from '@/utils/securityMonitor';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [networkScan, setNetworkScan] = useState<NetworkScanResult | null>(null);
  const [devices, setDevices] = useState<NetworkDevice[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial network scan
    const initialScan = async () => {
      try {
        setIsLoading(true);
        const result = await scanNetwork();
        setNetworkScan(result);
        setDevices(result.devices);
        setSecurityEvents(getSecurityEvents());
      } catch (error) {
        console.error('Error scanning network:', error);
        toast({
          title: 'Scan Error',
          description: 'Failed to scan network. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    initialScan();
    
    // Start continuous network monitoring
    const stopNetworkMonitoring = startNetworkMonitoring((result) => {
      setNetworkScan(result);
      setDevices(result.devices);
      
      // Check for new devices
      const previousDeviceIds = devices.map(d => d.id);
      const newDevices = result.devices.filter(d => !previousDeviceIds.includes(d.id));
      
      if (newDevices.length > 0) {
        toast({
          title: 'New Device Detected',
          description: `${newDevices.length} new device${newDevices.length > 1 ? 's' : ''} connected to your network.`,
          variant: 'default'
        });
      }
    });
    
    // Start continuous security monitoring
    const stopSecurityMonitoring = startSecurityMonitoring((events) => {
      setSecurityEvents(events);
      
      // Check for new critical events
      const previousEventIds = securityEvents.map(e => e.id);
      const newCriticalEvents = events.filter(e => 
        !previousEventIds.includes(e.id) && e.type === 'critical' && !e.resolved
      );
      
      if (newCriticalEvents.length > 0) {
        // Alert for new critical security events
        toast({
          title: 'Critical Security Alert',
          description: newCriticalEvents[0].title,
          variant: 'destructive'
        });
      }
    });
    
    return () => {
      stopNetworkMonitoring();
      stopSecurityMonitoring();
    };
  }, []);

  const handleResolveSecurityEvent = (id: string) => {
    const updatedEvent = resolveSecurityEvent(id);
    if (updatedEvent) {
      setSecurityEvents(getSecurityEvents());
      toast({
        title: 'Event Resolved',
        description: `Security event "${updatedEvent.title}" has been resolved.`,
        variant: 'default'
      });
    }
  };

  const handleAttackSimulated = () => {
    // Refresh security events after attack simulation
    setSecurityEvents(getSecurityEvents());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <Header localIp={networkScan?.localIp || '192.168.0.164'} />
        
        <NetworkStatus 
          devices={devices.length} 
          activeConnections={Math.floor(Math.random() * 20) + 5}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DeviceList devices={devices} />
          <SecurityAlerts 
            events={securityEvents} 
            onResolve={handleResolveSecurityEvent}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TrafficMonitor />
          <AttackSimulation onAttackSimulated={handleAttackSimulated} />
        </div>
      </div>
    </div>
  );
};

export default Index;
