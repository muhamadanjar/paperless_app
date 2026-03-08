import Grid from '@mui/material/Grid';
import FormExam from './page.view';

export default function ExamPage() {
	return (<>
	<Grid container spacing={6}>
		<Grid item xs={12}>
			<FormExam/>
		</Grid>
	</Grid>
	</>)
}
