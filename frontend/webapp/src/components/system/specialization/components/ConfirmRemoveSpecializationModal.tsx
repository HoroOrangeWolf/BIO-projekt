import { SpecializationModel } from '@main/components/services/types.ts';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
} from '@mui/material';
import { deleteSpecialization } from '@main/components/services/api.ts';

type PropsType = {
    row: SpecializationModel;
    onClose?: () => any;
}

const ConfirmRemoveSpecializationModal = (props: PropsType) => {
  const handleRemove = async () => {
    await deleteSpecialization(props.row.id);
    props.onClose?.();
  };

  return (
    <Dialog open fullWidth maxWidth="md">
      <DialogTitle>
        Usuń specializacje
      </DialogTitle>
      <DialogContent dividers>
        Czy chcesz usunąć specializacje:
        {' '}
        {props.row.specialization_name}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={props.onClose}
        >
          Anuluj
        </Button>
        <Button
          variant="contained"
          onClick={handleRemove}
        >
          Usuń
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmRemoveSpecializationModal;
