import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import GroupIcon from '@mui/icons-material/Group';
import LockIcon from '@mui/icons-material/Lock';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { getUsers, patchUsers, postUsers } from '@main/components/services/api.ts';
import { editUserSchema } from '@main/components/validations/usersSchemas.ts';
import MaterialTable from '@main/components/utils/MaterialTable.tsx';
import { AddNewUserModal, AddUserFormType } from '@main/components/system/users/components/AddNewUserModal.tsx';
import { EditUserGroups } from '@main/components/system/users/components/EditUserGroups.tsx';
import { UserModelType } from '@main/components/services/types.ts';
import ConfirmRemoveUserModal from '@main/components/system/users/components/ConfirmRemoveUserModal.tsx';
import UpdateUserModal from '@main/components/system/users/components/UpdateUserModal.tsx';

const UsersList = () => {
  const { t } = useTranslation(['system']);
  const [users, setUsers] = useState<UserModelType[]>([]);
  const [newUserModal, setNewUserModal] = useState(false);
  const [editGroupsModal, setEditGroupsModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState<UserModelType>();
  const [userToRemove, setUserToRemove] = useState<UserModelType>();
  const [selectedUser, setSelectedUser] = useState<{ groups: number[], id: string }>({ groups: [], id: '' });
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [totalRows, setTotalRows] = useState(0);
  const handleNewUserModal = () => setNewUserModal(!newUserModal);
  const handleEditGroupsModal = () => setEditGroupsModal(!editGroupsModal);

  const fetchUsers = async (page: number, pageSize: number) => {
    try {
      const response = await getUsers(page, pageSize);
      setUsers(response.data.results);
      setTotalRows(response.data.count);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers(pagination.pageIndex, pagination.pageSize)
      .catch(console.error);
  }, [pagination.pageIndex, pagination.pageSize]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'first_name',
        header: t('user.first_name'),
        size: 150,
      },
      {
        accessorKey: 'last_name',
        header: t('user.last_name'),
        size: 150,
      },
      {
        accessorKey: 'username',
        header: t('user.username'),
        enableEditing: false,
      },
      {
        accessorKey: 'email',
        header: t('user.email'),
      },
      {
        accessorKey: 'is_active',
        header: t('user.is_active'),
        enableEditing: false,
        // eslint-disable-next-line react/no-unstable-nested-components
        Cell: ({ cell }: any) => (
          cell.getValue() ? <CheckIcon /> : <DoDisturbIcon />
        ),
      },
    ],
    [],
  );

  const handleCreateNewUser = async (data: AddUserFormType) => {
    const { doctorDetails, ...user } = data;

    await postUsers({
      user,
      details: doctorDetails,
    });

    fetchUsers(pagination.pageIndex, pagination.pageSize)
      .catch(console.error);
  };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }: any) => {
    try {
      await editUserSchema.validate(values, { abortEarly: false });
      await patchUsers(row.original.id, values);
      exitEditingMode();
    } catch (err) {
      console.log(err);
    }
  };

  const handleSaveUserGroups = async (data: any) => {
    await patchUsers(data.id, data);
  };

  const handleLockUser = async (row: any) => {
    await patchUsers(row.original.id, { is_active: !row.original.is_active }).then(() => {
      fetchUsers(pagination.pageIndex, pagination.pageSize);
    });
  };

  const handleEditGroup = ({ original }: any) => {
    setSelectedUser(original);
    handleEditGroupsModal();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <MaterialTable
        columns={columns}
        data={users}
        onEditingRowSave={handleSaveRowEdits}
        manualPagination
        rowCount={totalRows}
        onPaginationChange={setPagination}
        pagination={pagination}
        renderRowActions={({ row }: any) => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Tooltip arrow placement="top" title={t('user.actions.edit_groups')}>
              <IconButton onClick={() => handleEditGroup(row)}>
                <GroupIcon />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="top" title={t('user.actions.lock')}>
              <IconButton onClick={() => handleLockUser(row)}>
                <LockIcon />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="top" title={t('user.actions.edit')}>
              <IconButton onClick={() => {
                setUserToEdit(() => row.original);
              }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="top" title={t('user.actions.delete')}>
              <IconButton color="error" onClick={() => setUserToRemove(row.original)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={
          () => (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleNewUserModal}
            >
              {t('user.actions.add_user')}
            </Button>
          )
        }
      />
      {newUserModal && (
        <AddNewUserModal
          open={newUserModal}
          onClose={handleNewUserModal}
          onSubmit={handleCreateNewUser}
        />
      )}
      {userToRemove && (
        <ConfirmRemoveUserModal
          userModel={userToRemove}
          onClose={() => {
            setUserToRemove(undefined);
            fetchUsers(pagination.pageIndex, pagination.pageSize)
              .catch(console.error);
          }}
        />
      )}
      {userToEdit && (
        <UpdateUserModal
          userToUpdate={userToEdit}
          onClose={() => {
            setUserToEdit(undefined);
            fetchUsers(pagination.pageIndex, pagination.pageSize)
              .catch(console.error);
          }}
        />
      )}
      {editGroupsModal && (
        <EditUserGroups
          open={editGroupsModal}
          onClose={handleEditGroupsModal}
          onSubmit={handleSaveUserGroups}
          selectedUser={selectedUser}
        />
      )}
    </Box>
  );
};

export default UsersList;
