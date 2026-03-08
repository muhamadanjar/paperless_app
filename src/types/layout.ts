export type TemplateKey = 'dashboard' | 'minimal' | 'splitpanel' ;

export type ThemeMode = 'light' | 'dark';

export interface Breadcrumb {
  label: string;
  href?: string;
}

// ─── Store State ──────────────────────────────────────────────────────────────

export interface LayoutState {
  activeTemplate: TemplateKey;
  darkMode: boolean;
  sidebarCollapsed: boolean;
  mobileOpen: boolean;
  pageTitle: string;
  activeNav: string;
  notifications: number;
  breadcrumbs: Breadcrumb[];
}

// ─── Store Actions ────────────────────────────────────────────────────────────

export interface LayoutActions {
  setTemplate: (template: TemplateKey) => void;
  toggleDark: () => void;
  setDarkMode: (val: boolean) => void;
  toggleCollapse: () => void;
  toggleMobile: () => void;
  setNav: (nav: string, title?: string) => void;
  setPageTitle: (title: string) => void;
  setBreadcrumbs: (crumbs: Breadcrumb[]) => void;
  setNotifications: (count: number) => void;
  reset: () => void;
}

export type LayoutStore = LayoutState & LayoutActions;

// ─── Template component contract ─────────────────────────────────────────────

export interface TemplateProps {
  children: React.ReactNode;
}

export type TemplateComponent = React.FC<TemplateProps>;
