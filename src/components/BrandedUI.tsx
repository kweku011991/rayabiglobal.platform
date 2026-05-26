import * as React from "react";

// --- Toast System ---
type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = 
    type === "success" ? "bg-[#1b2b1b]" : 
    type === "error" ? "bg-red-600" : 
    "bg-blue-600";

  const textColor = type === "success" ? "text-[#9caf9c]" : "text-white";

  return (
    <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 ${bgColor} ${textColor} px-8 py-4 rounded-full shadow-2xl z-[200] flex items-center gap-4 animate-bounce-in border border-white/10`}>
      {type === "success" && <span className="text-lg">✅</span>}
      {type === "error" && <span className="text-lg">⚠️</span>}
      <p className="font-black uppercase text-[10px] tracking-[0.2em] whitespace-nowrap">{message}</p>
      <button onClick={onClose} className="hover:opacity-50 font-black">&times;</button>
    </div>
  );
}

// --- Confirmation Modal ---
interface ConfirmModalProps {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ConfirmModal({ title, message, confirmLabel, onConfirm, onCancel, isLoading }: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-[#1b2b1b]/90 backdrop-blur-md flex items-center justify-center p-6 z-[150]">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-scale-in">
        <div className="bg-[#1b2b1b] p-8 text-center border-b border-white/5">
           <div className="w-16 h-16 bg-[#9caf9c]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#9caf9c]/20">
              <span className="text-2xl text-[#9caf9c]">?</span>
           </div>
           <h3 className="text-white font-black uppercase tracking-widest text-sm">{title}</h3>
        </div>
        <div className="p-10 space-y-8">
          <p className="text-[#1b2b1b]/70 font-medium text-center leading-relaxed text-sm">
            {message}
          </p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={onConfirm}
              disabled={isLoading}
              className="w-full bg-[#1b2b1b] text-white py-4 rounded-sm font-black text-[10px] uppercase tracking-[0.3em] hover:bg-[#9caf9c] transition-all disabled:opacity-50"
            >
              {isLoading ? "Processing Protocol..." : confirmLabel}
            </button>
            <button 
              onClick={onCancel}
              disabled={isLoading}
              className="w-full bg-white text-[#1b2b1b] py-4 rounded-sm font-black text-[10px] uppercase tracking-[0.3em] border border-[#1b2b1b]/10 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
