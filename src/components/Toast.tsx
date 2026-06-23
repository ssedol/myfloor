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
    <div className="fixed bottom-8 left-4 right-4 z-50 pointer-events-none max-w-md mx-auto">
      <div className="bg-app-bg border border-divider text-main text-sm font-medium px-5 py-4 rounded-2xl shadow-md">
        {message}
      </div>
    </div>
  );
}
