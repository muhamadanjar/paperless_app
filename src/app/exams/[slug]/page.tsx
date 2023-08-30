"use client"
import React from "react";
import {Container, Box, Typography, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Fab, styled, Stack} from "@mui/material"
import Navbar from "@/components/Navbar";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigatePrevIcon from "@mui/icons-material/NavigateBefore";
type Props =  {
	params: {
		slug: string
	}	
}

export default function ExamPage({params}: Props){
	return (
		<>
		<Box>
			<Navbar/>
		</Box>

		<Box sx={{margin: 5}}>
			<Box>
				<Typography>

					In hac habitasse platea dictumst. Donec erat erat, luctus tempus interdum sed, ultricies sed purus. Nullam varius sem in odio finibus, at elementum nunc luctus. Donec vitae dolor diam. Sed mollis dolor nisl, et lacinia dolor mattis at. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aenean pellentesque nisi vitae libero aliquet consectetur. Aliquam erat volutpat. Fusce a tincidunt neque. Nunc dignissim augue tortor, eu sagittis massa pulvinar ac. Sed scelerisque fermentum enim, auctor faucibus metus feugiat ut. Maecenas ullamcorper interdum dictum. Nam et sapien tempus, bibendum elit id, porttitor dolor. Nam tristique, velit ac consectetur malesuada, lacus orci hendrerit purus, id mattis arcu sem faucibus justo. Vestibulum nec hendrerit turpis. Quisque lorem nulla, convallis tincidunt tellus sit amet, eleifend vulputate tortor.
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta, nihil obcaecati non tenetur hic explicabo voluptate possimus! Tempore, quo ad. Nihil at cum, natus quia iusto perferendis quibusdam aut reprehenderit voluptates, praesentium eius dolores dolore corrupti id doloremque mollitia pariatur a autem velit.
				</Typography>
			</Box>
			<Box pt={5}>
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
			</Box>

			<Stack sx={{my: 3, gap: 2, display: "flex", alignItems: "flex-end", justifyContent: "flex-end"}}>
				<Fab size="small" color="secondary" aria-label="prev">
					<NavigatePrevIcon />
				</Fab>
				<Fab size="small" color="secondary" aria-label="next">
					<NavigateNextIcon />
				</Fab>
			</Stack>
			

		</Box>

		</>
	)

}