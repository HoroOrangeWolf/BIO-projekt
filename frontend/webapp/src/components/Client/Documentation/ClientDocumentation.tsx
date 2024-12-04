import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BASE_URL, getUserMedicalDocumentation } from '@main/components/services/api.ts';
import { isNil, toNumber } from 'lodash';
import { Box, Button } from '@mui/material';
import MaterialTable from '@main/components/utils/MaterialTable.tsx';
import AddDocumentationModal from '@main/components/Client/Documentation/AddDocumentationModal.tsx';
import DownloadIcon from '@mui/icons-material/Download';
import { useAsync } from 'react-async-hook';

const ClientDocumentation = () => {
  const [isAddDocumentationOpen, setIsAddDocumentationOpen] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [searchParams] = useSearchParams();

  const { result: documentations = [], execute: reloadDocumentation } = useAsync(async () => {
    const result = await getUserMedicalDocumentation();

    return result.data;
  }, []);

  const filteredDocs = useMemo(() => {
    const visitIdRaw = searchParams.get('visit');

    if (isNil(visitIdRaw)) {
      return documentations;
    }

    const visitId = toNumber(visitIdRaw);

    return documentations.filter((doc) => doc.visit.id === visitId);
  }, [documentations]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'file_name',
        header: 'Nazwa pliku',
      },
      {
        accessorKey: 'file_description',
        header: 'Opis pliku',
      },
      {
        accessorKey: 'visit.visit_name',
        header: 'Nazwa wizyty',
      },
    ],
    [],
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <MaterialTable
        columns={columns}
        data={filteredDocs}
        manualPagination
        renderTopToolbarCustomActions={
            () => (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setIsAddDocumentationOpen(true)}
              >
                Dodaj dokumentacje
              </Button>
            )
        }
        renderRowActions={({ row }) => (
          <Button
            href={`${BASE_URL}client/user/visits/${row.original.visit.id}/documentation/${row.original.id}/download`}
          >
            <DownloadIcon />
          </Button>
        )}
        onPaginationChange={setPagination}
        pagination={pagination}
      />
      {isAddDocumentationOpen && (
      <AddDocumentationModal
        onCancel={(reload) => {
          setIsAddDocumentationOpen(false);

          if (reload) {
            reloadDocumentation();
          }
        }}
      />
      )}
    </Box>
  );
};

export default ClientDocumentation;
