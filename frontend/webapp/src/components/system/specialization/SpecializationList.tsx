import {useEffect, useMemo, useState} from 'react';
import {SpecializationModel} from '@main/components/services/types.ts';
import {getAllSpecializations, updateSpecialization} from '@main/components/services/api.ts';
import MaterialTable from '@main/components/utils/MaterialTable.tsx';
import {
  Box, Button, IconButton, Tooltip,
} from '@mui/material';
import {Delete, Edit} from '@mui/icons-material';
import AddSpecializationModal, {
  specializationSchema,
} from '@main/components/system/specialization/components/AddSpecializationModal.tsx';
import ConfirmRemoveSpecializationModal
  from '@main/components/system/specialization/components/ConfirmRemoveSpecializationModal.tsx';

const SpecializationList = () => {
  const [specializations, setSpecializations] = useState<SpecializationModel[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rowToRemove, setRowToRemove] = useState<SpecializationModel>();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const fetch = async () => {
    try {
      setIsLoading(true);
      setSpecializations([]);
      const visitsResponse = await getAllSpecializations();

      setSpecializations(visitsResponse.data);
    } catch (e) {
      console.error('Error fetching users:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetch()
      .catch(console.error);
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'specialization_name',
        header: 'Nazwa Specializacji',
      },
    ],
    [],
  );

  return (
    <>
      <MaterialTable
        columns={columns}
        data={specializations}
        manualPagination
        isLoading={isLoading}
        onEditingRowSave={(row) => {
          const add = async () => {
            setIsLoading(true);
            try {
              specializationSchema.validateSync({
                specialization_name: row.values.specialization_name,
              });

              await updateSpecialization(row.row.original.id, {
                specialization_name: row.values.specialization_name,
              });
              fetch()
                .catch(console.error);
            } catch (e) {
              console.error('Error adding specialization:', e);
            } finally {
              setIsLoading(false);
              row.exitEditingMode();
            }
          };

          add()
            .catch(console.error);
        }}
        onPaginationChange={setPagination}
        pagination={pagination}
        renderRowActions={({row, table}: any) => (
          <Box sx={{display: 'flex', gap: '1rem'}}>
            <Tooltip arrow placement="top" title="Edytuj">
              <IconButton onClick={() => table.setEditingRow(row)}>
                <Edit/>
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Usuń">
              <IconButton
                color="error"
                onClick={() => {
                  setRowToRemove(row.original);
                }}
              >
                <Delete/>
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
        <AddSpecializationModal
          onCancel={() => setIsAddModalOpen(false)}
          onSubmit={() => {
            setIsAddModalOpen(false);
            fetch()
              .catch(console.error);
          }}
        />
      )}
      {
        rowToRemove && (
          <ConfirmRemoveSpecializationModal
            row={rowToRemove}
            onClose={() => {
              setRowToRemove(undefined);
              fetch()
                .catch(console.error);
            }}
          />
        )
      }
    </>
  );
};

export default SpecializationList;
