"use client";

import { ReactNode } from "react";
import { useLayoutStore } from "@/stores/layout-store";
import { buildTheme } from "../ui/theme-registry/theme";
import { LAYOUT_REGISTRY } from "./registry";
import { LAYOUT_CONFIG } from "@/configs/layout.config";
import ThemeRegistry from "../ui/theme-registry";
import { TemplateSwitcher } from "../ui/template-switcher";

export const LayoutWrapper = ({ children }: { children: ReactNode }) => {
  const activeTemplate = useLayoutStore((s) => s.activeTemplate);
  const darkMode = useLayoutStore((s) => s.darkMode);
  const theme = buildTheme(darkMode);
  const Template = LAYOUT_REGISTRY[activeTemplate] ?? LAYOUT_REGISTRY[LAYOUT_CONFIG.defaultTemplate];

  return (
    <ThemeRegistry>
      <Template theme={theme}>{children}</Template>
      <TemplateSwitcher />
    </ThemeRegistry>
  );
};