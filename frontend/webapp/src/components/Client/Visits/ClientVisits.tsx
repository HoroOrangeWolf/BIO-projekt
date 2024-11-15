import { useEffect, useMemo, useState } from 'react';
import { getAllUserVisits } from '@main/components/services/api.ts';
import MaterialTable from '@main/components/utils/MaterialTable.tsx';
import {
  Box, Button, IconButton, Tooltip,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import CreateVisitModal from '@main/components/Client/Visits/components/CreateVisitModal.tsx';
import { map } from 'lodash';
import dayjs from 'dayjs';
import { UserVisitFullModelType } from '@main/components/services/types.ts';
import ConfirmRemoveVisit from '@main/components/Client/Visits/components/ConfirmRemoveVisit.tsx';

const ClientVisits = () => {
  const [visits, setVisits] = useState<UserVisitFullModelType[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [visitToRemove, setVisitToRemove] = useState<UserVisitFullModelType>();
  const [visitToEdit, setVisitToEdit] = useState<UserVisitFullModelType>();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const fetch = async () => {
    const visitsResponse = await getAllUserVisits(false);

    const mapVisits = map(visitsResponse.data, (item) => ({
      ...item,
      start_time: dayjs(item.start_time).tz('UTC').format('DD/MM/YYYY HH:mm'),
    }));

    setVisits(mapVisits);
  };

  useEffect(() => {
    fetch()
      .catch(console.error);
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'visit_name',
        header: 'Nazwa Wizyty',
      },
      {
        accessorKey: 'start_time',
        header: 'Data rozpoczęcia wizyty',
      },
      {
        accessorKey: 'doctor.user.full_name',
        header: 'Nazwa doktora',
      },
    ],
    [],
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <MaterialTable
        columns={columns}
        data={visits}
        manualPagination
        onPaginationChange={setPagination}
        pagination={pagination}
        renderRowActions={({ row }: any) => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Tooltip arrow placement="top" title="Edytuj">
              <IconButton onClick={() => {
                setVisitToEdit(row.original);
                setIsAddModalOpen(true);
              }}
              >
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Usuń">
              <IconButton color="error" onClick={() => setVisitToRemove(row.original)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={
                    () => (
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => setIsAddModalOpen(true)}
                      >
                        Dodaj
                      </Button>
                    )
                }
      />
      {(isAddModalOpen) && (
        <CreateVisitModal
          onCancel={() => setIsAddModalOpen(false)}
          updateVisit={visitToEdit}
          onSubmit={() => {
            setIsAddModalOpen(false);
            fetch()
              .catch(console.error);
          }}
        />
      )}
      {visitToRemove && (
        <ConfirmRemoveVisit
          visit={visitToRemove}
          onCancel={() => setVisitToRemove(undefined)}
          onConfirm={() => {
            setVisitToRemove(undefined);
            fetch()
              .catch(console.error);
          }}
        />
      )}
    </Box>
  );
};

export default ClientVisits;
