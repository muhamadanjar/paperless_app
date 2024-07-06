
import type { ReactNode } from 'react'

export type Layout = 'vertical' | 'collapsed' | 'horizontal'

export type Skin = 'default' | 'bordered'

export type Mode = 'system' | 'light' | 'dark'

export type SystemMode = 'light' | 'dark'

export type LayoutComponentWidth = 'compact' | 'wide'

export type LayoutComponentPosition = 'fixed' | 'static'

export type ChildrenType = {
	children: ReactNode
}