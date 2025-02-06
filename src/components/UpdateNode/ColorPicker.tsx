import React from 'react';
import styles from './UpdateNode.module.css';

interface ColorPickerProps {
    value: string;
    onChange: (color: string) => void;
    disabled: boolean;
}

const ColorPicker = ({ value, onChange, disabled } : ColorPickerProps) => {
    return (
        <input
            type="color"
            value={value}
            onChange={(evt) => onChange(evt.target.value)}
            disabled={disabled}
            className={styles.colorPicker}
        />
    );
};

export default ColorPicker;