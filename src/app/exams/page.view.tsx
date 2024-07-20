"use client"

import { useState } from "react";

import Link from "next/link";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Autocomplete from "@mui/material/Autocomplete";


type FormData = {
  fullName: string;
  phone: string;
  address: string;
  zipCode: string;
  landmark: string;
  city: string;
  country: string;
  addressType: string;
  number: string;
  name: string;
  expiry: string;
  cvv: string;
};

const FormExams = () => {
	const [isPasswordShown, setIsPasswordShown] = useState(false);
  	const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false);
  	const handleClickShowPassword = () => setIsPasswordShown((show) => !show);
  	const handleClickShowConfirmPassword = () => setIsConfirmPasswordShown((show) => !show);

	const [cardData, setCardData] = useState<FormData>({
    fullName: "",
    phone: "",
    address: "",
    zipCode: "",
    landmark: "",
    city: "",
    country: "",
    addressType: "home",
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
	return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center bs-[500px]">
        <form onSubmit={(e) => e.preventDefault()}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <TextField fullWidth label="Name" placeholder="John Doe" />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="email"
                label="Email"
                placeholder="johndoe@gmail.com"
                helperText="You can use letters, numbers & periods"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Country</InputLabel>
                <Select
                  label="Country"
                  value={cardData.country}
                  onChange={(e) =>
                    setCardData({ ...cardData, country: e.target.value })
                  }
                >
                  <MenuItem value="UK">UK</MenuItem>
                  <MenuItem value="USA">USA</MenuItem>
                  <MenuItem value="Australia">Australia</MenuItem>
                  <MenuItem value="Germany">Germany</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm Password"
                placeholder="············"
                id="form-layout-basic-confirm-password"
                type={isConfirmPasswordShown ? "text" : "password"}
                helperText="Make sure to type the same password as above"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        edge="end"
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={(e) => e.preventDefault()}
                        aria-label="toggle confirm password visibility"
                      >
                        <i
                          className={
                            isConfirmPasswordShown
                              ? "ri-eye-off-line"
                              : "ri-eye-line"
                          }
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <div className="flex items-center justify-between flex-wrap gap-5">
                <Button variant="contained" type="submit">
                  Get Started!
                </Button>
                <div className="flex items-center justify-center gap-2">
                  <Typography color="text.primary">
                    Already have an account?
                  </Typography>
                  <Link
                    href="/"
                    onClick={(e) => e.preventDefault()}
                    className="text-primary"
                  >
                    Log In
                  </Link>
                </div>
              </div>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
}


export default FormExams;
