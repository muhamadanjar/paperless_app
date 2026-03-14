"use client";

import { ReactNode } from "react";
import { useLayoutStore } from "@/stores/layout-store";
import { LAYOUT_REGISTRY } from "./registry";
import { LAYOUT_CONFIG } from "@/configs/layout.config";
import { TemplateSwitcher } from "../ui/template-switcher";

export const LayoutWrapper = ({ children }: { children: ReactNode }) => {
  const activeTemplate = useLayoutStore((s) => s.activeTemplate);
  const Template = LAYOUT_REGISTRY[activeTemplate] ?? LAYOUT_REGISTRY[LAYOUT_CONFIG.defaultTemplate];

  return (
    <>
      <Template>{children}</Template>
      <TemplateSwitcher />
    </>
  );
};