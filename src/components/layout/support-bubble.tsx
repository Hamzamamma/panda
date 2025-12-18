"use client";

import { MessageCircle } from "lucide-react";

export function SupportBubble() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button className="w-14 h-14 bg-fwBlack text-white rounded-full shadow-comic hover:shadow-comic-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center border-2 border-fwBlack">
        <MessageCircle className="w-7 h-7" />
      </button>
    </div>
  );
}
