import { TextField } from "@mui/material";
import type React from "react";

interface InputPros {
    label: string;
    value: string | number;
    type?: string;
    placeholder?: string;
    onChange: (value: string) => void;
}

const Input: React.FC<InputPros> = ({ label, value, type, onChange, placeholder}) => {
    return (
        <TextField
            label={label}
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            fullWidth
            required
        />
    )
}

export default Input;