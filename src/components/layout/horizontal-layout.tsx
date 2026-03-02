import Fab from '@mui/material/Fab'
import AppBar from '@mui/material/AppBar'
import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'
import MuiToolbar, { ToolbarProps } from '@mui/material/Toolbar'

// ** Icon Imports
import Icon from '@/components/icon'
import { LayoutProps } from './types'

const HorizontalLayoutWrapper = styled('div')({
  height: '100%',
  display: 'flex',
//   ...(themeConfig.horizontalMenuAnimation && { overflow: 'clip' })
})

const MainContentWrapper = styled(Box)<BoxProps>({
  flexGrow: 1,
  minWidth: 0,
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column'
})

const ContentWrapper = styled('main')(({ theme }) => ({
  flexGrow: 1,
  width: '100%',
  padding: theme.spacing(6),
  transition: 'padding .25s ease-in-out',
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4)
  }
}))

const HorizontalLayout = (props: LayoutProps) => {
	const {
		hidden,
		children,
		settings,
		scrollToTop,
		footerProps,
		saveSettings,
		contentHeightFixed,
		horizontalLayoutProps
	} = props

	const { skin, appBar, navHidden, appBarBlur, contentWidth } = settings

	return (
		<HorizontalLayoutWrapper className='layout-wrapper'>
			<MainContentWrapper className='layout-content-wrapper' sx={{ ...(contentHeightFixed && { maxHeight: '100vh' }) }}>
				<ContentWrapper
					className='layout-page-content'
					sx={{
						...(contentHeightFixed && { display: 'flex', overflow: 'hidden' }),
						...(contentWidth === 'boxed' && {
						mx: 'auto',
						'@media (min-width:1440px)': { maxWidth: 1440 },
						'@media (min-width:1200px)': { maxWidth: '100%' }
						})
					}}
					>
					{children}
					</ContentWrapper>
			</MainContentWrapper>
		</HorizontalLayoutWrapper>
	)
}

export default HorizontalLayout