"use client";
import { useEffect, useState } from "react";
import AIButton from "./AIButton";
import dynamic from "next/dynamic";
const ChatWindow = dynamic(() => import("./ChatWindow"), { ssr: false });
export default function Assistant() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener("harsha:open-assistant", show);
    return () => window.removeEventListener("harsha:open-assistant", show);
  }, []);
  return (
    <>
      <AIButton open={open} onClick={() => setOpen(true)} />
      {open && <ChatWindow onClose={() => setOpen(false)} />}
    </>
  );
}
