"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export function Modal({
  title,
  children,
  onClose,
  className = "",
  delay = 0,
  overlay,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  className?: string;
  delay?: number;
  overlay?: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const headingId = useId();
  useEffect(() => {
    const node = dialog.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const timer = window.setTimeout(() => {
      node?.showModal();
      document.body.style.overflow = "hidden";
    }, delay);
    return () => {
      window.clearTimeout(timer);
      node?.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [delay]);
  return (
    <dialog
      ref={dialog}
      className={`game-dialog ${className}`}
      aria-labelledby={headingId}
      onCancel={onClose}
    >
      {overlay}
      <motion.div
        className="modal-content"
        initial={{ opacity: 0, y: 18, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25, delay: delay / 1000 }}
      >
        <button className="dialog-close icon-button" aria-label="Close dialog" onClick={onClose}>
          <X size={19} aria-hidden="true" />
        </button>
        <h2 id={headingId}>{title}</h2>
        {children}
      </motion.div>
    </dialog>
  );
}
