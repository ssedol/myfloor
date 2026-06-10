"use client";

import { useEffect } from "react";

interface Props {
  message: string;
  onDismiss: () => void;
}

export default function Toast({ message, onDismiss }: Props) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <div className="bg-main text-white text-sm font-medium px-5 py-3 rounded-2xl shadow-lg text-center max-w-xs">
        {message}
      </div>
    </div>
  );
}
