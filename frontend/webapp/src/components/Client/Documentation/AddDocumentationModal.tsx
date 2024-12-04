import {
  Box, Button, Dialog, DialogContent, DialogTitle, MenuItem, Stack, TextField,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import {
  map,
} from 'lodash';
import { useAsync } from 'react-async-hook';
import { addDocumentation, getAllUserVisits } from '@main/components/services/api.ts';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo } from 'react';

type PropsType = {
    onCancel?: (reload: boolean) => any;
};

export type AddDocumentationFormType = {
    file_name: string;
    visit_id: number;
    file_description: string;
    file?: File;
}

const documentationSchema = yup.object().shape({
  file_name: yup.string().required('Nazwa pliku wymagana'),
  file_description: yup.string().required('Opis pliku wymagany'),
  visit_id: yup.number().required('Wizyta jest wymagana'),
});

const AddDocumentationModal = (props: PropsType) => {
  const { result } = useAsync(async () => {
    const finishedVisits = await getAllUserVisits(true);
    const unfinishedVisits = await getAllUserVisits(false);

    return [
      ...finishedVisits.data,
      ...unfinishedVisits.data,
    ];
  }, []);

  const form = useForm<AddDocumentationFormType>({
    defaultValues: {
      file_name: '',
      file_description: '',
      visit_id: 0,
    },
    resolver: yupResolver(documentationSchema),
  });

  const { control, formState: { errors }, handleSubmit } = form;

  const visitEntries = useMemo(() => map(result, (visit) => (
    <MenuItem
      value={visit.id}
      key={visit.id}
    >
      {visit.visit_name}
    </MenuItem>
  )), [result]);

  const formFile = form.watch('file');

  const onSubmitForm = async (formData: AddDocumentationFormType) => {
    await addDocumentation(formData);
    props.onCancel?.(true);
  };

  return (
    <Dialog open fullWidth maxWidth="md">
      <DialogTitle>Stwórz wizyte</DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <Stack
            sx={{
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem',
              mt: 1,
            }}
          >
            <Controller
              name="file_name"
              control={control}
              render={({ field }) => (
                <TextField
                  ref={field.ref}
                  value={field.value}
                  onBlur={field.onBlur}
                  onChange={(e) => field.onChange(e.currentTarget.value)}
                  label="Nazwa pliku"
                  type="text"
                  variant="outlined"
                  fullWidth
                  error={!!errors.file_name}
                  helperText={errors.file_name?.message}
                />
              )}
            />
            <Controller
              name="file_description"
              control={control}
              render={({ field }) => (
                <TextField
                  ref={field.ref}
                  maxRows={5}
                  value={field.value}
                  multiline
                  onBlur={field.onBlur}
                  minRows={3}
                  onChange={(e) => field.onChange(e.currentTarget.value)}
                  label="Opis dokumentacji"
                  error={!!errors.file_description?.message}
                  helperText={errors.file_description?.message}
                />
              )}
            />
            <Controller
              control={control}
              render={({ field }) => (
                <TextField
                  placeholder="Wybierz wizyte"
                  label="Wizyta"
                  value={field.value}
                  variant="outlined"
                  fullWidth
                  ref={field.ref}
                  onBlur={field.onBlur}
                  select
                  onChange={(e) => field.onChange(e.target.value as string)}
                >
                  {visitEntries}
                </TextField>
              )}
              name="visit_id"
            />
            <Controller
              control={control}
              render={({ field }) => (
                <Button
                  variant="contained"
                  component="label"
                >
                  Dodaj dokumentacje
                  {' '}
                  {formFile?.name}
                  <input
                    type="file"
                    ref={field.ref}
                    hidden
                    onBlur={field.onBlur}
                    onChange={(e) => field.onChange(e.currentTarget.files?.[0])}
                  />
                </Button>
              )}
              name="file"
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'end',
              }}
            >
              <Button onClick={() => props.onCancel?.(false)} color="inherit">
                Zamknij
              </Button>
              <Button
                variant="contained"
                type="submit"
                color="success"
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

export default AddDocumentationModal;
