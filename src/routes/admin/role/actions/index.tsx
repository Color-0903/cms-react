import { Button, Card, Checkbox, Col, Form, Input, Modal, Row, Spin, Table, message } from 'antd';
import Column from 'antd/es/table/Column';
import TableWrap from '../../../../components/TableWrap';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { permissionApi, roleApi } from '../../../../apis';
import { CreateRoleDto, PermissionGroupDto, UpdateRoleDto } from '../../../../apis/client-axios';
import { useCallback, useEffect, useState } from 'react';
import SaveButton from '../../../../components/buttons/SaveButton';
import FormWrap from '../../../../components/FormWrap';
import { useNavigate, useParams } from 'react-router-dom';
import CustomInput from '../../../../components/input/CustomInput';
import { useIntl } from 'react-intl';
import CustomButton from '../../../../components/buttons/CustomButton';
import { ADMIN_ROUTE_NAME } from '../../../../constants/route';
import { ConfirmDeleteModal } from '../../../../components/modals/ConfirmDeleteModal';
import CheckPermission, { Permission } from '../../../../util/check-permission';
import { ActionUser, PERMISSIONS } from '../../../../constants/enum';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { CustomHandleSuccess } from '../../../../components/response/success';
import { CustomHandleError } from '../../../../components/response/error';
import { QUERY_DETAIL_ROLE, QUERY_LIST_ADMIN, QUERY_LIST_USER, QUERY_PERMISSION } from '../../../../util/contanst';

