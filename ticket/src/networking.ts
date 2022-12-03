'use strict';

import { networkInterfaces } from 'os';

export const getIpAddress = (): string => {
  const nets = networkInterfaces();
  const results: Record<string, string[]> = {};

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4;
      if (net.family === familyV4Value && !net.internal) {
        if (!results[name]) {
          results[name] = [];
        }
        results[name].push(net.address);
      }
    }
  }

  return results['eth0'][0];
};
