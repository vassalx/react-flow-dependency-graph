import React from "react";
import { useLoading } from "../context/LoadingContext";

const LoadingOverlay: React.FC = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  console.log(isLoading);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="h-16 w-16 border-4 border-t-transparent border-white rounded-full animate-spin" />
    </div>
  );
};

export default LoadingOverlay;