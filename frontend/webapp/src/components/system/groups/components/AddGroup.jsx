import React, {useState} from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';
import {useTranslation} from "react-i18next";

export const AddGroupModal = ({open, onClose, onSubmit}) => {
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    name: ''
  });
  const {t} = useTranslation("system");

  const validateField = (name, value) => {
    let errors = {...formErrors};
    switch (name) {
      case "name":
        const nameRegex = /^[a-zA-Z]+$/;
        if (!nameRegex.test(value))
          errors = {...errors, name: t("group.errors.name")}
        else
          delete errors.name;
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
    } else {

    }
  };

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData({...formData, [name]: value});
    validateField(name, value);
  };

  return (
    <Dialog open={open} fullWidth maxWidth={"sm"}>
      <DialogTitle textAlign="center">{t("group.actions.add")}</DialogTitle>
      <DialogContent>
        <Stack
          sx={{
            width: '100%',
            minWidth: {xs: '300px', sm: '360px', md: '400px'},
            gap: '1.5rem',
            mt: "5px"
          }}
        >
          <TextField
            label={t("group.name")}
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
      <DialogActions sx={{p: '1.25rem'}}>
        <Button onClick={onClose}>{t("group.actions.cancel")}</Button>
        <Button
          color="secondary"
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.name.length}
        >
          {t("group.actions.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};