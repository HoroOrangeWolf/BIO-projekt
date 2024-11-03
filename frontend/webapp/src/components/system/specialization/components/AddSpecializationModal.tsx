import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Dialog, DialogContent, DialogTitle, Stack, TextField,
} from '@mui/material';
import { AddSpecializationModel } from '@main/components/services/types.ts';
import { addSpecialization } from '@main/components/services/api.ts';

export const specializationSchema = yup.object().shape({
  specialization_name: yup.string().min(2, 'Minimum 2 litery').required('Nazwa specializacij jest wymagana'),
});

type PropsType = {
    onSubmit?: () => any;
    onCancel?: () => any;
}

const AddSpecializationModal = (props: PropsType) => {
  const form = useForm<AddSpecializationModel>({
    resolver: yupResolver(specializationSchema),
    defaultValues: {
      specialization_name: '',
    },
  });

  const { control, formState: { errors } } = form;

  const handleSubmit = async (data: AddSpecializationModel) => {
    console.log(data);

    await addSpecialization(data);

    props.onSubmit?.();
  };

  return (
    <Dialog open fullWidth maxWidth="md">
      <DialogTitle textAlign="center">
        Dodaj specializacje
      </DialogTitle>
      <DialogContent>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <Stack
            sx={{
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem',
            }}
          >
            <Controller
              control={control}
              render={({ field }) => (
                <TextField
                  ref={field.ref}
                  onBlur={field.onBlur}
                  onChange={(e) => field.onChange(e.currentTarget.value)}
                  label="Nazwa specializacji"
                  fullWidth
                  error={!!errors.specialization_name}
                  helperText={errors.specialization_name?.message}
                />
              )}
              name="specialization_name"
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'end',
              }}
            >
              <Button onClick={() => props.onCancel?.()}>
                Zamknij
              </Button>
              <Button
                variant="contained"
                type="submit"
              >
                Dodaj
              </Button>
            </Box>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSpecializationModal;
