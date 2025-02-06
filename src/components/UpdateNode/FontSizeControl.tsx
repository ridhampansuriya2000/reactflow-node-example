import React from 'react';
import styles from './UpdateNode.module.css';

interface FontSizeControlProps {
    value: number | string;
    onChange: (fontSize: number) => void;
    disabled: boolean;
}

const FontSizeControl: React.FC<FontSizeControlProps> = ({ value, onChange, disabled }) => {
    return (
        <select
            value={value}
            onChange={(evt) => onChange(Number(evt.target.value))}
            disabled={disabled}
            className={styles.select}
        >
            {Array.from({ length: 13 }, (_, i) => 12 + i).map((size) => (
                <option key={size} value={size}>{size}</option>
            ))}
        </select>
    );
};

export default FontSizeControl;