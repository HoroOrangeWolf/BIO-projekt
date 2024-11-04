import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MaterialTable from '../../utils/MaterialTable.tsx';
import { getPermissions } from '../../services/api.ts';

const PermissionList = () => {
  const [permissions, setPermissions] = useState([]);
  const { t } = useTranslation('system');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchPermission = async (page: number, pageSize: number) => {
    try {
      const response = await getPermissions(page, pageSize);
      setPermissions(response.data.results);
      setTotalRows(response.data.count);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermission(pagination.pageIndex, pagination.pageSize);
  }, [pagination.pageIndex, pagination.pageSize]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: t('permission.name'),
        size: 150,
      },
      {
        accessorKey: 'codename',
        header: t('permission.code_name'),
        size: 150,
      },
    ],
    [],
  );

  return (
    <MaterialTable
      isLoading={loading}
      columns={columns}
      data={permissions}
      disableAction
      pagination={pagination}
      onPaginationChange={setPagination}
      manualPagination
      rowCount={totalRows}
    />
  );
};

export default PermissionList;
