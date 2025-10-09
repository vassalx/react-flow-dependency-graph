import React from "react";

interface CustomButtonProps {
  label?: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  color?: "black" | "white" | "green" | "blue" | "red" | "yellow";
  className?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  round?: boolean;
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
  size = "lg",
  round = false,
}) => (
  <button
    className={
      `inline-flex h-${
        size === "lg" ? 12 : size === "md" ? 10 : 8
      } items-center flex gap-2 justify-center rounded-${
        round ? "full" : "md"
      } px-${
        size === "lg" ? 6 : size === "md" ? 3 : 0
      } font-medium transition active:scale-110 shadow-sm cursor-pointer ${
        colorClasses[color]
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ` + className
    }
    onClick={onClick}
    disabled={disabled}
  >
    {icon && <span>{icon}</span>}
    {label && <span>{label}</span>}
  </button>
);
