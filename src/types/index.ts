export type SectionTab = 
  | 'number-systems'
  | 'binary-storage'
  | 'gate-catalog'
  | 'truth-tables'
  | 'circuit-builder'
  | 'ib-exam-practice'
  | 'video-walkthrough' 
  | 'misconceptions';

export type GateType = 
  | 'SWITCH' 
  | 'AND' 
  | 'OR' 
  | 'NOT' 
  | 'XOR' 
  | 'NAND' 
  | 'NOR' 
  | 'XNOR' 
  | 'BUFFER' 
  | 'LIGHTBULB';

export interface CircuitNode {
  id: string;
  type: GateType;
  x: number;
  y: number;
  label: string;
  state?: number; // 0 or 1 for switches
  inputs?: { [portId: string]: number | null };
  output?: number;
}

export interface CircuitConnection {
  id: string;
  fromNodeId: string;
  fromPort: 'out';
  toNodeId: string;
  toPort: 'in1' | 'in2' | 'in';
}

export interface VideoScene {
  id: string;
  title: string;
  duration: number; // in seconds
  caption: string;
  subtopic: string;
  textbookRef: string;
  visualType: 'ascii' | 'pixels' | 'audio' | 'video-frames' | 'twos-comp' | 'utf8' | 'gray-code' | 'logic-gate' | 'circuit' | 'truth-table' | 'number-bases';
  narration: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  textbookPage: number;
  misconceptionAlert?: string;
}

