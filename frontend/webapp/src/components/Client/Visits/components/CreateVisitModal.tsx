import {
  Badge, Box, Button,
  Dialog, DialogContent, DialogTitle, MenuItem, Select, Stack, TextField,
} from '@mui/material';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  DateCalendar, LocalizationProvider, PickersDay, PickersDayProps,
} from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CancelIcon from '@mui/icons-material/Cancel';
import { isEmpty } from 'lodash';
import { useState } from 'react';

const visitSchema = yup.object().shape({
  visit_name: yup.string().required('Wymagane jest uzupełnienie nazwy wizyty'),
  start_time: yup.string().matches(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?([+-]\d{2}:\d{2}|Z)$/, 'Wybrana data jest nie poprawna')
    .required('Wymagane jest pole wyboru czasu'),
  description: yup.string().required('Pole opisu jest wymagane'),
  doctor: yup.number().required('To pole jest wymagane'),
});

type VisitFormType = {
    visit_name: string;
    start_time: string;
    description: string;
    doctor: number;
    specializationId?: number;
}

type PropsType = {
    onSubmit?: () => any;
    onCancel?: () => any;
}

const ServerDay = (props: PickersDayProps<Dayjs> & { occupiedDays?: number[] }) => {
  const {
    occupiedDays = [], day, outsideCurrentMonth, ...other
  } = props;

  const isSelected = !props.outsideCurrentMonth && occupiedDays.indexOf(props.day.date()) >= 0;

  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      badgeContent={isSelected && <CancelIcon />}
    >
      <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
    </Badge>
  );
};

const CreateVisitModal = (props: PropsType) => {
  const [currentCalendarDate, setCurrentCalendarDate] = useState<string>();
  const form = useForm<VisitFormType>({
    resolver: yupResolver(visitSchema),
    defaultValues: {
      visit_name: '',
      start_time: '',
      description: '',
      doctor: undefined,
    },
  });

  const hasSelectedSpecializationId = !!form.watch('specializationId');
  const hasSelectedDoctor = !form.watch('doctor');
  const start_time = form.watch('start_time') as string;

  const { handleSubmit, control, formState: { errors } } = form;

  const onSubmitForm = (data: VisitFormType) => {
    console.log('Data', data);
    props.onSubmit?.();
  };

  return (
    <Dialog open fullWidth maxWidth="md">
      <DialogTitle>Stwórz wizyte</DialogTitle>
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
              name="visit_name"
              control={control}
              render={({ field }) => (
                <TextField
                  ref={field.ref}
                  onBlur={field.onBlur}
                  onChange={(e) => field.onChange(e.currentTarget.value)}
                  label="Nazwa wizyty"
                  type="text"
                  variant="outlined"
                  fullWidth
                  error={!!errors.visit_name}
                  helperText={errors.visit_name?.message}
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  ref={field.ref}
                  onBlur={field.onBlur}
                  onChange={(e) => field.onChange(e.currentTarget.value)}
                  label="Opis wizyty"
                  multiline
                  variant="outlined"
                  fullWidth
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />
            <Controller
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Wybierz Specjalizacje doktora"
                  ref={field.ref}
                  onBlur={field.onBlur}
                  onChange={(e) => field.onChange(e.target.value as string)}
                  label="Specjalizacja doktora"
                  variant="outlined"
                  fullWidth
                  error={!!errors.specializationId}
                >
                  <MenuItem value="test">
                    Test
                  </MenuItem>
                </Select>
              )}
              name="specializationId"
            />
            {hasSelectedSpecializationId && (
              <Controller
                control={control}
                render={({ field }) => (
                  <Select
                    placeholder="Wybierz doktora"
                    label="Doktor"
                    variant="outlined"
                    fullWidth
                    error={!!errors.specializationId}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    onChange={(e) => field.onChange(e.target.value as string)}
                  >
                    <MenuItem value="test">
                      Test
                    </MenuItem>
                  </Select>
                )}
                name="doctor"
              />
            )}
            {hasSelectedDoctor && (
              <Controller
                control={control}
                render={({ field }) => (
                  <Select
                    label="Doktor"
                    variant="outlined"
                    fullWidth
                    error={!!errors.specializationId}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    onChange={(e) => field.onChange(e.target.value as string)}
                  >
                    <MenuItem value="test">
                      Test
                    </MenuItem>
                  </Select>
                )}
                name="start_time"
              />
            )}
            {hasSelectedDoctor && (
              <Controller
                control={control}
                render={({ field }) => (
                  <div onBlur={field.onBlur}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateCalendar
                        slots={{
                          day: ServerDay,
                        }}
                        slotProps={{
                          day: {
                            occupiedDays: [1, 10, 25, 20],
                          } as any,
                        }}
                        onChange={(value: Dayjs) => {
                          const dateFormatted = value.format('YYYY-MM-DD');

                          setCurrentCalendarDate(dateFormatted);
                          field.onChange(dateFormatted);
                        }}
                        ref={field.ref}
                      />
                      {isEmpty(start_time) || (
                        <Select
                          fullWidth
                          label="Godzina wizyty"
                          placeholder="Wybierz godzine wizyty"
                          variant="outlined"
                          onChange={(event) => {
                            const time = event.target.value as string;

                            field.onChange(`${currentCalendarDate}T${time}:00.000Z`);
                          }}
                        >
                          <MenuItem value="11:30">
                            11:30 AM
                          </MenuItem>
                          <MenuItem value="12:30">
                            12:30 PM
                          </MenuItem>
                        </Select>
                      )}
                    </LocalizationProvider>
                  </div>
                )}
                name="start_time"
              />
            )}
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

export default CreateVisitModal;
