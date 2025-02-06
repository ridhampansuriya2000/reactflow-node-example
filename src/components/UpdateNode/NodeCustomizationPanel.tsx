import React from 'react';
import styles from './UpdateNode.module.css';
import ColorPicker from './ColorPicker';
import FontSizeControl from './FontSizeControl';
import UndoRedoControls from "./UndoRedoControls";

interface NodeCustomizationPanelProps {
    selectedNodeId: string | null;
    nodeName: string;
    nodeColor: string;
    nodeFontSize: number | string;
    onNodeNameChange: (newName: string) => void;
    onColorChange: (color: string) => void;
    onFontSizeChange: (fontSize: number) => void;
    onReset: () => void;
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

const NodeCustomizationPanel: React.FC<NodeCustomizationPanelProps> = ({
                                                                           selectedNodeId,
                                                                           nodeName,
                                                                           nodeColor,
                                                                           nodeFontSize,
                                                                           onNodeNameChange,
                                                                           onColorChange,
                                                                           onFontSizeChange,
                                                                           onReset,
                                                                           onUndo,
                                                                           onRedo,
                                                                           canUndo,
                                                                           canRedo
                                                                       }) => {
    return (
        <div className="update-node__controls">
            <div className={styles.controls}>
                <label className={styles.label}>Selected Node: <span>{selectedNodeId || 'None'}</span></label>

                <UndoRedoControls onUndo={onUndo} onRedo={onRedo} canUndo={canUndo} canRedo={canRedo} />

                <label className={styles.label}>Label:</label>
                <input
                    value={nodeName}
                    onChange={(evt) => onNodeNameChange(evt.target.value)}
                    disabled={!selectedNodeId}
                    className={styles.input}
                />

                <label className={styles.label}>Color:</label>
                <ColorPicker value={nodeColor} onChange={onColorChange} disabled={!selectedNodeId} />

                <label className={styles.label}>Font Size:</label>
                <FontSizeControl value={nodeFontSize} onChange={onFontSizeChange} disabled={!selectedNodeId} />

                <button
                    onClick={onReset}
                    className={`${styles.button} ${styles.resetButton}`}
                >
                    Reset
                </button>
            </div>
        </div>
    );
};

export default NodeCustomizationPanel;