'use client';

import { Button, Checkbox, FormControlLabel, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { useActionState, useState } from "react";
import Link from "next/link";
import { authenticate } from "@/libs/actions/auth";


export default function LoginForm() {
    const [isPasswordShown, setIsPasswordShown] = useState(false)

    const handleClickShowPassword = () => {
        setIsPasswordShown(!isPasswordShown)
    }

    const [errorMessage, formAction, isPending] = useActionState(
        authenticate,
        undefined,
    );

    
    return (
        <form noValidate autoComplete='off' action={formAction} className='flex flex-col gap-5'>
            <TextField autoFocus fullWidth id='email' name='email' label='Email' sx={{ mb: 4 }} />
           
            <TextField
                fullWidth
                label='Password'
                name='password'
                id='outlined-adornment-password'
                type={isPasswordShown ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        size='small'
                        edge='end'
                        onClick={handleClickShowPassword}
                        onMouseDown={e => e.preventDefault()}
                      >
                        <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
            />
            <div className='flex justify-between items-center gap-x-3 gap-y-1 flex-wrap'>
                <FormControlLabel control={<Checkbox />} label='Remember me' />
                <Typography
                  className='text-end'
                  color='primary'
                  component={Link}
                  href={'/auth/forgot-password'}
                >
                  Forgot password?
                </Typography>
            </div>

            {errorMessage && (
                <Typography color='error' variant='body2'>
                    {errorMessage}
                </Typography>
            )}

            <Button fullWidth variant='contained' type='submit' disabled={isPending}>
                {isPending ? 'Please wait...' : 'Sign In'}
            </Button>

          </form>
    );
}