import type { TemplateKey, TemplateComponent } from '@/types/layout';
import { DashboardTemplate } from "./templates/dashboard-layout";
import { MinimalTemplate } from "./templates/minimal-layout";
import { SplitPanelTemplate } from "./templates/split-layout";

export const LAYOUT_REGISTRY: Record<TemplateKey, TemplateComponent> = {
  dashboard: DashboardTemplate,
  minimal: MinimalTemplate,
  splitpanel: SplitPanelTemplate,
};