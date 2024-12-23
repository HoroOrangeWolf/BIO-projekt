import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle, FormControlLabel,
  Stack, Switch,
  TextField,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { newUserSchema } from '@main/components/validations/usersSchemas.ts';
import { useEffect, useState } from 'react';
import { SpecializationModel, UserModelType } from '@main/components/services/types.ts';
import { getAllSpecializations } from '@main/components/services/api.ts';
import { filter, map } from 'lodash';

export type AddUserFormType = {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  password: string;
  confirmPassword: string;
  doctorDetails?: {
    doctor_number: string;
    doctor_specializations: number[]
  } | null
}

type PropsType = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddUserFormType) => void;
  toEdit?: UserModelType;
}

export const AddNewUserModal = ({ open, onClose, onSubmit }: PropsType) => {
  const { t } = useTranslation('system');

  const [isUserDoctor, setIsUserDoctor] = useState<boolean>(false);
  const [specializations, setSpecializations] = useState<SpecializationModel[]>([]);
  const [isLoadingSpecialization, setIsLoadingSpecialization] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        setIsLoadingSpecialization(true);

        const { data } = await getAllSpecializations();

        setSpecializations(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoadingSpecialization(false);
      }
    };

    fetch()
      .catch(console.error);
  }, []);

  const {
    control, handleSubmit, setValue, formState: { errors },
  } = useForm<AddUserFormType>({
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

  const onSubmitForm = (data: AddUserFormType) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} fullWidth maxWidth="md">
      <DialogTitle textAlign="center">{t('user.actions.add_user')}</DialogTitle>
      <DialogContent dividers>
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
            <FormControlLabel
              control={(
                <Switch
                  checked={isUserDoctor}
                  onClick={() => {
                    setIsUserDoctor(!isUserDoctor);

                    if (!isUserDoctor) {
                      setValue('doctorDetails', null, { shouldDirty: true });
                    }
                  }}
                />
              )}
              label="Czy użytkownik jest doktorem?"
            />
            {isUserDoctor && (
              <>
                <Controller
                  name="doctorDetails.doctor_number"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      ref={field.ref}
                      onBlur={field.onBlur}
                      value={field.value}
                      onChange={(e) => field.onChange(e.currentTarget.value)}
                      label="Numer doktora"
                      error={!!errors.doctorDetails?.doctor_number?.message}
                      helperText={errors.doctorDetails?.doctor_number?.message}
                    />
                  )}
                />
                <Controller
                  name="doctorDetails.doctor_specializations"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      ref={field.ref}
                      onBlur={field.onBlur}
                      multiple
                      loading={isLoadingSpecialization}
                      value={filter(specializations, (spec) => field.value?.includes(spec.id)) as any}
                      onChange={(_e, newValue) => {
                        field.onChange(map(newValue, (val) => val.id));
                      }}
                      getOptionLabel={(option: SpecializationModel) => option.specialization_name}
                      options={specializations}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="standard"
                          label="Specializacje doktora"
                          placeholder="Wybierz specializacje"
                          error={!!errors.doctorDetails?.doctor_specializations?.message}
                          helperText={errors.doctorDetails?.doctor_specializations?.message}
                        />
                      )}
                    />
                  )}
                />
              </>
            )}
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
