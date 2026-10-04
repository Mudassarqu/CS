import { CircuitNode, CircuitConnection, GateType } from '../types';

export function evaluateGate(type: GateType, inputs: { [port: string]: number | null }, switchState: number = 0): number {
  if (type === 'SWITCH') {
    return switchState === 1 ? 1 : 0;
  }

  const in1 = inputs['in1'] ?? 0;
  const in2 = inputs['in2'] ?? 0;
  const singleIn = inputs['in'] ?? inputs['in1'] ?? 0;

  switch (type) {
    case 'AND':
      return (in1 === 1 && in2 === 1) ? 1 : 0;
    case 'OR':
      return (in1 === 1 || in2 === 1) ? 1 : 0;
    case 'NOT':
      return (singleIn === 1) ? 0 : 1;
    case 'XOR':
      return (in1 !== in2) ? 1 : 0;
    case 'NAND':
      return !(in1 === 1 && in2 === 1) ? 1 : 0;
    case 'NOR':
      return !(in1 === 1 || in2 === 1) ? 1 : 0;
    case 'XNOR':
      return (in1 === in2) ? 1 : 0;
    case 'BUFFER':
      return singleIn === 1 ? 1 : 0;
    case 'LIGHTBULB':
      return singleIn === 1 ? 1 : 0;
    default:
      return 0;
  }
}

export function simulateCircuit(
  nodes: CircuitNode[], 
  connections: CircuitConnection[]
): { nodeOutputs: { [id: string]: number }; wireSignals: { [wireId: string]: number } } {
  const nodeOutputs: { [id: string]: number } = {};
  const wireSignals: { [wireId: string]: number } = {};

  // Initialize switches first
  nodes.forEach(node => {
    if (node.type === 'SWITCH') {
      nodeOutputs[node.id] = node.state ?? 0;
    }
  });

  // Multiple relaxation passes to propagate through multi-level gate layers
  const maxIterations = 15;
  for (let iter = 0; iter < maxIterations; iter++) {
    // 1. Update wire signals based on source outputs
    connections.forEach(conn => {
      const sourceVal = nodeOutputs[conn.fromNodeId] ?? 0;
      wireSignals[conn.id] = sourceVal;
    });

    // 2. Update gate inputs and evaluate their new outputs
    nodes.forEach(node => {
      if (node.type === 'SWITCH') return;

      const inputs: { [port: string]: number | null } = {};
      
      // Find incoming connections to this node
      connections.forEach(conn => {
        if (conn.toNodeId === node.id) {
          inputs[conn.toPort] = nodeOutputs[conn.fromNodeId] ?? 0;
        }
      });

      const out = evaluateGate(node.type, inputs, node.state ?? 0);
      nodeOutputs[node.id] = out;
    });
  }

  // Final wire update pass
  connections.forEach(conn => {
    wireSignals[conn.id] = nodeOutputs[conn.fromNodeId] ?? 0;
  });

  return { nodeOutputs, wireSignals };
}

// Generate complete truth table for all switches in the circuit
export function generateTruthTable(
  nodes: CircuitNode[],
  connections: CircuitConnection[]
): {
  inputs: { id: string; label: string }[];
  outputs: { id: string; label: string }[];
  rows: { inputs: { [label: string]: number }; outputs: { [label: string]: number } }[];
} {
  const switchNodes = nodes.filter(n => n.type === 'SWITCH').sort((a, b) => a.label.localeCompare(b.label));
  const outputNodes = nodes.filter(n => n.type === 'LIGHTBULB' || (!connections.some(c => c.fromNodeId === n.id) && n.type !== 'SWITCH'));

  if (switchNodes.length === 0) {
    return { inputs: [], outputs: [], rows: [] };
  }

  const numCombinations = Math.pow(2, switchNodes.length);
  const rows: { inputs: { [label: string]: number }; outputs: { [label: string]: number } }[] = [];

  for (let i = 0; i < numCombinations; i++) {
    const inputVals: { [id: string]: number } = {};
    const inputLabels: { [label: string]: number } = {};

    switchNodes.forEach((sNode, idx) => {
      const bitWeight = Math.pow(2, switchNodes.length - 1 - idx);
      const val = (i & bitWeight) ? 1 : 0;
      inputVals[sNode.id] = val;
      inputLabels[sNode.label] = val;
    });

    // Run simulation for this combination
    const tempNodes = nodes.map(n => n.type === 'SWITCH' ? { ...n, state: inputVals[n.id] } : n);
    const { nodeOutputs } = simulateCircuit(tempNodes, connections);

    const outLabels: { [label: string]: number } = {};
    outputNodes.forEach(oNode => {
      outLabels[oNode.label || oNode.id] = nodeOutputs[oNode.id] ?? 0;
    });

    rows.push({ inputs: inputLabels, outputs: outLabels });
  }

  return {
    inputs: switchNodes.map(s => ({ id: s.id, label: s.label })),
    outputs: outputNodes.map(o => ({ id: o.id, label: o.label || o.id })),
    rows
  };
}

