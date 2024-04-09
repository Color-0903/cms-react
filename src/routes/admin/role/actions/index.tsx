import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Checkbox, Form, Spin } from 'antd';
import Column from 'antd/es/table/Column';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { permissionApi, roleApi } from '../../../../apis';
import { CreateRoleDto, PermissionGroupDto, UpdateRoleDto } from '../../../../apis/client-axios';
import FormWrap from '../../../../components/FormWrap';
import TableWrap from '../../../../components/TableWrap';
import CustomButton from '../../../../components/buttons/CustomButton';
import CustomInput from '../../../../components/input/CustomInput';
import { ConfirmModel } from '../../../../components/modals/ConfirmModel';
import { ActionUser } from '../../../../constants/enum';
import { ADMIN_ROUTE_NAME } from '../../../../constants/route';
import { QUERY_DETAIL_ROLE, QUERY_LIST_ADMIN, QUERY_LIST_USER, QUERY_PERMISSION } from '../../../../util/contanst';
import { helper } from '../../../../util/helper';

const ActionRole = () => {
  const intl = useIntl();
  const { id } = useParams();
  const [form] = Form.useForm<CreateRoleDto>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isShowModal, setIsShowModal] = useState<{ id: string; name: string | undefined }>();
  const [roleName, setRoleName] = useState<string>();
  const [formPermission, setFormPermission] = useState<string[]>([]);

  const { data: dataPermissions, isFetching: loadingPermissions } = useQuery({
    queryKey: [QUERY_PERMISSION],
    queryFn: () => permissionApi.permissionControllerGet(),
  });

  const { data: dataRole, isFetching: loadingRole } = useQuery({
    queryKey: [QUERY_DETAIL_ROLE, id],
    queryFn: () => roleApi.roleControllerGetById(id as string),
    enabled: !!id,
    onSuccess: ({ data }) => {
      setRoleName(data.name);
      setFormPermission(data.permissions);
    },
  });

  const createRole = useMutation((createRole: CreateRoleDto) => roleApi.roleControllerCreate(createRole), {
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries([QUERY_LIST_USER]);
      queryClient.invalidateQueries([QUERY_LIST_ADMIN]);
      helper.showSuccessMessage(ActionUser.CREATE, intl);
      navigate(`/admin/${ADMIN_ROUTE_NAME.ROLE_MANAGEMENT}`);
    },
    onError: (error: any) => {
      helper.showErroMessage(error.response.data, intl);
    },
  });

  const updateRole = useMutation(
    (updateRole: UpdateRoleDto) => roleApi.roleControllerUpdate(id as string, updateRole),
    {
      onSuccess: ({ data }) => {
        queryClient.invalidateQueries([QUERY_LIST_ADMIN]);
        queryClient.invalidateQueries([QUERY_DETAIL_ROLE, id]);
        helper.showSuccessMessage(ActionUser.EDIT, intl);
        navigate(`/admin/${ADMIN_ROUTE_NAME.ROLE_MANAGEMENT}`);
      },
      onError: (error: any) => {
        helper.showErroMessage(error.response.data, intl);
      },
    }
  );

  const deleteRole = useMutation((id: string) => roleApi.roleControllerDelete(id), {
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries([QUERY_PERMISSION]);
      queryClient.invalidateQueries([QUERY_DETAIL_ROLE, id]);
      helper.showSuccessMessage(ActionUser.DELETE, intl);
      navigate(`/admin/${ADMIN_ROUTE_NAME.ROLE_MANAGEMENT}`);
    },
    onError: (error: any) => {
      helper.showErroMessage(error.response.data, intl);
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
    if (isShowModal && isShowModal.id) {
      deleteRole.mutate(isShowModal.id);
      setIsShowModal(undefined);
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
          id: 'role.view',
        });
      case 1:
        return intl.formatMessage({
          id: 'role.create',
        });
      case 2:
        return intl.formatMessage({
          id: 'role.edit',
        });
      case 3:
        return intl.formatMessage({
          id: 'role.delete',
        });
      default:
        return '';
    }
  };

  return (
    <Spin spinning={!!(loadingRole && id)}>
      <Card>
        <div className='font-weight-700 font-size-18 font-base'> {intl.formatMessage({ id: 'role.detail.title' })} </div>
        <FormWrap form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            className="font-weight-500 font-size-14 font-base mt-32"
            label={intl.formatMessage({ id: 'role.name' })}
            name={n('name')}>
            <CustomInput className='w-44' />
          </Form.Item>
        </FormWrap>

        <TableWrap className="custom-table mt-32" data={dataPermissions?.data} showPagination={false}>
          <Column
            title={
              <span className="">
                {intl.formatMessage({
                  id: 'role.name',
                })}
              </span>
            }
            key={'label'}
            dataIndex={'label'}
            render={(value, record) => {
              return <>{value}</>;
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
        <div className="d-flex justify-content-end mt-32">
          {id ? (
            <div className="d-flex gap-2">
              <CustomButton
                onClick={() => setIsShowModal({ id: id, name: roleName })}>
                {intl.formatMessage({ id: 'role.delete' })}
              </CustomButton>
              <CustomButton
                type='primary'
                onClick={() => form.submit()}>
                {intl.formatMessage({ id: 'role.edit' })}
              </CustomButton>
            </div>
          ) : (
            <CustomButton onClick={() => form.submit()}>
              {intl.formatMessage({
                id: 'role.create',
              })}
            </CustomButton>
          )}
        </div>
        <ConfirmModel
          visible={!!isShowModal}
          onSubmit={handleDeleteRole}
          onClose={() => {
            setIsShowModal(undefined);
          }}
        />
      </Card>
    </Spin>
  );
};

export default ActionRole;
