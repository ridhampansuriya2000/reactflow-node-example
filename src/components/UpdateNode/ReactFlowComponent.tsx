import React, { useCallback } from 'react';
import { ReactFlow, useNodesState, useEdgesState, Background, OnNodesChange } from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import { NodeData } from './types';

interface ReactFlowComponentProps {
    nodes: NodeData[];
    edges: any[];
    onNodesChange: OnNodesChange<NodeData>;
    onEdgesChange: any;
    onNodeClick: (event: React.MouseEvent | undefined, node: any) => void;
    onNodeDragStop: (node: any) => void;
    nodeTypes: any;
    defaultViewport: any;
}

const ReactFlowComponent: React.FC<ReactFlowComponentProps> = ({
                                                                   nodes,
                                                                   edges,
                                                                   onNodesChange,
                                                                   onEdgesChange,
                                                                   onNodeClick,
                                                                   onNodeDragStop,
                                                                   nodeTypes,
                                                                   defaultViewport,
                                                               }) => {
    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            defaultViewport={defaultViewport}
            minZoom={0.2}
            style={{ background: '#F7F9FB' }}
            maxZoom={4}
            attributionPosition="bottom-left"
            fitView
            fitViewOptions={{ padding: 0.5 }}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            onNodeDragStop={onNodeDragStop}
        >
            <Background />
        </ReactFlow>
    );
};

export default ReactFlowComponent;