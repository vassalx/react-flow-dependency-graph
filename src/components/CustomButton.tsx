import React from "react";

interface CustomButtonProps {
    label?: React.ReactNode;
    icon?: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    color?: "black" | "white" | "green" | "blue" | "red" | "yellow";
    className?: string;
    disabled?: boolean;
}

const colorClasses: Record<NonNullable<CustomButtonProps["color"]>, string> = {
    black: "bg-neutral-950 text-neutral-50",
    white: "bg-white text-neutral-950",
    green: "bg-green-600 text-white",
    blue: "bg-blue-600 text-white",
    red: "bg-red-600 text-white",
    yellow: "bg-yellow-400 text-neutral-950",
};

export const CustomButton: React.FC<CustomButtonProps> = ({
    label,
    icon,
    onClick,
    color = "white",
    className = "",
    disabled = false,
}) => (
    <button
        className={`inline-flex h-12 items-center flex gap-2 justify-center rounded-md px-6 font-medium transition active:scale-110 shadow-sm cursor-pointer ${colorClasses[color]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ` + className}
        onClick={onClick}
        disabled={disabled}
    >
        {icon && <span>{icon}</span>}
        {label && <span>{label}</span>}
    </button>
);