"use client";

import { ReactNode, useCallback, useState } from "react";
import { useLayoutStore } from "@/stores/layout-store";
import { LAYOUT_REGISTRY } from "./registry";
import { LAYOUT_CONFIG } from "@/configs/layout.config";
import { TemplateSwitcher } from "../ui/template-switcher";
import SearchDialog from "@/components/common/search-dialog";
import { useSearchShortcut } from "@/hooks/use-search-shortcut";

export const LayoutWrapper = ({ children }: { children: ReactNode }) => {
  const activeTemplate = useLayoutStore((s) => s.activeTemplate);
  const Template = LAYOUT_REGISTRY[activeTemplate] ?? LAYOUT_REGISTRY[LAYOUT_CONFIG.defaultTemplate];
  const [searchOpen, setSearchOpen] = useState(false);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useSearchShortcut(openSearch);

  return (
    <>
      <Template>{children}</Template>
      <TemplateSwitcher />
      <SearchDialog open={searchOpen} onClose={closeSearch} />
    </>
  );
};