import type { TemplateKey, TemplateComponent } from '@/types/layout';
import { DashboardTemplate } from "./dashboard-layout";
import { MinimalTemplate } from "./minimal-layout";
import { SplitPanelTemplate } from "./split-layout";

export const LAYOUT_REGISTRY: Record<TemplateKey, TemplateComponent> = {
  dashboard: DashboardTemplate,
  minimal: MinimalTemplate,
  splitpanel: SplitPanelTemplate,
};