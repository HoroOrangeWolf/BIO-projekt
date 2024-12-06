import { useMemo, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  createPatientVisit,
  getAllPatients,
  getDoctorNonSensitiveVisits,
} from '@main/components/services/api.ts';
import { useAsync } from 'react-async-hook';
import {
  isEmpty, isNil, map, reduce, toNumber,
} from 'lodash';
import {
  Box, Button, Dialog, DialogContent, DialogTitle, MenuItem, Stack, TextField,
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import {
  generateTimes,
  ServerDay,
  shouldBeDisabled,
} from '@main/components/Client/Visits/components/CreateVisitModal.tsx';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import { UserVisitFullModelType } from '@main/components/services/types.ts';

type VisitFormType = {
    visit_name: string;
    start_time: string;
    description: string;
    patient: number;
}

const visitSchema = yup.object().shape({
  visit_name: yup.string().required('Wymagane jest uzupełnienie nazwy wizyty'),
  start_time: yup.string()
    .required('Wymagane jest pole wyboru czasu'),
  description: yup.string().required('Pole opisu jest wymagane'),
  patient: yup.number().required('To pole jest wymagane'),
});

const VALIDATION_FORMAT = 'DD-MM-YYYY';

const ISO_DATE_FORMAT = 'YYYY-MM-DD';

const MAX_VISIT_PER_DAY = 8;

type PropsType = {
  onSubmit?: () => any;
  onCancel?: () => any;
  updateVisit?: UserVisitFullModelType;
}

const CreateDoctorVisitModal = (props: PropsType) => {
  const [currentCalendarDate, setCurrentCalendarDate] = useState<string | undefined>(
    props.updateVisit?.start_time ? dayjs(props.updateVisit?.start_time).tz('UTC').format(VALIDATION_FORMAT) : undefined,
  );
  const [isToastOpen, setIsToastOpen] = useState(false);
  const user_id = useSelector((state: any) => state.auth.user.id) as number;
  const form = useForm<VisitFormType>({
    resolver: yupResolver(visitSchema),
    defaultValues: {
      visit_name: props.updateVisit?.visit_name ?? '',
      start_time: props.updateVisit?.start_time ?? '',
      description: props.updateVisit?.description ?? '',
      patient: props.updateVisit?.user?.id,
    },
  });

  const start_time = form.watch('start_time') as string;

  const { handleSubmit, control, formState: { errors } } = form;

  const onSubmitForm = async (data: VisitFormType) => {
    await createPatientVisit(data);

    props.onSubmit?.();
  };

  const { result: patients } = useAsync(async () => {
    const patientsResponse = await getAllPatients();

    return map(patientsResponse.data, (patient) => ({ value: patient.id, label: patient.full_name }));
  }, []);

  const { result: doctorVisits = [] } = useAsync(async () => {
    const response = await getDoctorNonSensitiveVisits(user_id);

    return response.data;
  }, [user_id]);

  const groupedVisits = useMemo(() => reduce(doctorVisits, (acc, curr) => {
    const groupedDate = dayjs(curr.start_time)
      .format(VALIDATION_FORMAT);

    const number = acc[groupedDate] as number ?? 0;

    return ({
      ...acc,
      [groupedDate]: number + 1,
    });
  }, {} as {[x: string]: number}), [doctorVisits]);

  const times = useMemo(() => generateTimes('09:00', '17:00', 30)
    .map((time) => (
      <MenuItem
        key={time}
        disabled={shouldBeDisabled(doctorVisits, time, currentCalendarDate)}
        value={time}
      >
        {time}
      </MenuItem>
    )), [doctorVisits, currentCalendarDate]);

  const patientEntries = useMemo(() => map(patients, (patient) => (
    <MenuItem
      value={patient.value}
      key={patient.value}
    >
      {patient.label}
    </MenuItem>
  )), [patients]);

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
                  value={field.value}
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
                  value={field.value}
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
                  placeholder="Wybierz pacjenta"
                  label="Pacjent"
                  value={field.value}
                  variant="outlined"
                  fullWidth
                  error={!!errors.patient}
                  ref={field.ref}
                  onBlur={field.onBlur}
                  select
                  onChange={(e) => field.onChange(e.target.value as string)}
                >
                  {patientEntries}
                </TextField>
              )}
              name="patient"
            />
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

export default CreateDoctorVisitModal;
