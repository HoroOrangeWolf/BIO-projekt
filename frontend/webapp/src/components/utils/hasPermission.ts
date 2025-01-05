import { useSelector } from 'react-redux';

function useHasPermission(codename: string) {
  const user = useSelector((state: any) => state.auth.user);

  if (user.is_superuser) return true;

  const userPermissionCodenames = user.user_permissions?.map((perm: { codename: string }) => perm.codename) || [];

  const groupPermissionCodenames = user.groups?.flatMap(
    (group: { permissions?: { codename: string }[] }) => group.permissions?.map((perm: { codename: string }) => perm.codename) || [],
  ) || [];

  const allPermissions = new Set([...userPermissionCodenames, ...groupPermissionCodenames]);

  return allPermissions.has(codename);
}

export default useHasPermission;
