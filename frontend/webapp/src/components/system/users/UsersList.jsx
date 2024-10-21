import React, {useEffect, useMemo, useState} from "react";
import {
  Box,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import AccessibleIcon from '@mui/icons-material/Accessible';
import {useTranslation} from "react-i18next";
import MaterialTable from "../../utils/MaterialTable.jsx";
import {getUsers, patchUsers, postUsers} from "../../services/api.js";
import {AddNewUserModal} from "./components/AddNewUserModal.jsx";
import {EditUserGroups} from "./components/EditUserGroups.jsx";
import {editUserSchema} from "../../validations/usersSchemas.js";
import GroupIcon from '@mui/icons-material/Group';
import LockIcon from '@mui/icons-material/Lock';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';

function UsersList() {
  const [users, setUsers] = useState([]);
  const [newUserModal, setNewUserModal] = useState(false);
  const [editGroupsModal, setEditGroupsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const {t} = useTranslation("system");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [totalRows, setTotalRows] = useState(0);
  const handleNewUserModal = () => setNewUserModal(!newUserModal);
  const handleEditGroupsModal = () => setEditGroupsModal(!editGroupsModal);

  const fetchUsers = async (page, pageSize) => {
    try {
      const response = await getUsers(page + 1, pageSize);
      setUsers(response.data.results);
      setTotalRows(response.data.count);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers(pagination.pageIndex, pagination.pageSize);
  }, [pagination.pageIndex, pagination.pageSize]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "first_name",
        header: t("user.first_name"),
        size: 150,
      },
      {
        accessorKey: "last_name",
        header: t("user.last_name"),
        size: 150,
      },
      {
        accessorKey: "username",
        header: t("user.username"),
        enableEditing: false,
      },
      {
        accessorKey: "email",
        header: t("user.email")
      },
      {
        accessorKey: "is_active",
        header: t("user.is_active"),
        enableEditing: false,
        Cell: ({cell}) => (
          cell.getValue() ? <CheckIcon/> : <DoDisturbIcon/>
        )
      }
    ],
    []
  );

  const handleDeleteUser = () => {
  }

  const handleCreateNewUser = async (data) => {
    await postUsers(data);
  }

  const handleSaveRowEdits = async ({exitEditingMode, row, values}) => {
    try {
      await editUserSchema.validate(values, {abortEarly: false});
      await patchUsers(row.original.id, values);
      exitEditingMode();
    } catch (err) {
      console.log(err);
    }
  };

  const handleSaveUserGroups = async (data) => {
    await patchUsers(data.id, data);
  }

  const handleLockUser = async (row) => {
    await patchUsers(row.original.id, {is_active: !row.original.is_active}).then(() => {
      fetchUsers(pagination.pageIndex, pagination.pageSize);
    })
  }

  const handleEditGroup = ({original}) => {
    setSelectedUser(original);
    handleEditGroupsModal();
  }


  return (
    <>
      <MaterialTable
        columns={columns}
        data={users}
        onEditingRowSave={handleSaveRowEdits}
        manualPagination
        rowCount={totalRows}
        onPaginationChange={setPagination}
        pagination={pagination}
        renderRowActions={({row, table}) => (
          <Box sx={{display: 'flex', gap: '1rem'}}>
            <Tooltip arrow placement="top" title={t("user.actions.edit_groups")}>
              <IconButton onClick={() => handleEditGroup(row)}>
                <GroupIcon/>
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="top" title={t("user.actions.lock")}>
              <IconButton onClick={() => handleLockUser(row)}>
                <LockIcon/>
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="top" title={t("user.actions.edit")}>
              <IconButton onClick={() => table.setEditingRow(row)}>
                <EditIcon/>
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="top" title={t("user.actions.delete")}>
              <IconButton color="error" onClick={() => handleDeleteUser(row)}>
                <DeleteIcon/>
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
              {t("user.actions.add_user")}
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
      {editGroupsModal && (
        <EditUserGroups
          open={editGroupsModal}
          onClose={handleEditGroupsModal}
          onSubmit={handleSaveUserGroups}
          selectedUser={selectedUser}
        />
      )}
    </>
  );
}

export default UsersList;