const ActionRole = () => {
  const intl = useIntl();
  const { id } = useParams();
  const [form] = Form.useForm<CreateRoleDto>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isShowModalDelete, setIsShowModalDelete] = useState<{ id: string; name: string | undefined }>();
  const [roleName, setRoleName] = useState<string>();
  const { authUser } = useSelector((state: RootState) => state.auth);
  const [formPermission, setFormPermission] = useState<string[]>([]);
  const [permission, setPermission] = useState<Permission>({
    read: false,
    create: false,
    delete: false,
    update: false,
  });

  useEffect(() => {
    if (authUser?.user?.roles) {
      console.log({ authUser });

      console.log(CheckPermission(PERMISSIONS.ReadRole, authUser));
      setPermission({
        read: Boolean(CheckPermission(PERMISSIONS.ReadRole, authUser)),
        create: Boolean(CheckPermission(PERMISSIONS.CreateRole, authUser)),
        delete: Boolean(CheckPermission(PERMISSIONS.DeleteRole, authUser)),
        update: Boolean(CheckPermission(PERMISSIONS.UpdateRole, authUser)),
      });
    }
  }, [authUser]);

  const { data: dataPermissions, isFetching: loadingPermissions } = useQuery({
    queryKey: [QUERY_PERMISSION],
    queryFn: () => permissionApi.permissionControllerGet(),
    enabled: permission.read,
  });

  const { data: dataRole, isFetching: loadingRole } = useQuery({
    queryKey: [QUERY_DETAIL_ROLE, id],
    queryFn: () => roleApi.roleControllerGetById(id as string),
    enabled: !!id && permission.read,
    onSuccess: ({ data }) => {
      setRoleName(data.name);
      setFormPermission(data.permissions);
    },
  });

  const createRole = useMutation((createRole: CreateRoleDto) => roleApi.roleControllerCreate(createRole), {
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries([QUERY_LIST_USER]);
      queryClient.invalidateQueries([QUERY_LIST_ADMIN]);
      CustomHandleSuccess(ActionUser.CREATE, intl);
      navigate(`/admin/${ADMIN_ROUTE_NAME.ROLE_MANAGEMENT}`);
    },
    onError: (error: any) => {
      CustomHandleError(error.response.data, intl);
    },
  });

  const updateRole = useMutation(
    (updateRole: UpdateRoleDto) => roleApi.roleControllerUpdate(id as string, updateRole),
    {
      onSuccess: ({ data }) => {
        queryClient.invalidateQueries([QUERY_LIST_ADMIN]);
        queryClient.invalidateQueries([QUERY_DETAIL_ROLE, id]);
        CustomHandleSuccess(ActionUser.EDIT, intl);
        navigate(`/admin/${ADMIN_ROUTE_NAME.ROLE_MANAGEMENT}`);
      },
      onError: (error: any) => {
        CustomHandleError(error.response.data, intl);
      },
    }
  );

  const deleteRole = useMutation((id: string) => roleApi.roleControllerDelete(id), {
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries([QUERY_PERMISSION]);
      queryClient.invalidateQueries([QUERY_DETAIL_ROLE, id]);
      CustomHandleSuccess(ActionUser.DELETE, intl);
      navigate(`/admin/${ADMIN_ROUTE_NAME.ROLE_MANAGEMENT}`);
    },
    onError: (error: any) => {
      CustomHandleError(error.response.data, intl);
    },
  });

  const [numOfCol, setNumOfCol] = useState<number>(0);
  const n = (key: keyof CreateRoleDto) => {
    return key;
  };

  useEffect(() => {
    if (dataPermissions) {
      setNumOfCol(
        Math.max.apply(
          Math,
          dataPermissions.data.map((d) => d.permissions.length)
        )
      );
    }
  }, [dataPermissions]);

  useEffect(() => {
    if (dataRole) {
      const role = dataRole.data;
      form.setFieldsValue({
        name: role.name,
        // code: role.code,
        permissions: role.permissions,
      });
    }
  }, [dataRole]);

  const onPermissionChecked = (permissionName: string, checked: boolean, readPermission: string) => {
    const permissions = new Set((form.getFieldValue(n('permissions')) || []) as string[]);
    if (checked) {
      if (!formPermission.includes(readPermission)) {
        const arrPermission = [...formPermission, permissionName, readPermission].filter(
          (item, index) => [...formPermission, permissionName, readPermission].indexOf(item) === index
        );
        setFormPermission(arrPermission);
      } else {
        setFormPermission([...formPermission, permissionName]);
        // permissions.add(permissionName);
      }
    } else {
      // permissions.delete(permissionName);
      setFormPermission(formPermission.filter((item) => item !== permissionName));
    }
    form.setFieldValue(n('permissions'), Array.from(permissions));
  };

  const renderColumn = (index: number, record: PermissionGroupDto) => {
    if (record.permissions[index].name) {
      let i;
      if (index === 0) {
        i = 1;
      } else if (index === 1) {
        i = 0;
      } else {
        i = index;
      }
      const permissionName = record.permissions[i].name;
      console.log(permissionName);
      if (id) {
        if (formPermission && formPermission.length > 0) {
          return (
            <Checkbox
              checked={formPermission && formPermission.includes(permissionName)}
              disabled={
                permissionName === record.permissions[1].name &&
                formPermission &&
                (formPermission.includes(record.permissions[0].name) ||
                  (formPermission.includes(record.permissions[2].name) &&
                    formPermission.includes(record.permissions[3].name)))
              }
              onChange={(e) => {
                onPermissionChecked(permissionName, e.target.checked, record.permissions[1].name);
              }}
            />
          );
        }
      } else {
        return (
          <Checkbox
            disabled={
              permissionName === record.permissions[1].name &&
              formPermission &&
              (formPermission.includes(record.permissions[0].name) ||
                (formPermission.includes(record.permissions[2].name) &&
                  formPermission.includes(record.permissions[3].name)))
            }
            checked={formPermission && formPermission.includes(permissionName)}
            onChange={(e) => {
              onPermissionChecked(permissionName, e.target.checked, record.permissions[1].name);
            }}
          />
        );
      }
    } else {
      return <></>;
    }
  };

  const handleDeleteRole = () => {
    if (isShowModalDelete && isShowModalDelete.id) {
      deleteRole.mutate(isShowModalDelete.id);
      setIsShowModalDelete(undefined);
    }
  };

  const onFinish = (values: any) => {
    id
      ? updateRole.mutate({
          ...values,
          permissions: formPermission,
        })
      : createRole.mutate({
          ...values,
          formPermission,
        });
  };

  const getAction = (col: number) => {
    switch (col) {
      case 0:
        return intl.formatMessage({
          id: 'role.create.read',
        });
      case 1:
        return intl.formatMessage({
          id: 'role.create.create',
        });
      case 2:
        return intl.formatMessage({
          id: 'role.create.edit',
        });
      case 3:
        return intl.formatMessage({
          id: 'role.create.delete',
        });
      default:
        return '';
    }
  };

  return (
    <Card id="create-role-management">
      <Spin
        className="custom-spin"
        size="large"
        spinning={
          loadingPermissions || loadingRole || createRole.isLoading || updateRole.isLoading || deleteRole.isLoading
        }
      >
        {/* <SaveButton className="float-end" onClick={form.submit} /> */}
        <div className="create-role-title">
          {id
            ? intl.formatMessage({
                id: 'role.edit.title',
              })
            : intl.formatMessage({
                id: 'role.create.title',
              })}
        </div>
        <FormWrap form={form} onFinish={onFinish} layout="vertical" className="form-create-role">
          <Form.Item
            className="role"
            label={intl.formatMessage({
              id: 'role.create.role',
            })}
            name={n('name')}
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'role.input.err',
                }),
              },
              // {
              //   pattern: /^(?![\s])[\s\S]*$/,
              //   message: intl.formatMessage({
              //     id: 'common.noti.space',
              //   }),
              // },
              {
                pattern: /^[^!@#$%^&%^&*+=\\_\-{}[/()|;:'".,>?<]*$/,
                message: intl.formatMessage({
                  id: 'common.noti.special',
                }),
              },
            ]}
          >
            <CustomInput />
          </Form.Item>
        </FormWrap>

        <TableWrap className="custom-table" data={dataPermissions?.data} showPagination={false}>
          <Column
            title={
              <span className="">
                {intl.formatMessage({
                  id: 'role.create.role',
                })}
              </span>
            }
            key={'label'}
            dataIndex={'label'}
            render={(value, record) => {
              return <>{intl.formatMessage({ id: `role.permission.${value}` })}</>;
            }}
          ></Column>
          {[...Array(numOfCol)].map((x, i) => (
            <Column<PermissionGroupDto>
              title={
                <span className="">
                  {intl.formatMessage({
                    id: getAction(i),
                  })}
                </span>
              }
              align="center"
              key={`col-${i}`}
              render={(value, record) => <div className="custom-checkbox item-center">{renderColumn(i, record)}</div>}
            ></Column>
          ))}
        </TableWrap>
        <div className="button-action">
          {id ? (
            <div className="more-action">
              <CustomButton className="button-save" onClick={() => form.submit()} disabled={!permission.update}>
                {intl.formatMessage({
                  id: 'role.edit.button.save',
                })}
              </CustomButton>
              <CustomButton
                className="button-delete"
                onClick={() => setIsShowModalDelete({ id: id, name: roleName })}
                disabled={!permission.delete}
              >
                {intl.formatMessage({
                  id: 'role.edit.button.delete',
                })}
              </CustomButton>
            </div>
          ) : (
            <CustomButton className="button-create" onClick={() => form.submit()} disabled={!permission.create}>
              {intl.formatMessage({
                id: 'role.create.button.create',
              })}
            </CustomButton>
          )}
        </div>
        <ConfirmDeleteModal
          name={isShowModalDelete && isShowModalDelete.name ? isShowModalDelete.name : ''}
          visible={!!isShowModalDelete}
          onSubmit={handleDeleteRole}
          onClose={() => {
            setIsShowModalDelete(undefined);
          }}
        />
      </Spin>
    </Card>
  );
};

export default ActionRole;
