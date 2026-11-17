import type { ComponentPropsWithoutRef } from "react";

export function GlassPanel({ className = "", ...props }: ComponentPropsWithoutRef<"section">) {
  return <section className={`glass-container ${className}`} {...props} />;
}
