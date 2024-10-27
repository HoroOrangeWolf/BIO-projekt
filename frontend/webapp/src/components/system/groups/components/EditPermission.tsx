import { useEffect, useState } from 'react';
import {
  Button, Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle, FormControlLabel,
  Stack,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { getAllPermissions } from '../../../services/api.ts';

type PropsType = {
  open: boolean;
  onClose: (row: any) => void;
  onSubmit: (data: any) => void;
  selectedGroup: {
    id: string;
    permissions: string[];
  };
}

export const EditPermission = ({
  open, onClose, onSubmit, selectedGroup,
}: PropsType) => {
  const [formData, setFormData] = useState({
    permissions: selectedGroup.permissions,
    id: selectedGroup.id,
  });
  const [permissions, setPermissions] = useState<{id: string, name: string}[]>([]);
  const { t } = useTranslation('system');

  const fetchPermissions = async () => {
    try {
      const response = await getAllPermissions();
      setPermissions(response.data.results);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const handleCheckboxChange = (id: string) => {
    setFormData((prevFormData) => {
      const isAlreadySelected = prevFormData.permissions.includes(id);

      if (isAlreadySelected) {
        return {
          ...prevFormData,
          permissions: prevFormData.permissions.filter((permId) => permId !== id),
        };
      }
      return {
        ...prevFormData,
        permissions: [...prevFormData.permissions, id],
      };
    });
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Dialog open={open} fullWidth maxWidth="md">
      <DialogTitle textAlign="center">{t('group.actions.permission_edit')}</DialogTitle>
      <DialogContent>
        <Stack
          sx={{
            width: '100%',
            minWidth: { xs: '300px', sm: '360px', md: '400px' },
            gap: '1.5rem',
            mt: '5px',
          }}
        >
          {permissions.map((perm) => (
            <FormControlLabel
              key={perm.id}
              control={(
                <Checkbox
                  checked={formData.permissions.includes(perm.id)}
                  onChange={() => handleCheckboxChange(perm.id)}
                />
                            )}
              label={perm.name}
            />
          ))}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: '1.25rem' }}>
        <Button onClick={onClose}>{t('group.actions.cancel')}</Button>
        <Button
          color="secondary"
          onClick={handleSubmit}
          variant="contained"
        >
          {t('group.actions.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
