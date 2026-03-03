// ─── layout.store.ts ─────────────────────────────────────────────────────────
import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { LayoutStore, LayoutState } from '@/types/layout';
import { LAYOUT_CONFIG } from '@/configs/layout.config';

// ─── Initial State (separated for easy reset) ─────────────────────────────────

const INITIAL_STATE: LayoutState = {
  activeTemplate: LAYOUT_CONFIG.defaultTemplate,
  darkMode: true,
  sidebarCollapsed: false,
  mobileOpen: false,
  pageTitle: 'Overview',
  activeNav: 'Overview',
  notifications: 5,
  breadcrumbs: [],
};

// ─── Persisted keys (only these survive page reload) ─────────────────────────
// Keeping UI preferences like darkMode, template, sidebarCollapsed persistent.
// Transient UI state like mobileOpen is excluded.

const PERSISTED_KEYS: Array<keyof LayoutState> = [
  'activeTemplate',
  'darkMode',
  'sidebarCollapsed',
];

// ─── Store ────────────────────────────────────────────────────────────────────

export const useLayoutStore = create<LayoutStore>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set, get) => ({
          // ── State ──────────────────────────────────────────────────────────
          ...INITIAL_STATE,

          // ── Actions ────────────────────────────────────────────────────────

          setTemplate: (template) =>
            set((state) => {
              state.activeTemplate = template;
            }, false, 'layout/setTemplate'),

          toggleDark: () =>
            set((state) => {
              state.darkMode = !state.darkMode;
            }, false, 'layout/toggleDark'),

          setDarkMode: (val) =>
            set((state) => {
              state.darkMode = val;
            }, false, 'layout/setDarkMode'),

          toggleCollapse: () =>
            set((state) => {
              state.sidebarCollapsed = !state.sidebarCollapsed;
            }, false, 'layout/toggleCollapse'),

          toggleMobile: () =>
            set((state) => {
              state.mobileOpen = !state.mobileOpen;
            }, false, 'layout/toggleMobile'),

          setNav: (nav, title) =>
            set((state) => {
              state.activeNav = nav;
              state.pageTitle = title ?? nav;
            }, false, 'layout/setNav'),

          setPageTitle: (title) =>
            set((state) => {
              state.pageTitle = title;
            }, false, 'layout/setPageTitle'),

          setBreadcrumbs: (crumbs) =>
            set((state) => {
              state.breadcrumbs = crumbs;
            }, false, 'layout/setBreadcrumbs'),

          setNotifications: (count) =>
            set((state) => {
              state.notifications = count;
            }, false, 'layout/setNotifications'),

          reset: () =>
            set(() => ({ ...INITIAL_STATE }), false, 'layout/reset'),
        })),
      ),
      {
        name: LAYOUT_CONFIG.persistKey,
        // Only persist user preferences — not transient UI state
        partialize: (state) =>
          PERSISTED_KEYS.reduce(
            (acc, key) => ({ ...acc, [key]: state[key] }),
            {} as Partial<LayoutState>,
          ),
      },
    ),
    {
      name: 'LayoutStore',
      // Disable devtools in production
      enabled: process.env.NODE_ENV !== 'production',
    },
  ),
);

// ─── Selectors (memoized, avoids unnecessary re-renders) ──────────────────────

export const selectTemplate = (s: LayoutStore) => s.activeTemplate;
export const selectDarkMode = (s: LayoutStore) => s.darkMode;
export const selectSidebarCollapsed = (s: LayoutStore) => s.sidebarCollapsed;
export const selectMobileOpen = (s: LayoutStore) => s.mobileOpen;
export const selectPageTitle = (s: LayoutStore) => s.pageTitle;
export const selectActiveNav = (s: LayoutStore) => s.activeNav;
export const selectNotifications = (s: LayoutStore) => s.notifications;
export const selectBreadcrumbs = (s: LayoutStore) => s.breadcrumbs;

// ─── Subscribe outside React (e.g. analytics, logging) ───────────────────────
// Example:
//   useLayoutStore.subscribe(selectTemplate, (template) => {
//     analytics.track('template_switch', { template });
//   });
