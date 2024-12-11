import { useState } from 'react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { finishVisit, getDoctorVisits } from '@main/components/services/api.ts';
import FullCalendar from '@fullcalendar/react';
import { useSelector } from 'react-redux';
import {
  Button, CircularProgress, Dialog, DialogActions, DialogContent, Typography,
} from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import { useAsync } from 'react-async-hook';
import { createSearchParams, useNavigate } from 'react-router-dom';

type VisitEvent = {
  id: number;
  title: string;
  start: Date;
  description: string;
  is_visit_finished: boolean,
  user: {
    first_name: string;
    last_name: string;
    email: string;
    full_name: string;
  };
  backgroundColor?: string;
};

const DoctorCalendar = () => {
  const navigation = useNavigate();

  const doctor_id = useSelector((state: any) => state.auth.user.doctor);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<VisitEvent | any>({});
  const [reloadKey, setReloadKey] = useState(0);

  const { result: events = [], loading = true } = useAsync(async () => {
    const response = await getDoctorVisits(doctor_id);
    const now = new Date();

    return response.data.map((visit: any) => {
      const start = new Date(visit.start_time);
      const end = new Date(start.getTime() + 30 * 60 * 1000);
      const isActive = now >= start && now <= end;

      const colorWhenVisitFinished = visit.is_visit_finished ? 'red' : '';

      return {
        id: visit.id,
        title: visit.visit_name,
        start,
        description: visit.description,
        user: visit.user,
        backgroundColor: isActive ? 'green' : colorWhenVisitFinished,
      };
    });
  }, [doctor_id, reloadKey]);

  const handleEventClick = (clickInfo: any) => {
    setSelected(clickInfo.event);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelected({});
  };

  const finish = async () => {
    const data = {
      is_visit_finished: true,
    };
    if (selected?.id) {
      await finishVisit(selected.id, data).then(() => setReloadKey((prev) => prev + 1));
      handleCloseDialog();
    }
  };

  return (
    <div>
      <Typography variant="h4">Twoja lista wizyt</Typography>
      {loading ? (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px',
        }}
        >
          <CircularProgress />
        </div>
      ) : (
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          weekends={false}
          locale="pl"
          events={events}
          eventClick={handleEventClick}
          eventContent={(eventInfo) => (
            <div style={{
              padding: '5px', borderRadius: '4px', backgroundColor: eventInfo.event.backgroundColor, width: '100%',
            }}
            >
              <Typography variant="body1">
                {eventInfo.event.start?.toLocaleString('pl-PL', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Typography>
              <Typography variant="body1">{eventInfo.event.extendedProps.user.full_name}</Typography>
              <Typography variant="body2">{eventInfo.event.title}</Typography>
            </div>
          )}
        />
      )}
      {open && (
        <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="md">
          <DialogTitle sx={{ m: 0, p: 2 }}>
            <Typography variant="h4">{selected?.extendedProps.user.full_name}</Typography>
          </DialogTitle>
          <DialogContent sx={{ m: 1 }}>
            <Typography variant="subtitle1">{selected?.extendedProps.title}</Typography>
            <Typography variant="subtitle2">{selected?.extendedProps.description}</Typography>
          </DialogContent>
          <DialogActions sx={{ m: 1 }}>
            <Button variant="contained" color="error" onClick={finish}>Zakończ wizytę</Button>
            <Button
              onClick={() => {
                navigation({
                  pathname: '/doctor/documentation',
                  search: createSearchParams({
                    visit: selected.id,
                  }).toString(),
                });
              }}
              variant="contained"
              color="primary"
            >
              Sprawdź dokumentację
            </Button>
            <Button variant="contained" color="info" onClick={handleCloseDialog}>Zamknij</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default DoctorCalendar;
