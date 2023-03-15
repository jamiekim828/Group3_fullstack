import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
// MUI
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import TextField from '@mui/material/TextField';
import { Button, InputAdornment, Typography } from '@material-ui/core';
import ForwardIcon from '@mui/icons-material/Forward';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
// module
import './LogIn.css';
import { LoginUserType } from '../../types/usertype';
import { AppDispatch } from '../../redux/store';
import { loginUserThunk } from '../../redux/thunk/user';

const LogInSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/,
      'Password should contain uppercase letter, lowercase letter and number'
    ),
});

export default function LogIn() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);

  const loginHandler = (user: LoginUserType) => {
    if (!user) {
      return;
    }
    if (user) {
      dispatch(loginUserThunk(user))
      navigate('/')
    }
  };

  return (
    <div className='login-div'>
      <Card sx={{ width: 500, textAlign: 'center' }}>
        <CardHeader
          title='Welcome to <LibraryName>'
          sx={{ borderBottom: '1px solid black' }}
        />
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '2rem',
          }}
        >
          <Typography>Log In or Register</Typography>

          <div className='login-form'>
            <Formik
              initialValues={{
                email: '',
                password: '',
              }}
              validationSchema={LogInSchema}
              onSubmit={(values: LoginUserType) => {
                loginHandler(values);
              }}
            >
              {({ errors, touched, handleChange }) => (
                <Form className='login'>
                  <TextField
                    sx={{ width: '70%' }}
                    id='outlined-basic'
                    label='E-mail'
                    type='text'
                    name='email'
                    variant='standard'
                    onChange={handleChange}
                  />
                  {errors.email && touched.email ? (
                    <p className='input-error'>*{errors.email}</p>
                  ) : null}
                  <TextField
                    sx={{ width: '70%' }}
                    id='outlined-basic'
                    label='Password'
                    type={passwordVisibility ? 'text' : 'password'}
                    name='password'
                    variant='standard'
                    onChange={handleChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          {passwordVisibility ? (
                            <VisibilityIcon
                              onClick={() => setPasswordVisibility(false)}
                            />
                          ) : (
                            <VisibilityOffIcon
                              onClick={() => setPasswordVisibility(true)}
                            />
                          )}
                        </InputAdornment>
                      ),
                    }}
                  />
                  {errors.password && touched.password ? (
                    <p className='input-error'>*{errors.password}</p>
                  ) : null}
                  <Button
                    type='submit'
                    style={{
                      maxWidth: 300,
                      maxHeight: 50,
                      minWidth: 250,
                      minHeight: 50,
                    }}
                  >
                    LOG IN
                  </Button>
                </Form>
              )}
            </Formik>
          </div>

          <div
            style={{
              marginTop: '1rem',
              width: '50%',
              borderTop: '1px solid black',
            }}
          >
            <br />
            <Typography>If you don't have an account.</Typography>
          </div>
          <Link to='/register' style={{ textDecoration: 'none' }}>
            <Button
              style={{
                maxWidth: 300,
                maxHeight: 50,
                minWidth: 250,
                minHeight: 50,
                marginTop: '1rem',
              }}
            >
              <ForwardIcon />
              Register
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
