import {
  Badge, Box, Button,
  Dialog, DialogContent, DialogTitle, MenuItem, Stack, TextField,
} from '@mui/material';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  DateCalendar, PickersDay, PickersDayProps,
} from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import CancelIcon from '@mui/icons-material/Cancel';
import {
  isEmpty, isNil, map, reduce, some, toNumber,
} from 'lodash';
import { useMemo, useState } from 'react';
import { useAsync } from 'react-async-hook';
import {
  createDoctorVisit,
  getAllSpecializations,
  getDoctorsBySpecializations,
  getDoctorNonSensitiveVisits,
} from '@main/components/services/api.ts';
import { NonSensitiveVisitModel } from '@main/components/services/types.ts';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const visitSchema = yup.object().shape({
  visit_name: yup.string().required('Wymagane jest uzupełnienie nazwy wizyty'),
  start_time: yup.string()
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

const VALIDATION_FORMAT = 'DD-MM-YYYY';

const ISO_DATE_FORMAT = 'YYYY-MM-DD';

const MAX_VISIT_PER_DAY = 8;

const ServerDay = (props: PickersDayProps<Dayjs> & { occupiedDays?: {
  [x: string]: number
  } }) => {
  const {
    occupiedDays = {}, day, outsideCurrentMonth, ...other
  } = props;

  const formatted = props.day.format(VALIDATION_FORMAT);

  const isSelected = (occupiedDays[formatted] ?? 0) >= MAX_VISIT_PER_DAY;

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

const generateTimes = (start: string, end: string, interval: number): string[] => {
  const times: string[] = [];
  let [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);

  while (startHour < endHour || (startHour === endHour && startMinute <= endMinute)) {
    const timeString = `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`;
    times.push(timeString);

    startMinute += interval;
    if (startMinute >= 60) {
      startMinute -= 60;
      startHour += 1;
    }
  }

  return times;
};

const shouldBeDisabled = (takenDates: NonSensitiveVisitModel[], time: string, selectedCalendarDate?: string) => {
  if (isEmpty(selectedCalendarDate)) {
    return false;
  }

  const timeSplit = time.split(':');

  const hour = toNumber(timeSplit[0]);
  const minute = toNumber(timeSplit[1]);

  const buildedDate = dayjs(selectedCalendarDate)
    .hour(hour)
    .minute(minute)
    .second(0)
    .format('YYYY-MM-DDTHH:mm:ss');

  return some(takenDates, { start_time: `${buildedDate}Z` });
};

const CreateVisitModal = (props: PropsType) => {
  const [currentCalendarDate, setCurrentCalendarDate] = useState<string>();
  const [isToastOpen, setIsToastOpen] = useState(false);
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
  const specializationId = form.watch('specializationId') as number;
  const hasSelectedDoctor = !!form.watch('doctor');
  const doctorId = form.watch('doctor');
  const start_time = form.watch('start_time') as string;

  const { handleSubmit, control, formState: { errors } } = form;

  const onSubmitForm = async (data: VisitFormType) => {
    await createDoctorVisit(data);

    props.onSubmit?.();
  };

  const { result: specializations } = useAsync(async () => (await getAllSpecializations()).data, []);
  const { result: doctors } = useAsync(async () => {
    if (isNil(specializationId)) {
      return [];
    }

    const response = await getDoctorsBySpecializations(specializationId);

    return response.data;
  }, [specializationId]);

  const { result: doctorVisits = [] } = useAsync(async () => {
    if (isNil(doctorId)) {
      return [];
    }

    const response = await getDoctorNonSensitiveVisits(doctorId);

    return response.data;
  }, [doctorId]);

  const groupedVisits = useMemo(() => reduce(doctorVisits, (acc, curr) => {
    const groupedDate = dayjs(curr.start_time)
      .format(VALIDATION_FORMAT);

    const number = acc[groupedDate] as number ?? 0;

    return ({
      ...acc,
      [groupedDate]: number + 1,
    });
  }, {} as {[x: string]: number}), [doctorVisits]);

  const times = useMemo(() => generateTimes('MAX_VISIT_PER_DAY:00', '17:00', 30)
    .map((time) => (
      <MenuItem
        key={time}
        disabled={shouldBeDisabled(doctorVisits, time, currentCalendarDate)}
        value={time}
      >
        {time}
      </MenuItem>
    )), [doctorVisits, currentCalendarDate]);

  const doctorsEntries = useMemo(() => map(doctors, (doctor) => (
    <MenuItem
      value={doctor.id}
      key={doctor.id}
    >
      {doctor.full_name}
    </MenuItem>
  )), [doctors]);

  const specializationItems = useMemo(() => map(specializations, (specialization) => (
    <MenuItem
      key={`key-${specialization.id}`}
      value={specialization.id}
    >
      {specialization.specialization_name}
    </MenuItem>
  )), [specializations]);

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
                <TextField
                  placeholder="Wybierz Specjalizacje doktora"
                  ref={field.ref}
                  onBlur={field.onBlur}
                  onChange={(e) => field.onChange(e.target.value as string)}
                  label="Specjalizacja doktora"
                  variant="outlined"
                  select
                  fullWidth
                  error={!!errors.specializationId}
                >
                  {specializationItems}
                </TextField>
              )}
              name="specializationId"
            />
            {hasSelectedSpecializationId && (
            <Controller
              control={control}
              render={({ field }) => (
                <TextField
                  placeholder="Wybierz doktora"
                  label="Doktor"
                  variant="outlined"
                  fullWidth
                  error={!!errors.specializationId}
                  ref={field.ref}
                  onBlur={field.onBlur}
                  select
                  onChange={(e) => field.onChange(e.target.value as string)}
                >
                  {doctorsEntries}
                </TextField>
              )}
              name="doctor"
            />
            )}
            {hasSelectedDoctor && (
            <Controller
              control={control}
              render={({ field }) => (
                <div onBlur={field.onBlur}>
                  <DateCalendar
                    slots={{
                      day: ServerDay,
                    }}
                    slotProps={{
                      day: {
                        occupiedDays: groupedVisits,
                      } as any,
                    }}
                    onChange={(value: Dayjs) => {
                      const forValidation = value.format(VALIDATION_FORMAT);

                      if ((groupedVisits[forValidation] ?? 0) >= MAX_VISIT_PER_DAY) {
                        setIsToastOpen(true);
                        return;
                      }

                      const dateFormatted = value.format(ISO_DATE_FORMAT);

                      setCurrentCalendarDate(dateFormatted);
                      field.onChange(dateFormatted);
                    }}
                    value={isNil(currentCalendarDate) ? dayjs(currentCalendarDate) : null}
                    ref={field.ref}
                  />
                  {isEmpty(start_time) || (
                  <TextField
                    fullWidth
                    select
                    SelectProps={{
                      MenuProps: {
                        sx: {
                          maxHeight: 48 * 6,
                        },
                      },
                    }}
                    label="Godzina wizyty"
                    placeholder="Wybierz godzine wizyty"
                    variant="outlined"
                    onChange={(event) => {
                      const time = event.target.value as string;

                      const split = time.split(':');

                      const hours = toNumber(split[0]);
                      const minutes = toNumber(split[1]);

                      const dateTimeOfVisit = dayjs(currentCalendarDate)
                        .hour(hours)
                        .minute(minutes)
                        .second(0)
                        .format('YYYY-MM-DDTHH:mm:ss');

                      field.onChange(dateTimeOfVisit);
                    }}
                  >
                    {times}
                  </TextField>
                  )}
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
              <Button onClick={() => props.onCancel?.()} color="inherit">
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
        <Snackbar open={isToastOpen} autoHideDuration={6000} onClose={() => setIsToastOpen(false)}>
          <Alert
            onClose={() => setIsToastOpen(false)}
            severity="error"
            variant="filled"
            sx={{ width: '100%' }}
          >
            Wszystkie terminy w ten dzień są już zajęte
          </Alert>
        </Snackbar>
      </DialogContent>
    </Dialog>
  );
};

export default CreateVisitModal;
