import { useEffect, useRef, useState } from 'react';
import { SpecializationModel, UserModelType } from '@main/components/services/types.ts';
import { getAllSpecializations, updateUser } from '@main/components/services/api.ts';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { editUserSchema } from '@main/components/validations/usersSchemas.ts';
import {
  Autocomplete, Button,
  Dialog, DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  Switch,
  TextField, Typography,
} from '@mui/material';
import { filter, map } from 'lodash';
import { useTranslation } from 'react-i18next';

type PropsType = {
    userToUpdate: UserModelType;
    onClose?: () => any;
}

export type UpdateUserFormType = {
    email: string;
    first_name: string;
    last_name: string;
    doctorDetails?: {
        doctor_number: string;
        doctor_specializations: number[]
    } | null
}

const UpdateUserModal = (props: PropsType) => {
  const { t } = useTranslation('system');
  const formRef = useRef<HTMLFormElement>();
  const [isUserDoctor, setIsUserDoctor] = useState<boolean>(!!props.userToUpdate?.doctor_details);
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

  const getDefaultValues = (): UpdateUserFormType => {
    if (props.userToUpdate.doctor_details) {
      return ({
        first_name: props.userToUpdate.first_name,
        last_name: props.userToUpdate.last_name,
        email: props.userToUpdate.email,
        doctorDetails: {
          doctor_number: props.userToUpdate.doctor_details.doctor_number,
          doctor_specializations: map(props.userToUpdate.doctor_details.doctor_specializations, ({ id }) => id),
        },
      });
    }

    return ({
      first_name: props.userToUpdate.first_name,
      last_name: props.userToUpdate.last_name,
      email: props.userToUpdate.email,
      doctorDetails: null,
    });
  };

  const {
    control, handleSubmit, setValue, formState: { errors },
  } = useForm<UpdateUserFormType>({
    resolver: yupResolver(editUserSchema),
    defaultValues: getDefaultValues(),
  });

  const onSubmitForm = async ({ doctorDetails, ...user }: UpdateUserFormType) => {
    await updateUser(props.userToUpdate.id, {
      user,
      details: doctorDetails,
    });
    props.onClose?.();
  };

  return (
    <Dialog
      open
      fullWidth
      maxWidth="md"
    >
      <DialogTitle textAlign="center">{t('user.actions.add_user')}</DialogTitle>
      <DialogContent>
        <form ref={formRef as any} onSubmit={handleSubmit(onSubmitForm)}>
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
            <FormControlLabel
              control={(
                <Switch
                  checked={isUserDoctor}
                  onClick={() => {
                    setIsUserDoctor(!isUserDoctor);

                    if (isUserDoctor) {
                      setValue('doctorDetails', null, { shouldDirty: true, shouldValidate: true });
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
                  <>
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
                        />
                      )}
                    />
                    <Typography variant="body2" color="error" sx={{ mt: 1, ml: 1 }}>
                      {errors.doctorDetails?.doctor_specializations?.message}
                    </Typography>
                  </>
                )}
              />
            </>
            )}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: '1.25rem' }}>
        <Button onClick={props.onClose}>{t('user.actions.cancel')}</Button>
        <Button
          color="secondary"
          onClick={() => {
            formRef.current?.requestSubmit();
          }}
          variant="contained"
        >
          Zaktualizuj
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateUserModal;
