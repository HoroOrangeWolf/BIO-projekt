import { getAllUserVisits } from '@main/components/services/api.ts';
import { useEffect, useMemo, useState } from 'react';
import { UserVisitFullModelType } from '@main/components/services/types.ts';
import { map } from 'lodash';
import dayjs from 'dayjs';
import {
  Box, Button,
} from '@mui/material';
import MaterialTable from '@main/components/utils/MaterialTable.tsx';
import { createSearchParams, useNavigate } from 'react-router-dom';

const VisitHistory = () => {
  const [visits, setVisits] = useState<UserVisitFullModelType[]>([]);

  const navigation = useNavigate();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const fetch = async () => {
    const visitsResponse = await getAllUserVisits(true);

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
        renderRowActions={({ row }) => (
          <Button
            variant="contained"
            onClick={() => {
              navigation({
                pathname: '/client/documentation',
                search: createSearchParams({
                  visit: row.original.id,
                }).toString(),
              });
            }}
          >
            Wyświetl dokumentacje
          </Button>
        )}
        onPaginationChange={setPagination}
        pagination={pagination}
      />
    </Box>
  );
};

export default VisitHistory;
