import { ChangeEvent, useState } from 'react';
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

type PropsType = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const nameRegex = /^[a-zA-Z]+$/;

export const AddGroupModal = ({ open, onClose, onSubmit }: PropsType) => {
  const [formErrors, setFormErrors] = useState<{[x: string]: string}>({});
  const [formData, setFormData] = useState({
    name: '',
  });
  const { t } = useTranslation('system');

  const validateField = (name: any, value: any) => {
    let errors = { ...formErrors };
    switch (name) {
      case 'name':
        if (!nameRegex.test(value)) { errors = { ...errors, name: t('group.errors.name') }; } else { delete errors.name; }
        break;
      default:
        break;
    }
    setFormErrors(errors);
  };

  const handleSubmit = () => {
    if (Object.keys(formErrors).length === 0) {
      onSubmit(formData);
      onClose();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  return (
    <Dialog open={open} fullWidth maxWidth="sm">
      <DialogTitle textAlign="center">{t('group.actions.add')}</DialogTitle>
      <DialogContent>
        <Stack
          sx={{
            width: '100%',
            minWidth: { xs: '300px', sm: '360px', md: '400px' },
            gap: '1.5rem',
            mt: '5px',
          }}
        >
          <TextField
            label={t('group.name')}
            variant="outlined"
            fullWidth
            required
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!formErrors.name}
            helperText={formErrors.name}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: '1.25rem' }}>
        <Button onClick={onClose}>{t('group.actions.cancel')}</Button>
        <Button
          color="secondary"
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.name.length}
        >
          {t('group.actions.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
