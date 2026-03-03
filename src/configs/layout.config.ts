// ─── layout.config.ts ────────────────────────────────────────────────────────
import type { TemplateKey } from '@/types/layout';

export interface LayoutConfig {
  defaultTemplate: TemplateKey;
  sidebarWidth: number;
  sidebarCollapsedWidth: number;
  appBarHeight: number;
  persistKey: string;
}

/**
 * Global layout configuration.
 * Change `defaultTemplate` here to switch the default layout without
 * touching any other file. Add new TemplateKey values to the union type
 * in layout.types.ts, then register the component in layout.registry.ts.
 */
export const LAYOUT_CONFIG: LayoutConfig = {
  defaultTemplate: 'splitpanel',   // ← change this to switch default template
  sidebarWidth: 256,
  sidebarCollapsedWidth: 68,
  appBarHeight: 64,
  persistKey: 'nexus-layout-v1',  // localStorage key for zustand persist
};
