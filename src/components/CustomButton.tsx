import React, { useMemo } from "react";

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
}) => {
  const getHeight = () => {
    if (size === "lg") {
      return 12;
    }
    if (size === "md") {
      return 10;
    }
    return 8;
  };
  const getRounded = () => {
    if (round) {
      return "full";
    }
    return "md";
  };
  const getHorizontalPadding = () => {
    if (size === "lg") {
      return 6;
    }
    if (size === "md") {
      return 4;
    }
    return 0;
  };
  const height = useMemo(() => getHeight(), [size]);
  const rounded = useMemo(() => getRounded(), [round]);
  const horizontalPadding = useMemo(() => getHorizontalPadding(), [size]);
  return (
    <button
      className={
        `inline-flex h-${height} items-center flex gap-2 justify-center rounded-${rounded} px-${horizontalPadding} font-medium transition active:scale-110 shadow-sm cursor-pointer ${
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
};
