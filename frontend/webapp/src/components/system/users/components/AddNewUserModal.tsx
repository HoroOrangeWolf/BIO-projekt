import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { newUserSchema } from '@main/components/validations/usersSchemas.ts';

type PropsType = {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

export const AddNewUserModal = ({ open, onClose, onSubmit }: PropsType) => {
  const { t } = useTranslation('system');
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(newUserSchema),
    defaultValues: {
      email: '',
      username: '',
      first_name: '',
      last_name: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmitForm = (data: any) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} fullWidth maxWidth="md">
      <DialogTitle textAlign="center">{t('user.actions.add_user')}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <Stack
            sx={{
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem',
            }}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('user.email')}
                  type="email"
                  variant="outlined"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('user.username')}
                  variant="outlined"
                  fullWidth
                  error={!!errors.username}
                  helperText={errors.username?.message}
                />
              )}
            />
            <Controller
              name="first_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('user.first_name')}
                  variant="outlined"
                  fullWidth
                  error={!!errors.first_name}
                  helperText={errors.first_name?.message}
                />
              )}
            />
            <Controller
              name="last_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('user.last_name')}
                  variant="outlined"
                  fullWidth
                  error={!!errors.last_name}
                  helperText={errors.last_name?.message}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('user.password')}
                  type="password"
                  variant="outlined"
                  fullWidth
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              )}
            />
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('user.confirm_password')}
                  type="password"
                  variant="outlined"
                  fullWidth
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                />
              )}
            />
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: '1.25rem' }}>
        <Button onClick={onClose}>{t('user.actions.cancel')}</Button>
        <Button
          color="secondary"
          onClick={handleSubmit(onSubmitForm)}
          variant="contained"
        >
          {t('user.actions.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
