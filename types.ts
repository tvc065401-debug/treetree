export interface InstanceData {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color?: string;
  velocity?: [number, number, number]; // For disperse effect direction
}

export enum TreeMode {
  ASSEMBLED = 'ASSEMBLED',
  DISPERSED = 'DISPERSED'
}
