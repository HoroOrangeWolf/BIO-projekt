import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  TextField, Button, Typography, Container, Box,
} from '@mui/material';
import QRCode from 'qrcode.react';
import { useTranslation } from 'react-i18next';
import { confirmTOTP, setupTOTP } from '../services/api.ts';
import { setupTOTPSchema } from '../validations/authSchemas.ts';

const SetupTOTP = () => {
  const [qrCode, setQrCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(setupTOTPSchema),
  });
  const { t } = useTranslation(['core']);

  useEffect(() => {
    const fetchTOTPSetup = async () => {
      try {
        const response = await setupTOTP();
        setQrCode(response.data.config_url);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError(t('otp.failed'));
      }
    };
    fetchTOTPSetup();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      await confirmTOTP(data.token);
      setSuccess(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError(t('otp.invalid_token'));
    }
  };

  if (success) {
    return (
      <Container component="main" maxWidth="xs">
        <Box sx={{
          mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}
        >
          <Typography component="h1" variant="h5">
            {t('otp.complete')}
          </Typography>
          <Typography>
            {t('otp.success')}
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{
        mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}
      >
        <Typography component="h1" variant="h5">
          {t('otp.2fa_setup')}
        </Typography>
        {qrCode && (
          <Box sx={{ mt: 2, mb: 2 }}>
            <QRCode value={qrCode} size={256} />
          </Box>
        )}
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="token"
            label={t('otp.token')}
            autoFocus
            {...register('token')}
            error={!!errors.token}
            helperText={errors.token?.message}
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
            {t('otp.verify_token')}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default SetupTOTP;
