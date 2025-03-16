
import React from 'react';
import { cn } from '@/lib/utils';
import { SecurityEvent } from '@/utils/securityMonitor';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription, 
  CardFooter
} from '@/components/ui/card';
import { 
  AlertTriangleIcon, 
  InfoIcon, 
  AlertCircleIcon, 
  CheckCircleIcon, 
  ShieldIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface SecurityAlertsProps {
  className?: string;
  events: SecurityEvent[];
  onResolve: (id: string) => void;
}

const SecurityAlerts: React.FC<SecurityAlertsProps> = ({ 
  className, 
  events,
  onResolve
}) => {
  // Function to get the correct icon based on event type
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <InfoIcon className="h-5 w-5 text-info" />;
      case 'warning':
        return <AlertTriangleIcon className="h-5 w-5 text-warning" />;
      case 'critical':
        return <AlertCircleIcon className="h-5 w-5 text-destructive" />;
      default:
        return <InfoIcon className="h-5 w-5 text-info" />;
    }
  };

  // Format the date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Calculate time since event
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

  // Get event type badge style
  const getEventTypeBadge = (type: string) => {
    switch (type) {
      case 'info':
        return <Badge variant="outline" className="bg-info/10 text-info border-info/20">Info</Badge>;
      case 'warning':
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">Warning</Badge>;
      case 'critical':
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Critical</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card className={cn('glass-card animate-slide-up [animation-delay:600ms]', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Security Alerts</CardTitle>
            <CardDescription>Recent security events detected on your network</CardDescription>
          </div>
          <ShieldIcon className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {events.map((event) => (
              <div 
                key={event.id}
                className={cn(
                  "p-4 rounded-lg border transition-all", 
                  event.resolved 
                    ? "border-muted bg-muted/20 opacity-70" 
                    : event.type === 'critical'
                      ? "border-destructive/40 bg-destructive/5"
                      : event.type === 'warning'
                        ? "border-warning/40 bg-warning/5"
                        : "border-info/40 bg-info/5"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getEventIcon(event.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col">
                        <h4 className="text-sm font-medium">{event.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          {getEventTypeBadge(event.type)}
                          <span className="text-xs text-muted-foreground">
                            {getTimeSince(event.timestamp)}
                          </span>
                        </div>
                      </div>
                      {event.resolved && (
                        <Badge variant="outline" className="bg-success/10 text-success border-success/20 shrink-0">
                          <CheckCircleIcon className="h-3 w-3 mr-1" />
                          Resolved
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {event.description}
                    </p>
                    
                    {(event.sourceIp || event.targetIp) && (
                      <div className="flex flex-wrap text-xs text-muted-foreground mt-2 gap-3">
                        {event.sourceIp && (
                          <div>
                            <span className="font-medium">Source:</span> {event.sourceIp}
                          </div>
                        )}
                        {event.targetIp && (
                          <div>
                            <span className="font-medium">Target:</span> {event.targetIp}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {event.attackType && (
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs capitalize">
                          {event.attackType.replace('_', ' ')}
                        </Badge>
                      </div>
                    )}
                    
                    {event.recommendation && (
                      <div className="mt-2 text-xs p-2 rounded bg-secondary/50 border border-border/50">
                        <span className="font-medium">Recommendation:</span> {event.recommendation}
                      </div>
                    )}
                    
                    {!event.resolved && (
                      <div className="mt-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs"
                          onClick={() => onResolve(event.id)}
                        >
                          <CheckCircleIcon className="h-3 w-3 mr-1" />
                          Mark as Resolved
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {events.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <ShieldIcon className="mx-auto h-8 w-8 mb-2 opacity-50" />
                <p>No security alerts detected</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-xs text-muted-foreground">
          {events.length} security event{events.length !== 1 ? 's' : ''}
        </div>
        {events.some(e => !e.resolved) && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs"
            onClick={() => events.filter(e => !e.resolved).forEach(e => onResolve(e.id))}
          >
            <CheckCircleIcon className="h-3 w-3 mr-1" />
            Resolve All
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SecurityAlerts;
