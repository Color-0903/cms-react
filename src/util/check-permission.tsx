interface Role {
  id: string;
  name: string;
  permissions: string[];
}

export interface Permission {
  read?: boolean;
  create?: boolean;
  update?: boolean;
  delete?: boolean;
}

const CheckPermission = (permission: string, authUser?: any) => {
  // const { authUser } = useSelector((state: RootState) => state.auth);
  const roles: Role[] = authUser.user.roles;
  if (roles && roles.length > 0) {
    return roles.some((role) => role.permissions.includes(permission));
  }
};

export default CheckPermission;
