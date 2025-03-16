
import { NetworkDevice, DeviceType } from './networkScanner';

/**
 * Device Identifier Utility
 * This utility provides functions to identify device types based on 
 * network information like MAC address prefixes.
 */

interface DeviceIdentifierResult {
  type: DeviceType;
  os?: string;
  vendor?: string;
  confidence: number; // 0-100%
}

// MAC address prefixes for known device manufacturers
const MAC_PREFIXES: Record<string, string> = {
  '00:11:22': 'Apple Inc.',
  'AA:BB:CC': 'Samsung Electronics',
  '11:22:33': 'Apple Inc.',
  '22:33:44': 'Sony Corporation',
  '33:44:55': 'Google Inc.',
  '44:55:66': 'Microsoft Corporation',
  '55:66:77': 'Amazon Technologies Inc.',
  '66:77:88': 'LG Electronics',
  // In a real implementation, this would contain thousands of entries
};

// IP range patterns for different device types
const IP_PATTERNS: Record<string, DeviceType> = {
  '192.168.0.1': 'router',
  // In a real implementation, this would be more sophisticated
};

/**
 * Identify a device based on its network information
 * @param device The network device to identify
 * @returns Information about the identified device
 */
export function identifyDevice(device: Partial<NetworkDevice>): DeviceIdentifierResult {
  if (!device.mac && !device.ip) {
    return {
      type: 'unknown',
      confidence: 0
    };
  }
  
  // Check if it's a known router IP
  if (device.ip && IP_PATTERNS[device.ip]) {
    return {
      type: IP_PATTERNS[device.ip],
      confidence: 90
    };
  }
  
  // Check MAC prefix against known manufacturers
  if (device.mac) {
    const macPrefix = device.mac.split(':').slice(0, 3).join(':');
    const vendor = MAC_PREFIXES[macPrefix];
    
    if (vendor) {
      // Guess device type based on vendor
      let type: DeviceType = 'unknown';
      let confidence = 60;
      
      if (vendor.includes('Apple')) {
        type = Math.random() > 0.5 ? 'smartphone' : 'laptop';
        confidence = 80;
      } else if (vendor.includes('Samsung') || vendor.includes('LG')) {
        type = Math.random() > 0.3 ? 'smartphone' : 'smartTv';
        confidence = 75;
      } else if (vendor.includes('Sony')) {
        type = 'smartTv';
        confidence = 85;
      } else if (vendor.includes('Google')) {
        type = Math.random() > 0.5 ? 'smartphone' : 'iot';
        confidence = 70;
      }
      
      return {
        type,
        vendor,
        confidence
      };
    }
  }
  
  // Fallback to basic heuristics
  if (device.name) {
    const name = device.name.toLowerCase();
    
    if (name.includes('iphone') || name.includes('android') || name.includes('phone')) {
      return { type: 'smartphone', confidence: 85 };
    } else if (name.includes('laptop') || name.includes('macbook')) {
      return { type: 'laptop', confidence: 85 };
    } else if (name.includes('tv') || name.includes('television')) {
      return { type: 'smartTv', confidence: 85 };
    } else if (name.includes('router') || name.includes('gateway')) {
      return { type: 'router', confidence: 90 };
    }
  }
  
  // Default unknown
  return {
    type: 'unknown',
    confidence: 30
  };
}

/**
 * Get device type icon name for the Lucide icon library
 * @param type Device type
 * @returns Icon name for the device type
 */
export function getDeviceTypeIcon(type: DeviceType): string {
  switch (type) {
    case 'smartphone': return 'smartphone';
    case 'laptop': return 'laptop';
    case 'desktop': return 'monitor';
    case 'tablet': return 'tablet';
    case 'smartTv': return 'tv';
    case 'iot': return 'cpu';
    case 'router': return 'router';
    default: return 'device';
  }
}

/**
 * Get a human-readable device type label
 * @param type Device type
 * @returns Human-readable label
 */
export function getDeviceTypeLabel(type: DeviceType): string {
  switch (type) {
    case 'smartphone': return 'Smartphone';
    case 'laptop': return 'Laptop';
    case 'desktop': return 'Desktop';
    case 'tablet': return 'Tablet';
    case 'smartTv': return 'Smart TV';
    case 'iot': return 'IoT Device';
    case 'router': return 'Router';
    default: return 'Unknown Device';
  }
}