// Preset Circuits directly from Hodder Textbook
export const PRESET_CIRCUITS: {
  [key: string]: {
    name: string;
    description: string;
    textbookPage: string;
    formula: string;
    nodes: CircuitNode[];
    connections: CircuitConnection[];
  };
} = {
  textbookExample: {
    name: 'Textbook Example: Y = (A · B) + (Ā · B̄)',
    description: 'The complete circuit designed step-by-step in Hodder pages 65–66 (PDF 75–76). Detects when A and B have the same value (XNOR logic)!',
    textbookPage: 'pp. 65–66 (PDF p. 75–76)',
    formula: 'Y = (A · B) + (Ā · B̄)',
    nodes: [
      { id: 'sw_a', type: 'SWITCH', x: 80, y: 120, label: 'A', state: 1 },
      { id: 'sw_b', type: 'SWITCH', x: 80, y: 320, label: 'B', state: 0 },
      { id: 'and_1', type: 'AND', x: 300, y: 120, label: 'AND 1' },
      { id: 'not_a', type: 'NOT', x: 260, y: 220, label: 'NOT A' },
      { id: 'not_b', type: 'NOT', x: 260, y: 340, label: 'NOT B' },
      { id: 'and_2', type: 'AND', x: 420, y: 280, label: 'AND 2' },
      { id: 'or_1', type: 'OR', x: 580, y: 200, label: 'OR' },
      { id: 'bulb_y', type: 'LIGHTBULB', x: 740, y: 200, label: 'Y' },
    ],
    connections: [
      { id: 'c1', fromNodeId: 'sw_a', fromPort: 'out', toNodeId: 'and_1', toPort: 'in1' },
      { id: 'c2', fromNodeId: 'sw_b', fromPort: 'out', toNodeId: 'and_1', toPort: 'in2' },
      { id: 'c3', fromNodeId: 'sw_a', fromPort: 'out', toNodeId: 'not_a', toPort: 'in' },
      { id: 'c4', fromNodeId: 'sw_b', fromPort: 'out', toNodeId: 'not_b', toPort: 'in' },
      { id: 'c5', fromNodeId: 'not_a', fromPort: 'out', toNodeId: 'and_2', toPort: 'in1' },
      { id: 'c6', fromNodeId: 'not_b', fromPort: 'out', toNodeId: 'and_2', toPort: 'in2' },
      { id: 'c7', fromNodeId: 'and_1', fromPort: 'out', toNodeId: 'or_1', toPort: 'in1' },
      { id: 'c8', fromNodeId: 'and_2', fromPort: 'out', toNodeId: 'or_1', toPort: 'in2' },
      { id: 'c9', fromNodeId: 'or_1', fromPort: 'out', toNodeId: 'bulb_y', toPort: 'in' },
    ]
  },

  xorFromBasic: {
    name: 'XOR Gate Constructed from Basic Gates',
    description: 'How an Exclusive OR is built using AND, OR, and NOT gates (Hodder p. 55 / PDF p. 65).',
    textbookPage: 'p. 55 (PDF p. 65)',
    formula: 'X = (A + B) · (A · B)̄ = A ⊕ B',
    nodes: [
      { id: 'sw_a', type: 'SWITCH', x: 80, y: 140, label: 'A', state: 1 },
      { id: 'sw_b', type: 'SWITCH', x: 80, y: 280, label: 'B', state: 0 },
      { id: 'or_1', type: 'OR', x: 280, y: 140, label: 'OR' },
      { id: 'nand_1', type: 'NAND', x: 280, y: 280, label: 'NAND' },
      { id: 'and_1', type: 'AND', x: 480, y: 210, label: 'AND' },
      { id: 'bulb_x', type: 'LIGHTBULB', x: 650, y: 210, label: 'X (XOR)' },
    ],
    connections: [
      { id: 'c1', fromNodeId: 'sw_a', fromPort: 'out', toNodeId: 'or_1', toPort: 'in1' },
      { id: 'c2', fromNodeId: 'sw_b', fromPort: 'out', toNodeId: 'or_1', toPort: 'in2' },
      { id: 'c3', fromNodeId: 'sw_a', fromPort: 'out', toNodeId: 'nand_1', toPort: 'in1' },
      { id: 'c4', fromNodeId: 'sw_b', fromPort: 'out', toNodeId: 'nand_1', toPort: 'in2' },
      { id: 'c5', fromNodeId: 'or_1', fromPort: 'out', toNodeId: 'and_1', toPort: 'in1' },
      { id: 'c6', fromNodeId: 'nand_1', fromPort: 'out', toNodeId: 'and_1', toPort: 'in2' },
      { id: 'c7', fromNodeId: 'and_1', fromPort: 'out', toNodeId: 'bulb_x', toPort: 'in' },
    ]
  },

  babyAlarm: {
    name: 'Baby Alarm Problem: X = A · (B + C)',
    description: 'Alarm sounds when switch is ON (A) AND (baby crying (B) OR room too cold (C)) (Textbook p. 59 / PDF p. 69).',
    textbookPage: 'p. 59 (PDF p. 69)',
    formula: 'X = A · (B + C)',
    nodes: [
      { id: 'sw_a', type: 'SWITCH', x: 80, y: 100, label: 'A (Switch)', state: 1 },
      { id: 'sw_b', type: 'SWITCH', x: 80, y: 220, label: 'B (Crying)', state: 1 },
      { id: 'sw_c', type: 'SWITCH', x: 80, y: 340, label: 'C (Cold)', state: 0 },
      { id: 'or_bc', type: 'OR', x: 300, y: 280, label: 'OR (B+C)' },
      { id: 'and_final', type: 'AND', x: 480, y: 180, label: 'AND' },
      { id: 'alarm_bulb', type: 'LIGHTBULB', x: 660, y: 180, label: 'ALARM' },
    ],
    connections: [
      { id: 'c1', fromNodeId: 'sw_b', fromPort: 'out', toNodeId: 'or_bc', toPort: 'in1' },
      { id: 'c2', fromNodeId: 'sw_c', fromPort: 'out', toNodeId: 'or_bc', toPort: 'in2' },
      { id: 'c3', fromNodeId: 'sw_a', fromPort: 'out', toNodeId: 'and_final', toPort: 'in1' },
      { id: 'c4', fromNodeId: 'or_bc', fromPort: 'out', toNodeId: 'and_final', toPort: 'in2' },
      { id: 'c5', fromNodeId: 'and_final', fromPort: 'out', toNodeId: 'alarm_bulb', toPort: 'in' },
    ]
  },

  halfAdder: {
    name: '1-Bit Half Adder: Sum & Carry',
    description: 'Fundamental building block of the CPU Arithmetic Logic Unit (ALU). Sum = A ⊕ B, Carry = A · B.',
    textbookPage: 'p. 53, 55 (PDF p. 63, 65)',
    formula: 'Sum = A ⊕ B, Carry = A · B',
    nodes: [
      { id: 'sw_a', type: 'SWITCH', x: 80, y: 140, label: 'A', state: 1 },
      { id: 'sw_b', type: 'SWITCH', x: 80, y: 280, label: 'B', state: 1 },
      { id: 'xor_sum', type: 'XOR', x: 340, y: 140, label: 'XOR' },
      { id: 'and_carry', type: 'AND', x: 340, y: 280, label: 'AND' },
      { id: 'bulb_sum', type: 'LIGHTBULB', x: 550, y: 140, label: 'SUM' },
      { id: 'bulb_carry', type: 'LIGHTBULB', x: 550, y: 280, label: 'CARRY' },
    ],
    connections: [
      { id: 'c1', fromNodeId: 'sw_a', fromPort: 'out', toNodeId: 'xor_sum', toPort: 'in1' },
      { id: 'c2', fromNodeId: 'sw_b', fromPort: 'out', toNodeId: 'xor_sum', toPort: 'in2' },
      { id: 'c3', fromNodeId: 'sw_a', fromPort: 'out', toNodeId: 'and_carry', toPort: 'in1' },
      { id: 'c4', fromNodeId: 'sw_b', fromPort: 'out', toNodeId: 'and_carry', toPort: 'in2' },
      { id: 'c5', fromNodeId: 'xor_sum', fromPort: 'out', toNodeId: 'bulb_sum', toPort: 'in' },
      { id: 'c6', fromNodeId: 'and_carry', fromPort: 'out', toNodeId: 'bulb_carry', toPort: 'in' },
    ]
  }
};
