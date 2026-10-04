import React, { useState, useRef, useEffect } from 'react';
import { 
  CircuitNode, 
  CircuitConnection, 
  GateType 
} from '../types';
import { 
  simulateCircuit, 
  PRESET_CIRCUITS, 
  generateTruthTable 
} from '../utils/circuitEngine';
import { LogicGateSymbol } from './LogicGateSymbol';
import { 
  Play, 
  RotateCcw, 
  Trash2, 
  Plus, 
  Zap, 
  CheckCircle2, 
  Sparkles, 
  Table2, 
  HelpCircle, 
  BookOpen, 
  ToggleLeft, 
  ToggleRight,
  Lightbulb,
  MousePointer,
  Link2,
  Unlink2
} from 'lucide-react';

export const CircuitBuilder: React.FC = () => {
  // Initial state loads the textbook example circuit Y = (A · B) + (Ā · B̄) (p. 65-66)
  const [nodes, setNodes] = useState<CircuitNode[]>(PRESET_CIRCUITS.textbookExample.nodes);
  const [connections, setConnections] = useState<CircuitConnection[]>(PRESET_CIRCUITS.textbookExample.connections);
  const [activePresetKey, setActivePresetKey] = useState<string>('textbookExample');

  // Dragging state
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Wiring state
  const [wiringStart, setWiringStart] = useState<{ nodeId: string; port: 'out' } | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Selected item for deletion
  const [selectedWireId, setSelectedWireId] = useState<string | null>(null);
  const [showTruthTableModal, setShowTruthTableModal] = useState<boolean>(false);

  const canvasRef = useRef<HTMLDivElement | null>(null);

  // Run real-time simulation on current circuit
  const { nodeOutputs, wireSignals } = simulateCircuit(nodes, connections);

  // Handle Switch Toggle
  const toggleSwitch = (nodeId: string) => {
    setNodes(prev => prev.map(n => {
      if (n.id === nodeId && n.type === 'SWITCH') {
        const nextState = n.state === 1 ? 0 : 1;
        return { ...n, state: nextState };
      }
      return n;
    }));
  };

  // Add Gate to Canvas
  const addNode = (type: GateType) => {
    const count = nodes.filter(n => n.type === type).length + 1;
    let label = `${type} ${count}`;
    if (type === 'SWITCH') {
      const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
      const swCount = nodes.filter(n => n.type === 'SWITCH').length;
      label = letters[swCount] || `IN ${swCount + 1}`;
    } else if (type === 'LIGHTBULB') {
      const letters = ['Y', 'X', 'Z', 'Q'];
      const bulbCount = nodes.filter(n => n.type === 'LIGHTBULB').length;
      label = letters[bulbCount] || `OUT ${bulbCount + 1}`;
    }

    const newNode: CircuitNode = {
      id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      type,
      x: 350 + (Math.random() * 60 - 30),
      y: 200 + (Math.random() * 60 - 30),
      label,
      state: type === 'SWITCH' ? 0 : undefined
    };

    setNodes(prev => [...prev, newNode]);
  };

  // Delete Node and its associated wires
  const deleteNode = (nodeId: string) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    setConnections(prev => prev.filter(c => c.fromNodeId !== nodeId && c.toNodeId !== nodeId));
  };

  // Delete Wire
  const deleteWire = (wireId: string) => {
    setConnections(prev => prev.filter(c => c.id !== wireId));
    setSelectedWireId(null);
  };

  // Drag Handlers
  const handleMouseDown = (nodeId: string, e: React.MouseEvent) => {
    if (wiringStart) return; // In wiring mode
    if ((e.target as HTMLElement).tagName === 'BUTTON' || (e.target as HTMLElement).closest('.port-pin')) {
      return;
    }
    const node = nodes.find(n => n.id === nodeId);
    if (!node || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    setDraggingNodeId(nodeId);
    setDragOffset({
      x: (e.clientX - rect.left) - node.x,
      y: (e.clientY - rect.top) - node.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    setMousePos({ x: currentX, y: currentY });

    if (draggingNodeId) {
      setNodes(prev => prev.map(n => {
        if (n.id === draggingNodeId) {
          return {
            ...n,
            x: Math.max(20, Math.min(rect.width - 120, currentX - dragOffset.x)),
            y: Math.max(20, Math.min(rect.height - 90, currentY - dragOffset.y))
          };
        }
        return n;
      }));
    }
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
  };

  // Wiring Handlers
  const handleStartWire = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWiringStart({ nodeId, port: 'out' });
  };

  const handleEndWire = (toNodeId: string, toPort: 'in1' | 'in2' | 'in', e: React.MouseEvent) => {
    e.stopPropagation();
    if (!wiringStart) return;
    if (wiringStart.nodeId === toNodeId) {
      setWiringStart(null);
      return; // Cannot wire gate to itself
    }

    // Remove any existing connection to this specific target port
    const filtered = connections.filter(c => !(c.toNodeId === toNodeId && c.toPort === toPort));

    const newConn: CircuitConnection = {
      id: `conn_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      fromNodeId: wiringStart.nodeId,
      fromPort: 'out',
      toNodeId,
      toPort
    };

    setConnections([...filtered, newConn]);
    setWiringStart(null);
  };

  const cancelWiring = () => {
    setWiringStart(null);
  };

  // Load Preset Circuit
  const loadPreset = (presetKey: string) => {
    if (presetKey === 'blank') {
      setNodes([]);
      setConnections([]);
      setActivePresetKey('blank');
      return;
    }
    const preset = PRESET_CIRCUITS[presetKey];
    if (preset) {
      setNodes(preset.nodes);
      setConnections(preset.connections);
      setActivePresetKey(presetKey);
    }
  };

  // Calculate coordinates for node ports
  const getPortCoordinates = (node: CircuitNode, port: 'in1' | 'in2' | 'in' | 'out') => {
    if (node.type === 'SWITCH') {
      return { x: node.x + 90, y: node.y + 35 };
    }
    if (node.type === 'LIGHTBULB') {
      return { x: node.x + 10, y: node.y + 35 };
    }
    if (node.type === 'NOT' || node.type === 'BUFFER') {
      if (port === 'in' || port === 'in1') return { x: node.x + 5, y: node.y + 35 };
      return { x: node.x + 105, y: node.y + 35 };
    }

    // 2-input gates (AND, OR, XOR, NAND, NOR, XNOR)
    if (port === 'in1') return { x: node.x + 5, y: node.y + 20 };
    if (port === 'in2') return { x: node.x + 5, y: node.y + 50 };
    return { x: node.x + 105, y: node.y + 35 };
  };

  // Generate Truth Table for current circuit
  const truthTable = generateTruthTable(nodes, connections);

  return (
    <div className="space-y-6">
      {/* Overview & Textbook Reference Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-800/40 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                Textbook p. 51–66 (PDF p. 61–76)
              </span>
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Topics A1.2.3 & A1.2.5</span>
            </div>
            <h3 className="text-lg font-bold text-white">Interactive Logic Gate Canvas & Circuit Builder</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Place basic gates (<strong className="text-cyan-400">AND, OR, NOT, XOR, NAND, NOR, XNOR</strong>), wire outputs to inputs, toggle the input switches, 
              and watch electrical current propagate in real time through the logic circuit to the output light bulb!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTruthTableModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-800/40 text-xs font-semibold shadow-sm transition-all"
            >
              <Table2 className="w-4 h-4 text-cyan-400" />
              <span>Analyze Truth Table (A1.2.4)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preset Selector Bar */}
      <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">Presets:</span>
          {Object.entries(PRESET_CIRCUITS).map(([key, item]) => (
            <button
              key={key}
              onClick={() => loadPreset(key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activePresetKey === key
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
              }`}
            >
              {item.name}
            </button>
          ))}
          <button
            onClick={() => loadPreset('blank')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activePresetKey === 'blank'
                ? 'bg-rose-500 text-white font-bold'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-400 border border-slate-700/60'
            }`}
          >
            Clear / Blank Canvas
          </button>
        </div>

        {activePresetKey && PRESET_CIRCUITS[activePresetKey] && (
          <div className="text-xs font-mono text-cyan-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
            Formula: <strong className="text-white">{PRESET_CIRCUITS[activePresetKey].formula}</strong>
          </div>
        )}
      </div>

      {/* Main Interactive Circuit Canvas */}
      <div className="relative rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden flex flex-col select-none">
        {/* Canvas Toolbar */}
        <div className="p-3 bg-slate-900/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-400 font-semibold mr-1 flex items-center gap-1">
              <Plus className="w-3.5 h-3.5 text-cyan-400" /> Add Gate:
            </span>
            <button onClick={() => addNode('SWITCH')} className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono border border-slate-700 font-semibold">
              + Switch
            </button>
            <button onClick={() => addNode('AND')} className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono border border-slate-700 font-semibold">
              + AND
            </button>
            <button onClick={() => addNode('OR')} className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono border border-slate-700 font-semibold">
              + OR
            </button>
            <button onClick={() => addNode('NOT')} className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono border border-slate-700 font-semibold">
              + NOT
            </button>
            <button onClick={() => addNode('XOR')} className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono border border-slate-700 font-semibold">
              + XOR
            </button>
            <button onClick={() => addNode('NAND')} className="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-mono border border-slate-700">
              + NAND
            </button>
            <button onClick={() => addNode('NOR')} className="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-mono border border-slate-700">
              + NOR
            </button>
            <button onClick={() => addNode('XNOR')} className="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-mono border border-slate-700">
              + XNOR
            </button>
            <button onClick={() => addNode('LIGHTBULB')} className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-semibold">
              + Lightbulb
            </button>
          </div>

          <div className="flex items-center gap-3">
            {wiringStart && (
              <div className="flex items-center gap-2 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-lg border border-amber-500/40 animate-pulse text-[11px]">
                <span>Wiring from output: Click an input pin to connect</span>
                <button onClick={cancelWiring} className="underline text-white font-bold ml-1">Cancel</button>
              </div>
            )}
            <span className="text-[11px] text-slate-400 font-mono">
              {nodes.length} Nodes | {connections.length} Wires
            </span>
          </div>
        </div>

        {/* Canvas Working Space */}
        <div 
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onClick={cancelWiring}
          className="relative w-full h-[540px] bg-slate-950 overflow-hidden cursor-crosshair"
          style={{
            backgroundImage: `radial-gradient(#1e293b 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        >
          {/* SVG Canvas for Wires */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="wireHigh" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
            </defs>

            {/* Render all existing circuit connections */}
            {connections.map((conn) => {
              const fromNode = nodes.find(n => n.id === conn.fromNodeId);
              const toNode = nodes.find(n => n.id === conn.toNodeId);
              if (!fromNode || !toNode) return null;

              const p1 = getPortCoordinates(fromNode, conn.fromPort);
              const p2 = getPortCoordinates(toNode, conn.toPort);

              const signal = wireSignals[conn.id] ?? 0;
              const isHigh = signal === 1;

              // Orthogonal or Bezier routing curve
              const dx = p2.x - p1.x;
              const controlOffset = Math.max(30, Math.abs(dx) * 0.45);
              const pathD = `M ${p1.x} ${p1.y} C ${p1.x + controlOffset} ${p1.y}, ${p2.x - controlOffset} ${p2.y}, ${p2.x} ${p2.y}`;

              const isSelected = selectedWireId === conn.id;

              return (
                <g key={conn.id} className="pointer-events-auto cursor-pointer" onClick={(e) => { e.stopPropagation(); setSelectedWireId(conn.id); }}>
                  {/* Thick invisible hit area */}
                  <path d={pathD} fill="none" stroke="transparent" strokeWidth="14" />
                  
                  {/* Outer wire glow when HIGH */}
                  {isHigh && (
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="5"
                      strokeOpacity="0.4"
                      filter="blur(3px)"
                    />
                  )}

                  {/* Wire core */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={isSelected ? '#f43f5e' : isHigh ? '#22d3ee' : '#334155'}
                    strokeWidth={isSelected ? 3.5 : isHigh ? 2.5 : 2}
                    strokeDasharray={isHigh ? '6 3' : undefined}
                    className={isHigh ? 'animate-pulse' : ''}
                  />

                  {/* Signal value bead in center of wire */}
                  <circle
                    cx={(p1.x + p2.x) / 2}
                    cy={(p1.y + p2.y) / 2}
                    r="6"
                    fill={isHigh ? '#22d3ee' : '#1e293b'}
                    stroke="#0f172a"
                    strokeWidth="1.5"
                  />
                  <text
                    x={(p1.x + p2.x) / 2}
                    y={(p1.y + p2.y) / 2 + 3}
                    textAnchor="middle"
                    fill={isHigh ? '#0f172a' : '#94a3b8'}
                    fontSize="8"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {signal}
                  </text>
                </g>
              );
            })}

            {/* Rendering wire in progress of being drawn */}
            {wiringStart && (() => {
              const fromNode = nodes.find(n => n.id === wiringStart.nodeId);
              if (!fromNode) return null;
              const p1 = getPortCoordinates(fromNode, 'out');
              return (
                <path
                  d={`M ${p1.x} ${p1.y} C ${p1.x + 50} ${p1.y}, ${mousePos.x - 50} ${mousePos.y}, ${mousePos.x} ${mousePos.y}`}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                />
              );
            })()}
          </svg>

          {/* Render All Canvas Nodes */}
          {nodes.map((node) => {
            const outVal = nodeOutputs[node.id] ?? 0;
            const isSingleInput = node.type === 'NOT' || node.type === 'BUFFER' || node.type === 'LIGHTBULB';

            return (
              <div
                key={node.id}
                onMouseDown={(e) => handleMouseDown(node.id, e)}
                style={{
                  position: 'absolute',
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  zIndex: draggingNodeId === node.id ? 30 : 10
                }}
                className={`group select-none transition-shadow ${
                  draggingNodeId === node.id ? 'cursor-grabbing' : 'cursor-grab'
                }`}
              >
                {/* Switch Node Custom UI */}
                {node.type === 'SWITCH' ? (
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col items-center min-w-[90px] relative">
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-bold font-mono text-cyan-300">{node.label}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteNode(node.id); }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                        title="Delete switch"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Toggle Button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleSwitch(node.id); }}
                      className={`w-full py-2 px-3 rounded-xl font-mono font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95 ${
                        node.state === 1
                          ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 border border-emerald-300 shadow-emerald-500/30'
                          : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-base">{node.state === 1 ? '1 (HIGH)' : '0 (LOW)'}</span>
                    </button>

                    {/* Output Port Pin (Right) */}
                    <div
                      onClick={(e) => handleStartWire(node.id, e)}
                      title="Output Pin: Click to wire"
                      className="port-pin absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-900 border-2 border-cyan-400 hover:border-amber-400 hover:scale-125 flex items-center justify-center transition-all cursor-crosshair shadow-md"
                    >
                      <div className={`w-2 h-2 rounded-full ${node.state === 1 ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`} />
                    </div>
                  </div>
                ) : node.type === 'LIGHTBULB' ? (
                  /* Lightbulb Output Probe UI */
                  <div className="relative">
                    {/* Input Port Pin (Left) */}
                    <div
                      onClick={(e) => handleEndWire(node.id, 'in', e)}
                      title="Connect Wire to Input"
                      className="port-pin absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-900 border-2 border-amber-400 hover:border-emerald-400 hover:scale-125 flex items-center justify-center transition-all cursor-crosshair shadow-md z-20"
                    >
                      <div className="w-2 h-2 rounded-full bg-amber-400" />
                    </div>

                    <LogicGateSymbol type="LIGHTBULB" outputVal={outVal} label={node.label} />

                    <button
                      onClick={(e) => { e.stopPropagation(); deleteNode(node.id); }}
                      className="opacity-0 group-hover:opacity-100 absolute -top-2 -right-2 p-1 rounded-full bg-slate-900 border border-slate-700 text-slate-500 hover:text-rose-400 transition-opacity z-20"
                      title="Delete output"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  /* Standard IEEE Logic Gate UI */
                  <div className="relative">
                    {/* Delete button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteNode(node.id); }}
                      className="opacity-0 group-hover:opacity-100 absolute -top-2 -right-2 p-1 rounded-full bg-slate-900 border border-slate-700 text-slate-500 hover:text-rose-400 transition-opacity z-20"
                      title="Delete gate"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>

                    {/* Gate Label */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-mono text-slate-500 font-semibold uppercase">
                      {node.label}
                    </div>

                    {/* Input Ports Pins (Left) */}
                    {isSingleInput ? (
                      <div
                        onClick={(e) => handleEndWire(node.id, 'in', e)}
                        title="Input Pin (Single): Click to connect wire"
                        className="port-pin absolute -left-2.5 top-[23px] w-5 h-5 rounded-full bg-slate-900 border-2 border-slate-500 hover:border-cyan-400 hover:scale-125 flex items-center justify-center transition-all cursor-crosshair shadow z-20"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      </div>
                    ) : (
                      <>
                        <div
                          onClick={(e) => handleEndWire(node.id, 'in1', e)}
                          title="Input Pin 1 (Top): Click to connect wire"
                          className="port-pin absolute -left-2.5 top-[8px] w-5 h-5 rounded-full bg-slate-900 border-2 border-slate-500 hover:border-cyan-400 hover:scale-125 flex items-center justify-center transition-all cursor-crosshair shadow z-20"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        </div>
                        <div
                          onClick={(e) => handleEndWire(node.id, 'in2', e)}
                          title="Input Pin 2 (Bottom): Click to connect wire"
                          className="port-pin absolute -left-2.5 top-[38px] w-5 h-5 rounded-full bg-slate-900 border-2 border-slate-500 hover:border-cyan-400 hover:scale-125 flex items-center justify-center transition-all cursor-crosshair shadow z-20"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        </div>
                      </>
                    )}

                    {/* SVG Gate Shape */}
                    <LogicGateSymbol type={node.type} outputVal={outVal} label={node.label} />

                    {/* Output Port Pin (Right) */}
                    <div
                      onClick={(e) => handleStartWire(node.id, e)}
                      title="Output Pin: Click to drag wire"
                      className="port-pin absolute -right-2.5 top-[23px] w-5 h-5 rounded-full bg-slate-900 border-2 border-cyan-400 hover:border-amber-400 hover:scale-125 flex items-center justify-center transition-all cursor-crosshair shadow z-20"
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${outVal === 1 ? 'bg-cyan-400 animate-pulse' : 'bg-slate-500'}`} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Canvas Footer Bar */}
        <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Real-Time Evaluation Active</span>
            </span>
            <span>Click switches on the left to test inputs</span>
            <span>Click any wire to select & delete</span>
          </div>

          {selectedWireId && (
            <div className="flex items-center gap-2 bg-rose-950/60 text-rose-300 px-3 py-1 rounded-lg border border-rose-800">
              <span>Wire Selected:</span>
              <button 
                onClick={() => deleteWire(selectedWireId)}
                className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-semibold"
              >
                Delete Wire
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Truth Table Modal / Drawer (Topic A1.2.4) */}
      {showTruthTableModal && (
        <div className="p-6 rounded-2xl bg-slate-900/95 border border-cyan-800/60 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Table2 className="w-5 h-5 text-cyan-400" />
                Truth Table Analysis for Current Circuit (A1.2.4)
              </h4>
              <p className="text-xs text-slate-400">
                Automatically calculated for all {truthTable.inputs.length} input switches ({truthTable.rows.length} rows = 2^{truthTable.inputs.length}).
              </p>
            </div>
            <button
              onClick={() => setShowTruthTableModal(false)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700"
            >
              Close Table
            </button>
          </div>

          {truthTable.rows.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-center text-xs border-collapse bg-slate-950 font-mono">
                <thead>
                  <tr className="bg-slate-900 text-slate-300 border-b border-slate-800">
                    {truthTable.inputs.map(inp => (
                      <th key={inp.id} className="p-2.5 font-bold text-cyan-400 border-r border-slate-800">
                        {inp.label}
                      </th>
                    ))}
                    {truthTable.outputs.map(out => (
                      <th key={out.id} className="p-2.5 font-bold text-amber-400 border-r border-slate-800">
                        {out.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {truthTable.rows.map((row, rIdx) => {
                    // Check if current row matches active switch states
                    const isCurrentRow = truthTable.inputs.every(inp => {
                      const switchNode = nodes.find(n => n.id === inp.id);
                      return switchNode?.state === row.inputs[inp.label];
                    });

                    return (
                      <tr key={rIdx} className={isCurrentRow ? 'bg-cyan-950/60 text-cyan-200 font-bold border-l-4 border-l-cyan-400' : 'hover:bg-slate-900/40'}>
                        {truthTable.inputs.map(inp => (
                          <td key={inp.id} className="p-2 border-r border-slate-800">
                            {row.inputs[inp.label]}
                          </td>
                        ))}
                        {truthTable.outputs.map(out => (
                          <td key={out.id} className={`p-2 border-r border-slate-800 ${row.outputs[out.label] === 1 ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                            {row.outputs[out.label]}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-slate-400 text-xs">
              No input switches found on canvas. Add at least one Switch to generate a Truth Table.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
