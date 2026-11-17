"use client";

import { Modal } from "@/components/ui/modal";

export function ConfirmDialog({
  title,
  description,
  confirmLabel,
  onConfirm,
  onClose,
}: {
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Modal title={title} onClose={onClose}>
      <p className="modal-description">{description}</p>
      <div className="dialog-actions">
        <button autoFocus className="secondary-button" onClick={onClose}>
          Cancel
        </button>
        <button className="primary-button" onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
