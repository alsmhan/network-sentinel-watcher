
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AttackType, simulateAttack } from '@/utils/securityMonitor';
import { AlertTriangleIcon, PlayIcon, ShieldOffIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface AttackSimulationProps {
  className?: string;
  onAttackSimulated: () => void;
}

const AttackSimulation: React.FC<AttackSimulationProps> = ({ 
  className,
  onAttackSimulated
}) => {
  const { toast } = useToast();
  const [sourceIp, setSourceIp] = useState('192.168.0.200');
  const [targetIp, setTargetIp] = useState('192.168.0.101');
  const [attackType, setAttackType] = useState<AttackType>('port_scan');
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulateAttack = () => {
    setIsSimulating(true);
    
    // Validate IP addresses
    if (!isValidIpAddress(sourceIp) || !isValidIpAddress(targetIp)) {
      toast({
        title: 'Invalid IP Address',
        description: 'Please enter valid IP addresses.',
        variant: 'destructive'
      });
      setIsSimulating(false);
      return;
    }
    
    // Simulate an attack with a delay to make it feel real
    setTimeout(() => {
      const simulatedEvent = simulateAttack(attackType, sourceIp, targetIp);
      
      toast({
        title: 'Attack Simulated',
        description: `Simulated ${attackType.replace('_', ' ')} attack from ${sourceIp} to ${targetIp}.`,
        variant: 'default'
      });
      
      onAttackSimulated();
      setIsSimulating(false);
    }, 1500);
  };

  // Validate IP address format
  const isValidIpAddress = (ip: string) => {
    const ipRegex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(ip);
  };

  return (
    <Card className={cn('glass-card animate-slide-up [animation-delay:700ms]', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Attack Simulation</CardTitle>
            <CardDescription>Test your network's detection capabilities</CardDescription>
          </div>
          <ShieldOffIcon className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sourceIp">Source IP</Label>
              <Input 
                id="sourceIp" 
                value={sourceIp} 
                onChange={(e) => setSourceIp(e.target.value)}
                placeholder="192.168.0.200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetIp">Target IP</Label>
              <Input 
                id="targetIp" 
                value={targetIp} 
                onChange={(e) => setTargetIp(e.target.value)}
                placeholder="192.168.0.101"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="attackType">Attack Type</Label>
            <Select value={attackType} onValueChange={(value) => setAttackType(value as AttackType)}>
              <SelectTrigger id="attackType" className="w-full">
                <SelectValue placeholder="Select attack type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="port_scan">Port Scan</SelectItem>
                <SelectItem value="brute_force">Brute Force</SelectItem>
                <SelectItem value="ddos">DDoS Attack</SelectItem>
                <SelectItem value="man_in_the_middle">Man-in-the-Middle</SelectItem>
                <SelectItem value="dns_spoofing">DNS Spoofing</SelectItem>
                <SelectItem value="arp_spoofing">ARP Spoofing</SelectItem>
                <SelectItem value="malware">Malware Activity</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="bg-warning/10 border border-warning/30 rounded-lg p-3 mt-4">
            <div className="flex items-start gap-2">
              <AlertTriangleIcon className="h-5 w-5 text-warning shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                This simulation will generate security events for testing purposes only. 
                No actual attacks will be performed on your network.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          disabled={isSimulating}
          onClick={handleSimulateAttack}
        >
          {isSimulating ? (
            <>
              <div className="flex justify-center items-center space-x-2">
                <div className="network-wave h-4"></div>
                <div className="network-wave h-4"></div>
                <div className="network-wave h-4"></div>
                <span className="ml-2">Simulating Attack...</span>
              </div>
            </>
          ) : (
            <>
              <PlayIcon className="h-4 w-4 mr-2" />
              Simulate Attack
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AttackSimulation;
