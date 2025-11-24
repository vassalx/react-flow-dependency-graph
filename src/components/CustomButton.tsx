import React from "react";

interface CustomButtonProps {
  label?: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  color?: "black" | "white" | "green" | "blue" | "red" | "yellow";
  className?: string;
  disabled?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  round?: "md" | "full";
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
  round = "md",
}) => {
  const heightMap = {
    xs: "h-6",
    sm: "h-8",
    md: "h-10",
    lg: "h-12",
  };

  const roundedMap = {
    md: "rounded-md",
    full: "rounded-full",
  };

  const paddingMap = {
    xs: "w-6",
    sm: "px-2",
    md: "px-4",
    lg: "px-6",
  };
  return (
    <button
      className={
        `inline-flex ${heightMap[size]} items-center flex gap-2 justify-center ${roundedMap[round]} ${paddingMap[size]} font-medium transition active:scale-110 shadow-sm cursor-pointer ${
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
