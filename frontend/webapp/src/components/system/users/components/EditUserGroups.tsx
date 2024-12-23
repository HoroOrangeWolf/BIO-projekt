import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { getAllGroups } from '../../../services/api.ts';
import { editUserGroupsSchema } from '../../../validations/usersSchemas.ts';

type PropsType = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  selectedUser: {
    id: string,
    groups: number[];
  };
}

export const EditUserGroups = ({
  open, onClose, onSubmit, selectedUser,
}: PropsType) => {
  const { t } = useTranslation('system');
  const {
    control, handleSubmit, setValue,
  } = useForm({
    resolver: yupResolver(editUserGroupsSchema),
    defaultValues: {
      groups: selectedUser.groups,
      id: selectedUser.id,
    },
  });

  const [groups, setGroups] = React.useState([]);

  useEffect(() => {
    async function getData() {
      const response = await getAllGroups();
      setGroups(response.data.results);
    }
    getData();
  }, []);

  const onSubmitForm = (data: any) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle textAlign="center">{t('user.actions.edit_groups')}</DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <Stack
            sx={{
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem',
              mt: '5px',
            }}
          >
            <Controller
              name="groups"
              control={control}
              render={({ field }: any) => (
                <>
                  {groups.map((group: any) => (
                    <FormControlLabel
                      key={group.id}
                      control={(
                        <Checkbox
                          checked={field.value.includes(group.id)}
                          onChange={(e) => {
                            const newGroups = e.target.checked
                              ? [...field.value, group.id]
                              : field.value.filter((id: any) => id !== group.id);
                            setValue('groups', newGroups);
                          }}
                        />
                      )}
                      label={group.name}
                    />
                  ))}
                </>
              )}
            />
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: '1.25rem' }}>
        <Button onClick={onClose}>{t('user.actions.cancel')}</Button>
        <Button
          color="secondary"
          onClick={handleSubmit(onSubmitForm)}
          variant="contained"
        >
          {t('user.actions.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
