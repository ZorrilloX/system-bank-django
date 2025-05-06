import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { Button as BootstrapButton } from "react-bootstrap";

type ButtonProps = {
    title: string;
    onClick?: () => void;
    variant?: "primary" | "success" | "danger" | "info";
    type?: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>["type"];
    className?: string;
};

export const Button = ({ title, onClick, type, variant = "primary", className = "" }: ButtonProps) => {
    return (
        <BootstrapButton
            variant={variant}
            onClick={onClick}
            type={type}
            className={`rounded shadow px-4 py-2 fw-bold ${className}`}
            >
            {title}
        </BootstrapButton>
    );
};
