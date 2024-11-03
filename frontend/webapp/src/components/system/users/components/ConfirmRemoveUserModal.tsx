import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
} from '@mui/material';
import { UserModelType } from '@main/components/services/types.ts';
import { deleteUser } from '@main/components/services/api.ts';

type PropsType = {
    onClose?: () => void;
    userModel: UserModelType;
}

const ConfirmRemoveUserModal = (props: PropsType) => {
  const handleRemove = async () => {
    await deleteUser(props.userModel.id);
    props.onClose?.();
  };

  return (
    <Dialog fullWidth maxWidth="md" open>
      <DialogTitle>
        Potwierdz usunięcie usera
      </DialogTitle>
      <DialogContent>
        Czy chcesz usunąć tego usera:
        {' '}
        {props.userModel.username}
        ?
      </DialogContent>
      <DialogActions>
        <Button
          onClick={props.onClose}
        >
          Zamknij
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

export default ConfirmRemoveUserModal;
