
import React from 'react';
import { cn } from '@/lib/utils';
import { Shield } from 'lucide-react';

interface HeaderProps {
  className?: string;
  localIp?: string;
}

const Header: React.FC<HeaderProps> = ({ className, localIp = '192.168.0.164' }) => {
  return (
    <header className={cn(
      'flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-8 p-6 glass-card rounded-xl',
      className
    )}>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Shield className="h-10 w-10 text-primary" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-success"></span>
          </span>
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Network Sentinel</h1>
          <p className="text-sm text-muted-foreground">Monitoring your network for optimal security</p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-4 text-sm">
        <div className="flex items-center px-4 py-2 rounded-full glass-panel">
          <span className="text-muted-foreground mr-2">Local IP:</span>
          <span className="font-medium">{localIp}</span>
        </div>
        <div className="flex items-center px-4 py-2 rounded-full glass-panel">
          <span className="text-muted-foreground mr-2">Status:</span>
          <div className="flex items-center">
            <span className="h-2 w-2 bg-success rounded-full mr-2 animate-pulse-subtle"></span>
            <span className="font-medium">Protected</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
