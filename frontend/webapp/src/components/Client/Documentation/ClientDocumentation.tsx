import { useEffect, useMemo, useState } from 'react';
import { DocumentationType } from '@main/components/services/types.ts';
import { useSearchParams } from 'react-router-dom';
import { getUserMedicalDocumentation } from '@main/components/services/api.ts';
import { isNil, toNumber } from 'lodash';
import { Box, Button } from '@mui/material';
import MaterialTable from '@main/components/utils/MaterialTable.tsx';

const ClientDocumentation = () => {
  const [documentations, setDocumentation] = useState<DocumentationType[]>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [searchParams] = useSearchParams();

  const fetch = async () => {
    const visitsResponse = await getUserMedicalDocumentation();

    setDocumentation(visitsResponse.data);
  };

  useEffect(() => {
    fetch()
      .catch(console.error);
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
        renderRowActions={() => (
          <Button
            variant="contained"
          >
            Pobierz dokumentacje
          </Button>
        )}
        onPaginationChange={setPagination}
        pagination={pagination}
      />
    </Box>
  );
};

export default ClientDocumentation;
