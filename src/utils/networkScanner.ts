
/**
 * Network Scanner Utility
 * This utility provides functions to scan the local network for connected devices
 * and monitor network traffic.
 */

// Types for network scan results
export interface NetworkDevice {
  id: string;
  ip: string;
  mac: string;
  name: string;
  type: DeviceType;
  status: 'online' | 'offline';
  firstSeen: string;
  lastSeen: string;
}

export type DeviceType = 
  | 'smartphone'
  | 'laptop'
  | 'desktop'
  | 'tablet'
  | 'smartTv'
  | 'iot'
  | 'router'
  | 'unknown';

export interface NetworkScanResult {
  timestamp: string;
  devices: NetworkDevice[];
  gatewayIp: string;
  localIp: string;
  scanDuration: number;
}

// Types for network traffic data
export interface TrafficData {
  timestamp: string;
  inbound: number;  // in bytes
  outbound: number; // in bytes
  totalConnections: number;
}

// In a real implementation, this would use libraries like 'network' or 'arp-scan'
// For this demo, we'll simulate the network scanning

// Mock data for the simulated network
const MOCK_NETWORK_DEVICES: NetworkDevice[] = [
  {
    id: '1',
    ip: '192.168.0.1',
    mac: '00:11:22:33:44:55',
    name: 'Main Router',
    type: 'router',
    status: 'online',
    firstSeen: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days ago
    lastSeen: new Date().toISOString()
  },
  {
    id: '2',
    ip: '192.168.0.101',
    mac: 'AA:BB:CC:DD:EE:FF',
    name: 'Your Laptop',
    type: 'laptop',
    status: 'online',
    firstSeen: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    lastSeen: new Date().toISOString()
  },
  {
    id: '3',
    ip: '192.168.0.102',
    mac: '11:22:33:44:55:66',
    name: 'iPhone 12',
    type: 'smartphone',
    status: 'online',
    firstSeen: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    lastSeen: new Date().toISOString()
  },
  {
    id: '4',
    ip: '192.168.0.103',
    mac: '22:33:44:55:66:77',
    name: 'Smart TV',
    type: 'smartTv',
    status: 'online',
    firstSeen: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    lastSeen: new Date().toISOString()
  },
  {
    id: '5',
    ip: '192.168.0.104',
    mac: '33:44:55:66:77:88',
    name: 'Smart Thermostat',
    type: 'iot',
    status: 'online',
    firstSeen: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
    lastSeen: new Date().toISOString()
  }
];

/**
 * Scan the local network for connected devices
 * @returns A promise that resolves to a NetworkScanResult
 */
export async function scanNetwork(): Promise<NetworkScanResult> {
  // In a real implementation, this would perform an actual network scan
  // For this demo, we'll return simulated data
  
  // Simulate network scan delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Randomly add/remove some devices to simulate network changes
  const devices = [...MOCK_NETWORK_DEVICES];
  
  // Randomly update last seen time for some devices
  devices.forEach(device => {
    if (Math.random() > 0.7) {
      device.lastSeen = new Date().toISOString();
    }
  });
  
  // Sometimes add a new device
  if (Math.random() > 0.8) {
    const newDeviceTypes: DeviceType[] = ['smartphone', 'laptop', 'tablet', 'iot'];
    const randomType = newDeviceTypes[Math.floor(Math.random() * newDeviceTypes.length)];
    const newId = (devices.length + 1).toString();
    
    devices.push({
      id: newId,
      ip: `192.168.0.${110 + parseInt(newId)}`,
      mac: Array.from({length: 6}, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(':'),
      name: `New ${randomType} Device`,
      type: randomType,
      status: 'online',
      firstSeen: new Date().toISOString(),
      lastSeen: new Date().toISOString()
    });
  }
  
  return {
    timestamp: new Date().toISOString(),
    devices,
    gatewayIp: '192.168.0.1',
    localIp: '192.168.0.164', // The user's IP address
    scanDuration: Math.random() * 500 + 800 // Between 800-1300ms
  };
}

/**
 * Get traffic data for the network
 * @returns A TrafficData object with the current traffic statistics
 */
export function getNetworkTraffic(): TrafficData {
  // In a real implementation, this would measure actual network traffic
  // For this demo, we'll return simulated data
  
  return {
    timestamp: new Date().toISOString(),
    inbound: Math.floor(Math.random() * 1024 * 1024), // Random value up to 1MB
    outbound: Math.floor(Math.random() * 1024 * 512), // Random value up to 512KB
    totalConnections: Math.floor(Math.random() * 50) + 10
  };
}

/**
 * Start monitoring the network for changes
 * @param callback Function to call when network changes are detected
 * @param interval Polling interval in milliseconds
 * @returns A function to stop monitoring
 */
export function startNetworkMonitoring(
  callback: (result: NetworkScanResult) => void,
  interval = 5000
): () => void {
  const intervalId = setInterval(async () => {
    const result = await scanNetwork();
    callback(result);
  }, interval);
  
  return () => clearInterval(intervalId);
}
