import {
  useEffect, useMemo, useState,
} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Box, Button, IconButton, Tooltip,
} from '@mui/material';
import {Delete, Edit} from '@mui/icons-material';
import AddCardIcon from '@mui/icons-material/AddCard';
import {AddGroupModal} from '@main/components/system/groups/components/AddGroup.tsx';
import {EditPermission} from '@main/components/system/groups/components/EditPermission.tsx';
import {
  deleteGroups, getGroups, patchGroups, postGroups,
} from '@main/components/services/api.ts';
import MaterialTable from '../../utils/MaterialTable.js';

const GroupList = () => {
  const {t} = useTranslation('system');
  const [openGroupModal, setOpenGroupModal] = useState(false);
  const [editPermissionModal, setEditPermissionModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<{
    id: string;
    permissions: string[];
  }>({id: '', permissions: []});
  const [groups, setGroups] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [totalRows, setTotalRows] = useState(0);
  const fetchGroups = async () => {
    try {
      const response = await getGroups(pagination.pageIndex, pagination.pageSize);
      setGroups(response.data.results);
      setTotalRows(response.data.count);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [pagination.pageIndex, pagination.pageSize]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: t('group.name'),
      },
    ],
    [],
  );

  const handleDeleteGroup = async (row: any) => {
    await deleteGroups(row.original.id);
  };

  const handleCreateNewGroup = async (data: any) => {
    await postGroups(data).then(() => fetchGroups());
  };

  const handleSaveRowEdits = async ({exitEditingMode, row, values}: any) => {
    await patchGroups(row.original.id, values);
    exitEditingMode();
  };

  const handleNewGroupModal = () => setOpenGroupModal(!openGroupModal);
  const handleEditPermissionModal = (row: any) => {
    if (row) setSelectedGroup(row?.original);
    setEditPermissionModal(!editPermissionModal);
  };

  const handleSavePermissions = async (formData: any) => {
    await patchGroups(formData.id, {permissions_set: formData.permissions});
    setEditPermissionModal(!editPermissionModal);
  };

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
      <MaterialTable
        columns={columns}
        data={groups}
        onEditingRowSave={handleSaveRowEdits}
        manualPagination
        rowCount={totalRows}
        onPaginationChange={setPagination}
        pagination={pagination}
        renderRowActions={({row, table}: any) => (
          <Box sx={{display: 'flex', gap: '1rem'}}>
            <Tooltip arrow placement="left" title={t('group.actions.permission_edit')}>
              <IconButton onClick={() => handleEditPermissionModal(row)}>
                <AddCardIcon/>
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="top" title={t('group.actions.edit')}>
              <IconButton onClick={() => table.setEditingRow(row)}>
                <Edit/>
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title={t('group.actions.delete')}>
              <IconButton color="error" onClick={() => handleDeleteGroup(row)}>
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
              onClick={handleNewGroupModal}
            >
              {t('group.actions.add')}
            </Button>
          )
        }
      />
      {openGroupModal && (
        <AddGroupModal
          open={openGroupModal}
          onClose={handleNewGroupModal}
          onSubmit={handleCreateNewGroup}
        />
      )}
      {editPermissionModal && (
        <EditPermission
          open={editPermissionModal}
          onClose={handleEditPermissionModal}
          selectedGroup={selectedGroup}
          onSubmit={handleSavePermissions}
        />
      )}
    </Box>
  );
};

export default GroupList;
