import { TextField } from "@mui/material";
import type React from "react";

interface InputPros {
    label: string;
    value: string | number;
    type?: string;
    placeholder?: string;
    onChange: (value: string) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputPros> = ({ label, value, type, onChange, placeholder, onKeyDown }) => {
    return (
        <TextField
            label={label}
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            fullWidth
            required
        />
    )
}

export default Input;