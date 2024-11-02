import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import {
  TextField, Button, Typography, Container, Box, Paper,
} from '@mui/material';
import { registerUser } from '@main/components/services/api.ts';
import { registerSchema } from '@main/components/validations/authSchemas.ts';

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<any>('');
  const { register, handleSubmit, formState: { errors } } = useForm<{
    email: string;
    password: string;
    username: string;
    confirmPassword: string;
    first_name: string;
    last_name: string;
    pesel: string;
  }>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      await registerUser(data);
      navigate('/login');
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      setError(err?.response?.data?.detail || 'An error occurred');
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
            Register
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Nazwa użytkownika"
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
              id="firstName"
              label="First name"
              autoComplete="firstName"
              autoFocus
              {...register('first_name')}
              error={!!errors.first_name}
              helperText={errors.first_name?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="lastName"
              label="Last name"
              autoComplete="lastName"
              autoFocus
              {...register('last_name')}
              error={!!errors.last_name}
              helperText={errors.last_name?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="pesel"
              label="Pesel"
              autoFocus
              {...register('pesel')}
              error={!!errors.pesel}
              helperText={errors.pesel?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              autoComplete="email"
              {...register('email')}
              error={!!errors.email as any}
              helperText={errors.email?.message as any}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Confirm password"
              type="password"
              id="password"
              autoComplete="new-password"
              {...register('confirmPassword')}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
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
              Zarejestruj się
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Register;
