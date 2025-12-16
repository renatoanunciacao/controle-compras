import type React from "react";
import { TextField } from "@mui/material";

interface InputPros {
    label: string;
    value: string | number;
    type?: string;
    placeholder?: string;
    required?: boolean;
    onChange: (value: string) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputPros> = ({ label, value, type, onChange, placeholder, onKeyDown, required }) => {
    return (
        <TextField
            label={label}
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            fullWidth
            required={required}
            slotProps={{
                input: {
                    required,
                },
            }}
        />
    )
}

export default Input;