
/**
 * Security Monitor Utility
 * This utility provides functions to monitor network security and detect potential attacks
 */

export type SecurityEventType = 
  | 'info'
  | 'warning'
  | 'critical';

export type AttackType = 
  | 'port_scan'
  | 'brute_force'
  | 'ddos'
  | 'man_in_the_middle'
  | 'dns_spoofing'
  | 'arp_spoofing'
  | 'malware'
  | 'unknown';

export interface SecurityEvent {
  id: string;
  timestamp: string;
  type: SecurityEventType;
  title: string;
  description: string;
  sourceIp?: string;
  targetIp?: string;
  attackType?: AttackType;
  recommendation?: string;
  resolved: boolean;
}

// In a real implementation, this would use libraries like 'snort' or 'suricata'
// For this demo, we'll simulate security events

// Mock data for simulated security events
const MOCK_SECURITY_EVENTS: SecurityEvent[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    type: 'warning',
    title: 'Unusual Login Attempts',
    description: 'Multiple failed login attempts detected from IP 192.168.0.110',
    sourceIp: '192.168.0.110',
    targetIp: '192.168.0.101',
    attackType: 'brute_force',
    recommendation: 'Monitor the source IP for further suspicious activity',
    resolved: false
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 minutes ago
    type: 'info',
    title: 'New Device Connected',
    description: 'A new device has connected to the network',
    sourceIp: '192.168.0.112',
    recommendation: 'Verify that this device is authorized',
    resolved: true
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    type: 'critical',
    title: 'Possible ARP Spoofing Attack',
    description: 'Detected conflicting ARP entries which could indicate ARP spoofing',
    sourceIp: '192.168.0.115',
    attackType: 'arp_spoofing',
    recommendation: 'Isolate the suspicious device and investigate',
    resolved: false
  }
];

// Simple in-memory store for security events
let securityEvents = [...MOCK_SECURITY_EVENTS];

/**
 * Get all security events
 * @param limit Maximum number of events to return
 * @returns Array of security events
 */
export function getSecurityEvents(limit = 100): SecurityEvent[] {
  return [...securityEvents]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}

/**
 * Add a new security event
 * @param event The security event to add
 * @returns The added security event
 */
export function addSecurityEvent(event: Omit<SecurityEvent, 'id'>): SecurityEvent {
  const newEvent: SecurityEvent = {
    ...event,
    id: (securityEvents.length + 1).toString()
  };
  
  securityEvents = [newEvent, ...securityEvents];
  return newEvent;
}

/**
 * Mark a security event as resolved
 * @param id ID of the security event
 * @returns The updated security event, or undefined if not found
 */
export function resolveSecurityEvent(id: string): SecurityEvent | undefined {
  const event = securityEvents.find(e => e.id === id);
  
  if (event) {
    event.resolved = true;
    return event;
  }
  
  return undefined;
}

/**
 * Simulate a security attack for testing purposes
 * @param type Type of attack to simulate
 * @param sourceIp Source IP for the simulated attack
 * @param targetIp Target IP for the simulated attack
 * @returns The generated security event
 */
export function simulateAttack(
  type: AttackType,
  sourceIp = '192.168.0.200',
  targetIp = '192.168.0.101'
): SecurityEvent {
  const attackConfigs: Record<AttackType, { title: string, description: string, type: SecurityEventType, recommendation: string }> = {
    port_scan: {
      title: 'Port Scan Detected',
      description: `Port scanning activity detected from IP ${sourceIp}`,
      type: 'warning',
      recommendation: 'Check firewall rules and consider blocking the source IP'
    },
    brute_force: {
      title: 'Brute Force Attack',
      description: `Multiple failed login attempts detected from IP ${sourceIp}`,
      type: 'warning',
      recommendation: 'Implement account lockout policies and stronger passwords'
    },
    ddos: {
      title: 'Possible DDoS Attack',
      description: `Unusual high traffic detected from IP ${sourceIp}`,
      type: 'critical',
      recommendation: 'Implement rate limiting and traffic filtering'
    },
    man_in_the_middle: {
      title: 'Possible MITM Attack',
      description: 'Unexpected SSL certificate changes detected',
      type: 'critical',
      recommendation: 'Verify all SSL certificates and use HTTPS everywhere'
    },
    dns_spoofing: {
      title: 'DNS Spoofing Attempt',
      description: 'Unexpected DNS resolution detected',
      type: 'critical',
      recommendation: 'Use secure DNS providers and consider DNSSEC'
    },
    arp_spoofing: {
      title: 'ARP Spoofing Attack',
      description: 'Conflicting ARP entries detected on the network',
      type: 'critical',
      recommendation: 'Use static ARP entries for critical systems'
    },
    malware: {
      title: 'Possible Malware Activity',
      description: `Suspicious traffic patterns detected from IP ${sourceIp}`,
      type: 'critical',
      recommendation: 'Isolate the affected device and run antivirus scan'
    },
    unknown: {
      title: 'Unknown Suspicious Activity',
      description: 'Unusual network traffic patterns detected',
      type: 'warning',
      recommendation: 'Monitor the network for further suspicious activity'
    }
  };
  
  const config = attackConfigs[type];
  
  return addSecurityEvent({
    timestamp: new Date().toISOString(),
    type: config.type,
    title: config.title,
    description: config.description,
    sourceIp,
    targetIp,
    attackType: type,
    recommendation: config.recommendation,
    resolved: false
  });
}

/**
 * Start monitoring for security events
 * @param callback Function to call when new security events are detected
 * @param interval Polling interval in milliseconds
 * @returns A function to stop monitoring
 */
export function startSecurityMonitoring(
  callback: (events: SecurityEvent[]) => void,
  interval = 10000
): () => void {
  // Simulate random security events
  const intervalId = setInterval(() => {
    if (Math.random() > 0.7) { // 30% chance of new security event
      const attackTypes: AttackType[] = ['port_scan', 'brute_force', 'malware', 'unknown'];
      const randomType = attackTypes[Math.floor(Math.random() * attackTypes.length)];
      const randomSourceIp = `192.168.0.${Math.floor(Math.random() * 100) + 100}`;
      
      simulateAttack(randomType, randomSourceIp);
      callback(getSecurityEvents());
    }
  }, interval);
  
  return () => clearInterval(intervalId);
}
