import { useEffect, useMemo, useState } from 'react';
import { getUserVisits } from '@main/components/services/api.ts';
import { VisitType } from '@main/components/services/types.ts';
import MaterialTable from '@main/components/utils/MaterialTable.tsx';
import {
  Box, Button, IconButton, Tooltip,
} from '@mui/material';
import AddCardIcon from '@mui/icons-material/AddCard';
import { Delete, Edit } from '@mui/icons-material';
import CreateVisitModal from '@main/components/Client/Visits/components/CreateVisitModal.tsx';

const ClientVisits = () => {
  const [visits, setVisits] = useState<VisitType[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    const fetch = async () => {
      const visitsResponse = await getUserVisits();

      setVisits(visitsResponse.data);
    };

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
        accessorKey: 'expected_end_time',
        header: 'Przewidywany czas zakończenia wizyty',
      },
      {
        accessorKey: 'is_approved_by_doctor',
        header: 'Czy wizyta jest zatwierdzona',
      },
    ],
    [],
  );

  return (
    <>
      <MaterialTable
        columns={columns}
        data={visits}
        // onEditingRowSave={handleSaveRowEdits}
        manualPagination
        onPaginationChange={setPagination}
        pagination={pagination}
        renderRowActions={({ row, table }: any) => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Tooltip arrow placement="left" title="Dodaj">
              <IconButton>
                <AddCardIcon />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="top" title="Edytuj">
              <IconButton onClick={() => table.setEditingRow(row)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Usuń">
              <IconButton color="error">
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
      {isAddModalOpen && (
        <CreateVisitModal
          onCancel={() => setIsAddModalOpen(false)}
        />
      )}
      {/* {openGroupModal && ( */}
      {/*  <AddGroupModal */}
      {/*    open={openGroupModal} */}
      {/*    onClose={handleNewGroupModal} */}
      {/*    onSubmit={handleCreateNewGroup} */}
      {/*  /> */}
      {/* )} */}
      {/* {editPermissionModal && ( */}
      {/*  <EditPermission */}
      {/*    open={editPermissionModal} */}
      {/*    onClose={handleEditPermissionModal} */}
      {/*    selectedGroup={selectedGroup} */}
      {/*    onSubmit={handleSavePermissions} */}
      {/*  /> */}
      {/* )} */}
    </>
  );
};

export default ClientVisits;
