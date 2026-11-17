"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export function ConfirmDialog({ title, description, confirmLabel, onConfirm, onClose }: {
  title: string; description: string; confirmLabel: string; onConfirm: () => void; onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const node = dialog.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    node?.showModal();
    return () => { node?.close(); previousFocus?.focus(); };
  }, []);
  return (
    <dialog ref={dialog} className="confirm-dialog" aria-labelledby="dialog-title" aria-describedby="dialog-description" onCancel={onClose}>
      <button className="dialog-close" aria-label="Close dialog" onClick={onClose}><X size={20} /></button>
      <h2 id="dialog-title">{title}</h2><p id="dialog-description">{description}</p>
      <div className="dialog-actions"><button autoFocus className="secondary-button" onClick={onClose}>Keep playing</button><button className="primary-button" onClick={onConfirm}>{confirmLabel}</button></div>
    </dialog>
  );
}
