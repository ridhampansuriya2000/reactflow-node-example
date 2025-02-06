import React, {useCallback, useEffect, useState} from 'react';
import { ReactFlow, useNodesState, useEdgesState, Background } from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import ColorSelectorNode from "../ColorSelectorNode";
import {useDispatch, useSelector} from "react-redux";
import cloneDeep from "lodash/cloneDeep";
import { setEdges as setEdgesAction } from "../../store/slices/edgesSlice";
import { setNodes as setNodesAction } from "../../store/slices/nodesSlice";
import { setHistory as setHistoryAction } from "../../store/slices/historySlice";
import {RootState} from "../../store/store";
import {resetState, setResetFlag} from "../../store/actions";
import { OnNodesChange } from '@xyflow/react';
import styles from './UpdateNode.module.css';
import ReactFlowComponent from "./ReactFlowComponent";
import NodeCustomizationPanel from "./NodeCustomizationPanel";
import UndoRedoControls from "./UndoRedoControls";

interface NodeData {
    id: string;
    position: { x: number; y: number };
    data: {
        label: string;
        color: string;
        fontSize: number | string;
    };
    style?: {

    }
}


function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
}

const defaultViewport = { x: 0, y: 0, zoom: 1.5 };

const UpdateNode = () => {

    const dispatch = useDispatch();

    const nodesFromStore = useSelector((state: RootState) => state.nodes.nodes);
    const edgesFromStore = useSelector((state: RootState) => state.edges.edges);
    const historyFromStore = useSelector((state: RootState) => state.history.history);
    const isReset = useSelector((state: RootState) => state.reset.isReset);

    /** State for nodes and edges */
    const [nodes, setNodes, onNodesChange]:[NodeData[], React.Dispatch<React.SetStateAction<NodeData[]>>, OnNodesChange<NodeData>] = useNodesState(nodesFromStore);
    const [edges, setEdges, onEdgesChange] = useEdgesState(edgesFromStore);

    /** Selected Node State */
    const [nodeName, setNodeName] = useState('Node 1');
    const [nodeColor, setNodeColor] = useState('#FFFFFF');
    const [nodeFontSize, setNodeFontSize] = useState(14);
    const [isOnceRendered, setIsOnceRendered] = useState(false);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

    const [history, setHistory] = useState(historyFromStore || { past: [], present: nodes, future: [] });

    /** Reset initial state in redux */
    useEffect(() => {
        if (isReset) {
            setNodes(cloneDeep(nodesFromStore))
            setEdges(edgesFromStore)
            setHistory(historyFromStore)
            dispatch(setResetFlag(false));
        }
    }, [isReset]);

    /** Save history for undo/redo */
    const saveHistory = (newNodes, resetFuture = true) => {
        setHistory((prev) => ({
            past: [...prev.past, prev.present],
            present: newNodes,
            future: resetFuture ? [] : prev.future,
        }));
    };

    /** Debounced save history function */
    const debouncedSaveHistory = useCallback(
        debounce((nodes) => {
            saveHistory(nodes, false);
        }, 500),
        []
    );

    const undo = () => {
        if (history.past.length > 0) {
            selectedNodeId && handleResetSelectedNode()
            const previous = history.past[history.past.length - 1];
            const newPast = history.past.slice(0, -1);
            setHistory({
                past: newPast.filter(data => data ),
                present: previous,
                future: [history.present, ...history.future],
            });
            setNodes(cloneDeep(previous));
        }
    };

    const redo = () => {
        if (history.future.length > 0) {
            selectedNodeId && handleResetSelectedNode()
            const next = history.future[0];
            const newFuture = history.future.slice(1);
            setHistory({
                past: [...history.past, history.present],
                present: next,
                future: newFuture,
            });
            setNodes(cloneDeep(next));
        }
    };

    const nodeTypes = {
        selectorNode: ColorSelectorNode,
    };

    /** Handle node name change */
    const handleChangeNodeName = useCallback(
        (newName) => {
            setNodeName(newName);

            if (selectedNodeId && newName) {
                const newNodes = nodes.map((node) => {
                    if (node.id === selectedNodeId) {
                        return {
                            ...node,
                            data: {
                                ...node.data,
                                label: newName,
                            },
                        };
                    }
                    return node;
                });
                setNodes(cloneDeep(newNodes));
                debouncedSaveHistory(newNodes, 'node');
            }
        },
        [nodes, selectedNodeId]
    );

    /** Handle color change */
    const handleChangeColor = useCallback(
        (nodeColor) => {
            setNodeColor(nodeColor);

            if (selectedNodeId) {
                const newNodes = nodes.map((node) =>
                    node.id === selectedNodeId
                        ? {
                            ...node,
                            data: {
                                ...node.data,
                                color: nodeColor,
                            },
                            style: {
                                ...node.style,
                                backgroundColor: nodeColor,
                            },
                        }
                        : node
                );

                setNodes(cloneDeep(newNodes));
                debouncedSaveHistory(newNodes);
            }
        },
        [nodes, selectedNodeId]
    );

    /** Handle font size change */
    const handleChangeFont = useCallback(
        (fontSize) => {
            setNodeFontSize(fontSize);

            if (selectedNodeId) {
                const newNodes = nodes.map((node) => {
                    if (node.id === selectedNodeId) {
                        return {
                            ...node,
                            data: {
                                ...node.data,
                                fontSize: fontSize,
                            },
                            style: {
                                ...cloneDeep(node.style),
                                fontSize: fontSize,
                            },
                        };
                    }
                    return node;
                });
                setNodes(cloneDeep(newNodes));
                debouncedSaveHistory(newNodes);
            }
        },
        [selectedNodeId, nodes]
    );


    const onNodesChangeWithSelect = (node) => {
        const selectedNode = Object.values(nodes).find((nod) => nod.id == node[0].id);
        handleNodeClick(undefined, selectedNode);
        onNodesChange(node);
    };

    const onNodeDragStop = (node) =>{
        saveHistory(nodes,false)
    }


    /** Handle node selection */
    const handleNodeClick = (event: React.MouseEvent|undefined, node: any) => {
        if(isOnceRendered){
            setSelectedNodeId(node.id);
            setNodeName(node.data.label);
            setNodeColor(node.data.color);
            setNodeFontSize(node.data.fontSize);
        }
        setIsOnceRendered(true)
    };

    /** Reset selection on mount */

    const handleResetSelectedNode = () =>{
        setSelectedNodeId('')
        setNodeName('')
        setNodeColor('#ffffff')
    }
    useEffect(()=>{
        handleResetSelectedNode()
    },[])

    useEffect(()=>{
        dispatch(setEdgesAction(edges));
        dispatch(setNodesAction(nodes));
        dispatch(setHistoryAction(history));
    },[history])

    if(true){
        return (
            <>
                <ReactFlowComponent
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChangeWithSelect}
                    onEdgesChange={() => {}}
                    onNodeClick={handleNodeClick}
                    onNodeDragStop={onNodeDragStop}
                    nodeTypes={nodeTypes}
                    defaultViewport={defaultViewport}
                />
                <NodeCustomizationPanel
                    selectedNodeId={selectedNodeId}
                    nodeName={nodeName}
                    nodeColor={nodeColor}
                    nodeFontSize={nodeFontSize}
                    onNodeNameChange={handleChangeNodeName}
                    onColorChange={handleChangeColor}
                    onFontSizeChange={handleChangeFont}
                    onReset={async () => await dispatch(resetState())}
                    onUndo={undo}
                    onRedo={redo}
                    canUndo={history.past.length > 0}
                    canRedo={history.future.length > 0}
                />
            </>
        );
    }
};

export default UpdateNode;
