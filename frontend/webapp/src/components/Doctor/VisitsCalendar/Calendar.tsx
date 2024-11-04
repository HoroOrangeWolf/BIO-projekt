import React, { useEffect, useState } from 'react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { getDoctorVisits } from '@main/components/services/api.ts';
import FullCalendar from '@fullcalendar/react';
import { useSelector } from 'react-redux';
import {
  Button, Dialog, DialogActions, DialogContent, Typography,
} from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';

type VisitEvent = {
  id: number;
  title: string;
  start: Date;
  description: string;
  user: {
    first_name: string;
    last_name: string;
    email: string;
    full_name: string;
  };
  backgroundColor?: string;
};

const DoctorCalendar = () => {
  const [events, setEvents] = useState<VisitEvent[]>([]);
  const doctor_id = useSelector((state: any) => state.auth.user.id);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<VisitEvent | null>(null);

  useEffect(() => {
    async function fetchData() {
      await getDoctorVisits(doctor_id).then((resp) => {
        const now = new Date();
        const formattedEvents = resp.data.map((visit: any) => {
          const start = new Date(visit.start_time);
          const end = new Date(start.getTime() + 30 * 60 * 1000);

          const isActive = now >= start && now <= end;
          return {
            id: visit.id,
            title: visit.visit_name,
            start,
            description: visit.description,
            user: visit.user,
            backgroundColor: isActive ? 'green' : '',
          };
        });
        setEvents(formattedEvents);
      });
    }

    fetchData();
  }, [doctor_id]);

  const handleEventClick = (clickInfo: any) => {
    setSelected(clickInfo.event.extendedProps);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelected(null);
  };

  return (
    <div>
      <Typography variant="h4">Twoja lista wizyt</Typography>
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
      {open && (
        <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="md">
          <DialogTitle sx={{ m: 0, p: 2 }}>
            <Typography variant="h4">{selected?.user.full_name}</Typography>
          </DialogTitle>
          <DialogContent sx={{ m: 1 }}>
            <Typography variant="subtitle1">{selected?.title}</Typography>
            <Typography variant="subtitle2">{selected?.description}</Typography>
          </DialogContent>
          <DialogActions sx={{ m: 1 }}>
            <Button variant="contained" color="error">Zakończ wizytę</Button>
            <Button variant="contained" color="primary">Sprawdź dokumentację</Button>
            <Button variant="contained" color="success">Umów kolejną wizytę</Button>
            <Button variant="contained" color="info" onClick={handleCloseDialog}>Zamknij</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default DoctorCalendar;
