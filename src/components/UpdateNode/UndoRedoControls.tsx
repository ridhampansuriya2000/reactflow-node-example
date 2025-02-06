import React from 'react';
import styles from './UpdateNode.module.css';

interface UndoRedoControlsProps {
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

const UndoRedoControls: React.FC<UndoRedoControlsProps> = ({ onUndo, onRedo, canUndo, canRedo }) => {
    return (
        <div className={styles.buttonGroup}>
            <button onClick={onUndo} disabled={!canUndo} className={`${styles.button} ${styles.UndoRedoBtn}`}>
                Undo
            </button>
            <button onClick={onRedo} disabled={!canRedo} className={`${styles.button} ${styles.UndoRedoBtn}`}>
                Redo
            </button>
        </div>
    );
};

export default UndoRedoControls;