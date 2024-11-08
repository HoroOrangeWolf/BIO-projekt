import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
} from '@mui/material';
import { UserVisitFullModelType } from '@main/components/services/types.ts';
import { deleteUserVisit } from '@main/components/services/api.ts';

type PropsType = {
    onCancel?: () => void;
    onConfirm?: () => void;
    visit: UserVisitFullModelType;
}

const ConfirmRemoveVisit = (props: PropsType) => {
  const deleteVisit = async () => {
    await deleteUserVisit(props.visit.id);
    props.onConfirm?.();
  };

  return (
    <Dialog open maxWidth="md" fullWidth>
      <DialogTitle>
        Potwierdz anulowanie wizyty
      </DialogTitle>
      <DialogContent>
        Czy chcesz anulować wizyte &quot;
        {props.visit.visit_name}
        &quot;?
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onCancel}>
          Zamknij
        </Button>
        <Button onClick={deleteVisit} variant="contained">
          Usuń
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmRemoveVisit;
