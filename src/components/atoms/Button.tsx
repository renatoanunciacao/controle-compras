// atoms/Button.tsx
import React from "react";
import MuiButton, { type ButtonProps as MuiButtonProps } from "@mui/material/Button";

const Button: React.FC<MuiButtonProps> = (props) => {
    return <MuiButton {...props} />;
};

export default Button;
