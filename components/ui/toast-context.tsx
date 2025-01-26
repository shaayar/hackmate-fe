import React, { createContext, useContext, useState } from "react";

interface ToastContextType {
  addToast: (toast: { title: string; description: string; variant?: string }) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<any[]>([]);

  const addToast = (toast: { title: string; description: string; variant?: string }) => {
    setToasts((prev) => [...prev, toast]);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Render toasts here */}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
