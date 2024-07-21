"use client"
import React, { useState } from "react";
import {Container, Box, Typography, FormControl, Grid, FormControlLabel, FormLabel, Radio, RadioGroup, Fab, styled, Stack, Autocomplete, TextField} from "@mui/material"
import Navbar from "@/components/Navbar";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigatePrevIcon from "@mui/icons-material/NavigateBefore";
type Props =  {
	params: {
		slug: string
	}	
}

const QuestionBoxNavigation = styled(Box)(({ theme }) => ({
	my: 3, 
	gap: 2, 
	position: "fixed",
	left:0,
	right: 0,
	height: '70px',
	zIndex: 1001,
	marginLeft: 'auto',
	marginRight: 'auto',
}))

const QuestionBoxAnswer = styled(Box)(({ theme })=> ({
	marginTop: 20,
	paddingTop: 5,
	padding: 10,
	borderRadius: 10,
	border: "1px solid"
}))

export default function ExamPage({params}: Props){
	const [question, setQuestion] = useState(1);
	const onNextQuestion = () => {
		console.log("on next question")
		setQuestion(question + 1);

	}

	const onPrevQuestion = () => {
		console.log("on next question")
		setQuestion(question - 1);

	}
	function handleClick(){
		console.log("handle click");
		console.log(question);
	}
	return (
		<>
		<Box>
			<Navbar/>
		</Box>

		<div className="container mx-auto">

			<Box sx={{marginLeft: 14, marginRight:14}}>
				<Box>
					<span>{question}.</span>
					
					<Typography>
						In hac habitasse platea dictumst. Donec erat erat, luctus tempus interdum sed, ultricies sed purus. Nullam varius sem in odio finibus, at elementum nunc luctus. Donec vitae dolor diam. Sed mollis dolor nisl, et lacinia dolor mattis at. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aenean pellentesque nisi vitae libero aliquet consectetur. Aliquam erat volutpat. Fusce a tincidunt neque. Nunc dignissim augue tortor, eu sagittis massa pulvinar ac. Sed scelerisque fermentum enim, auctor faucibus metus feugiat ut. Maecenas ullamcorper interdum dictum. Nam et sapien tempus, bibendum elit id, porttitor dolor. Nam tristique, velit ac consectetur malesuada, lacus orci hendrerit purus, id mattis arcu sem faucibus justo. Vestibulum nec hendrerit turpis. Quisque lorem nulla, convallis tincidunt tellus sit amet, eleifend vulputate tortor.
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta, nihil obcaecati non tenetur hic explicabo voluptate possimus! Tempore, quo ad. Nihil at cum, natus quia iusto perferendis quibusdam aut reprehenderit voluptates, praesentium eius dolores dolore corrupti id doloremque mollitia pariatur a autem velit.
					</Typography>
				</Box>
				<QuestionBoxAnswer>
					<FormControl>
					<FormLabel id="demo-radio-buttons-group-label">Jawaban</FormLabel>
						<RadioGroup
							aria-labelledby="demo-radio-buttons-group-label"
							defaultValue="female"
							name="radio-buttons-group"
						>
							<FormControlLabel value="female" control={<Radio />} label="Female" />
							<FormControlLabel value="male" control={<Radio />} label="Male" />
							<FormControlLabel value="other" control={<Radio />} label="Other" />
						</RadioGroup>
					</FormControl>
				</QuestionBoxAnswer>
				

			</Box>


		<QuestionBoxNavigation>
			<Grid container className="px-5">

			<Grid item md={4}>

				<Fab size="small" color="secondary" aria-label="prev" onClick={onPrevQuestion}>
					<NavigatePrevIcon />
				</Fab>
			</Grid>
			<Grid item md={4} className="flex justify-center">

			<Autocomplete
				disablePortal
				id="question-combo"
				options={[]}
				sx={{ width: 300 }}
				renderInput={(params) => <TextField {...params} label="Question" />}
			/>
			</Grid>
			<Grid item md={4} className="flex items-center justify-end">
			<Fab size="small" color="secondary" aria-label="next" onClick={onNextQuestion}>
				<NavigateNextIcon />
			</Fab>
			</Grid>
			</Grid>
		</QuestionBoxNavigation>
		</div>
	

		</>
	)

}