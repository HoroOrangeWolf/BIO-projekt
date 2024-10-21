import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Box, Paper } from '@mui/material';
import { login } from "../services/api.js";
import { setUser } from "../features/auth/authSlice.js";
import LockPersonIcon from '@mui/icons-material/LockPerson';
import { useTranslation } from "react-i18next";
import {loginSchema, otpSchema} from "../validations/authSchemas.js";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [otpRequired, setOtpRequired] = useState(false);
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(otpRequired ? otpSchema : loginSchema),
  });
  const { t } = useTranslation(["core"]);

  const onSubmit = async (data) => {
    try {
      const response = await login(data.username, data.password, data.otp);
      dispatch(setUser(response.data));
      navigate('/');
    } catch (err) {
      if (err.response?.data?.detail === "OTP required" && !otpRequired) {
        setOtpRequired(true);
        setError(t("login.validation.otp_required"));
        // Preserve the entered username and password
        setValue('username', data.username);
        setValue('password', data.password);
      } else {
        setError(err.response?.data?.detail || t("login.validation.error"));
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        justifyContent: 'center',
      }}
    >
      <Container component={Paper} maxWidth="xs" sx={{ p: 5 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            {t("login.title")}
          </Typography>
          <LockPersonIcon fontSize="large" color="inherit" />
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label={t("login.username")}
              name="username"
              autoComplete="username"
              autoFocus
              {...register('username')}
              error={!!errors.username}
              helperText={errors.username?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={t("login.password")}
              type="password"
              id="password"
              autoComplete="current-password"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            {otpRequired && (
              <TextField
                margin="normal"
                required
                fullWidth
                name="otp"
                label={t("login.otp")}
                type="text"
                id="otp"
                {...register('otp')}
                error={!!errors.otp}
                helperText={errors.otp?.message}
              />
            )}
            {error && (
              <Typography color="error" align="center">
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {t("login.signIn")}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Login;