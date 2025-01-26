import React, { createContext, useContext, useState, useRef, ReactNode } from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cn } from "@/lib/utils";
import { X, CheckCircle2 } from "lucide-react";

// Toast Variants
type ToastProps = {
  variant?: "default" | "destructive" | "success";
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  closeButton?: boolean;
} & React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root>;

// Variant Styles
const variantStyles: Record<"default" | "destructive" | "success", string> = {
  default: "border bg-background text-foreground",
  destructive:
    "destructive group border-destructive bg-destructive text-destructive-foreground",
  success: "border-green-600 bg-green-50 text-green-900",
};

// Toast Component
const Toast = ({
  variant = "default",
  title,
  description,
  children,
  className,
  closeButton,
  ...props
}: ToastProps) => {
  const ref = useRef<HTMLLIElement>(null);

  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
        "data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out",
        "data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {variant === "success" && (
        <CheckCircle2 className="h-5 w-5 text-green-600" />
      )}
      <div className="grid gap-1">
        {title && <div className="font-bold">{title}</div>}
        {description && <div className="text-sm">{description}</div>}
        {children}
      </div>
      {closeButton && (
        <ToastPrimitives.Close
          className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600"
          toast-close=""
        >
          <X className="h-4 w-4" />
        </ToastPrimitives.Close>
      )}
    </ToastPrimitives.Root>
  );
};

// Toast Context
const ToastContext = createContext<any>(null);

// Toast Provider
export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<any[]>([]);

  const addToast = (toast: ToastProps) => {
    setToasts((current) => [...current, { ...toast, id: Date.now() }]);
  };

  const removeToast = (id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      <ToastPrimitives.Provider swipeDirection="right">
        {children}
        <ToastPrimitives.Viewport className="fixed bottom-4 right-4 flex w-full max-w-sm flex-col gap-4 p-4">
          {toasts.map(({ id, ...props }) => (
            <Toast
              key={id}
              {...props}
              onOpenChange={(open) => !open && removeToast(id)}
            />
          ))}
        </ToastPrimitives.Viewport>
      </ToastPrimitives.Provider>
    </ToastContext.Provider>
  );
};

// useToast Hook
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export default Toast;
