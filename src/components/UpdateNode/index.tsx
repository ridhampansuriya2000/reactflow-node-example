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

    useEffect(() => {
        if (isReset) {
            setNodes(cloneDeep(nodesFromStore))
            setEdges(edgesFromStore)
            setHistory(historyFromStore)
            dispatch(setResetFlag(false));
        }
    }, [isReset]);


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

    /** Update nodes and history while change node name */
    useEffect(() => {
        if (selectedNodeId) {
            const newNodes = nodes.map((node) => {
                if (node.id === selectedNodeId) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            label: nodeName,
                        },
                    };
                }
                return node;
            });
            setNodes(cloneDeep(newNodes));
            saveHistory(newNodes, false);
        }
    }, [nodeName]);

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
        console.log("node",node)
        saveHistory(nodes,false)
    }

    const onEdgesChangeWithSelect = (node) => {
        console.log('props, select', node);
        setSelectedNodeId(node[0].id);
        onEdgesChange(node);
    };

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

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChangeWithSelect}
            onEdgesChange={onEdgesChangeWithSelect}
            defaultViewport={defaultViewport}
            // onViewportChange={()=>{}}
            minZoom={0.2}
            style={{ background: '#F7F9FB' }}
            maxZoom={4}
            attributionPosition="bottom-left"
            fitView
            fitViewOptions={{ padding: 0.5 }}
            onNodeClick={handleNodeClick}
            nodeTypes={nodeTypes}
            onNodeDragStop={onNodeDragStop}
        >
            <div className="update-node__controls">
                <div className={styles.controls}>
                    <label className={styles.label}>Selected Node: <span>{selectedNodeId || 'None'}</span></label>

                    <div className={styles.buttonGroup}>
                        <button onClick={undo} disabled={history.past.length === 0} className={`${styles.button} ${styles.UndoRedoBtn}`}>
                            Undo
                        </button>
                        <button onClick={redo} disabled={history.future.length === 0} className={`${styles.button} ${styles.UndoRedoBtn}`}>
                            Redo
                        </button>
                    </div>

                    <label className={styles.label}>Label:</label>
                    <input
                        value={nodeName}
                        onChange={(evt) => setNodeName(evt.target.value)}
                        disabled={!selectedNodeId}
                        className={styles.input}
                    />

                    <label className={styles.label}>Color:</label>
                    <input
                        type="color"
                        value={nodeColor}
                        onChange={(evt) => handleChangeColor(evt.target.value)}
                        disabled={!selectedNodeId}
                        className={styles.colorPicker}
                    />

                    <label className={styles.label}>Font Size:</label>
                    <select
                        value={nodeFontSize}
                        onChange={(evt) => handleChangeFont(Number(evt.target.value))}
                        disabled={!selectedNodeId}
                        className={styles.select}
                    >
                        {Array.from({ length: 13 }, (_, i) => 12 + i).map((size) => (
                            <option key={size} value={size}>{size}</option>
                        ))}
                    </select>

                    <button
                        onClick={async () => await dispatch(resetState())}
                        className={`${styles.button} ${styles.resetButton}`}
                    >
                        Reset
                    </button>
                </div>
            </div>
            <Background />
        </ReactFlow>
    );
};

export default UpdateNode;
