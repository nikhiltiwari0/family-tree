'use client';

import { useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  NodeChange,
  BackgroundVariant,
  Panel,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { GitBranch, Link2, X, Heart, ArrowDown, Users } from 'lucide-react';
import PersonNode from './PersonNode';
import { Person, FamilyData, Connection as FamilyConnection } from '@/types';

const nodeTypes = { person: PersonNode };

interface FamilyTreeCanvasProps {
  familyData: FamilyData;
  onNodePositionChange: (personId: string, position: { x: number; y: number }) => void;
  onConnect: (source: string, target: string, type: 'parent' | 'child' | 'spouse') => void;
  onDeleteConnection: (connectionId: string) => void;
  onEditPerson: (person: Person) => void;
  onDeletePerson: (personId: string) => void;
}

const edgeStyles = {
  parent: { stroke: '#22c55e', strokeWidth: 2 },
  child: { stroke: '#22c55e', strokeWidth: 2 },
  spouse: { stroke: '#ec4899', strokeWidth: 2, strokeDasharray: '5,5' }
};

export default function FamilyTreeCanvas({
  familyData,
  onNodePositionChange,
  onConnect,
  onDeleteConnection,
  onEditPerson,
  onDeletePerson
}: FamilyTreeCanvasProps) {
  const [pendingConnection, setPendingConnection] = useState<{ source: string; target: string } | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);

  // Convert family data to React Flow nodes
  const initialNodes: Node[] = familyData.people.map((person) => ({
    id: person.id,
    type: 'person',
    position: person.position,
    data: {
      person,
      onEdit: onEditPerson,
      onDelete: onDeletePerson
    }
  }));

  // Convert connections to edges
  const initialEdges: Edge[] = familyData.connections.map((conn) => ({
    id: conn.id,
    source: conn.source,
    target: conn.target,
    type: 'smoothstep',
    animated: conn.type === 'spouse',
    style: edgeStyles[conn.type],
    markerEnd: conn.type !== 'spouse' ? {
      type: MarkerType.ArrowClosed,
      color: '#22c55e'
    } : undefined,
    label: conn.type === 'spouse' ? '💑' : conn.type === 'parent' ? '👨‍👧' : '',
    labelStyle: { fontSize: 14 },
    labelBgStyle: { fill: '#18181b', fillOpacity: 0.8 },
    data: { type: conn.type }
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes when family data changes
  useEffect(() => {
    const newNodes: Node[] = familyData.people.map((person) => ({
      id: person.id,
      type: 'person',
      position: person.position,
      data: {
        person,
        onEdit: onEditPerson,
        onDelete: onDeletePerson
      }
    }));
    setNodes(newNodes);

    const newEdges: Edge[] = familyData.connections.map((conn) => ({
      id: conn.id,
      source: conn.source,
      target: conn.target,
      type: 'smoothstep',
      animated: conn.type === 'spouse',
      style: edgeStyles[conn.type],
      markerEnd: conn.type !== 'spouse' ? {
        type: MarkerType.ArrowClosed,
        color: '#22c55e'
      } : undefined,
      label: conn.type === 'spouse' ? '💑' : conn.type === 'parent' ? '👨‍👧' : '',
      labelStyle: { fontSize: 14 },
      labelBgStyle: { fill: '#18181b', fillOpacity: 0.8 },
      data: { type: conn.type }
    }));
    setEdges(newEdges);
  }, [familyData, setNodes, setEdges, onEditPerson, onDeletePerson]);

  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    onNodesChange(changes);
    
    // Handle position changes (drag end)
    changes.forEach((change) => {
      if (change.type === 'position' && change.position && !change.dragging) {
        onNodePositionChange(change.id, change.position);
      }
    });
  }, [onNodesChange, onNodePositionChange]);

  const handleConnect = useCallback((connection: Connection) => {
    if (connection.source && connection.target) {
      setPendingConnection({
        source: connection.source,
        target: connection.target
      });
    }
  }, []);

  const confirmConnection = (type: 'parent' | 'child' | 'spouse') => {
    if (pendingConnection) {
      onConnect(pendingConnection.source, pendingConnection.target, type);
      setPendingConnection(null);
    }
  };

  const handleEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge.id);
  }, []);

  const handleDeleteSelectedEdge = () => {
    if (selectedEdge) {
      onDeleteConnection(selectedEdge);
      setSelectedEdge(null);
    }
  };

  return (
    <div className="flex-1 h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onEdgeClick={handleEdgeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
        className="bg-zinc-950"
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: { stroke: '#525252', strokeWidth: 2 }
        }}
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1} 
          color="#27272a"
        />
        <Controls 
          className="!bg-zinc-800 !border-zinc-700 !rounded-xl overflow-hidden [&>button]:!bg-zinc-800 [&>button]:!border-zinc-700 [&>button]:!text-zinc-300 [&>button:hover]:!bg-zinc-700"
        />
        <MiniMap 
          className="!bg-zinc-900 !border-zinc-700 !rounded-xl"
          nodeColor="#f59e0b"
          maskColor="rgba(0,0,0,0.8)"
        />

        {/* Connection Type Selector Modal */}
        {pendingConnection && (
          <Panel position="top-center">
            <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-4 shadow-2xl">
              <div className="flex items-center gap-2 mb-3">
                <Link2 className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-semibold text-zinc-100">Select Relationship</h3>
                <button
                  onClick={() => setPendingConnection(null)}
                  className="ml-auto p-1 hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-zinc-400" />
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => confirmConnection('parent')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded-xl text-sm text-green-400 transition-colors"
                >
                  <ArrowDown className="w-4 h-4" />
                  Parent → Child
                </button>
                <button
                  onClick={() => confirmConnection('spouse')}
                  className="flex items-center gap-2 px-4 py-2 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/50 rounded-xl text-sm text-pink-400 transition-colors"
                >
                  <Heart className="w-4 h-4" />
                  Spouse
                </button>
              </div>
            </div>
          </Panel>
        )}

        {/* Selected Edge Actions */}
        {selectedEdge && (
          <Panel position="bottom-center">
            <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-3 shadow-xl flex items-center gap-3">
              <span className="text-sm text-zinc-400">Connection selected</span>
              <button
                onClick={handleDeleteSelectedEdge}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-sm text-red-400 transition-colors"
              >
                <X className="w-3 h-3" />
                Delete
              </button>
              <button
                onClick={() => setSelectedEdge(null)}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm text-zinc-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </Panel>
        )}

        {/* Family Info Header */}
        <Panel position="top-left">
          <div className="bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-xl px-4 py-2 flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-zinc-100">
              {familyData.familyName} Family
            </span>
            <span className="text-xs text-zinc-500 ml-2">
              {familyData.people.length} members
            </span>
          </div>
        </Panel>
      </ReactFlow>

      {/* Empty State */}
      {familyData.people.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-zinc-800/50 flex items-center justify-center">
              <Users className="w-10 h-10 text-zinc-600" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-400 mb-2">No family members yet</h3>
            <p className="text-sm text-zinc-500">Add your first person using the sidebar</p>
          </div>
        </div>
      )}
    </div>
  );
}

