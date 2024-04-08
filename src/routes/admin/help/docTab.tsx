import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card } from 'antd';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../../../components/buttons/CustomButton';
import IconSVG from '../../../components/icons/icons';
import { ADMIN_ROUTE_PATH } from '../../../constants/route';
import CustomInput from '../../../components/input/CustomInput';
import { docApi } from '../../../apis';
import { debounce } from 'lodash';
import TableWrap from '../../../components/TableWrap';
import Column from 'antd/es/table/Column';
import { ActionUser, PERMISSIONS } from '../../../constants/enum';
import { ConfirmDeleteModal } from '../../../components/modals/ConfirmDeleteModal';
import moment from 'moment';
import { FORMAT_DATE_VN } from '../../../constants/common';
import CheckPermission, { Permission } from '../../../util/check-permission';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { CustomHandleSuccess } from '../../../components/response/success';
import { CustomHandleError } from '../../../components/response/error';
import { QUERY_LIST_DOCUMENT } from '../../../util/contanst';

const DocTab = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [status, setStatus] = useState<boolean>();
  const [fullTextSearch, setFullTextSearch] = useState<string>('');
  const [isShowModalDelete, setIsShowModalDelete] = useState<{ id: string; name: string }>();
  const { authUser } = useSelector((state: RootState) => state.auth);
  const [permission, setPermission] = useState<Permission>({
    read: false,
    create: false,
    delete: false,
    update: false,
  });

  useEffect(() => {
    if (authUser?.user?.roles) {
      setPermission({
        read: Boolean(CheckPermission(PERMISSIONS.ReadHelp, authUser)),
        create: Boolean(CheckPermission(PERMISSIONS.CreateHelp, authUser)),
        delete: Boolean(CheckPermission(PERMISSIONS.DeleteHelp, authUser)),
        update: Boolean(CheckPermission(PERMISSIONS.UpdateHelp, authUser)),
      });
    }
  }, [authUser]);

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_LIST_DOCUMENT, { page, size, fullTextSearch, status }],
    queryFn: () => docApi.docsControllerGet(page, status, size, fullTextSearch),
    enabled: true,
    staleTime: 1000,
  });

  const { mutate: DeleteDoc, status: statusDeleteDoc } = useMutation(
    (id: string) => docApi.docsControllerDeleteDocs(id),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries([QUERY_LIST_DOCUMENT]);
        CustomHandleSuccess(ActionUser.DELETE, intl);
      },
      onError: (error: any) => {
        CustomHandleError(error.response.data, intl);
      },
    }
  );

  const handleDelete = () => {
    if (isShowModalDelete && isShowModalDelete.id) {
      DeleteDoc(isShowModalDelete.id);
    }
    setIsShowModalDelete(undefined);
  };

  const debouncedUpdateInputValue = debounce((value) => {
    if (!value.trim()) {
      setFullTextSearch('');
    } else {
      setFullTextSearch(value);
    }
    setPage(1);
  }, 500);

  return (
    <Card id="doc-management">
      <div className="doc-management__header">
        <div className="doc-management__header__title">
          {intl.formatMessage({
            id: 'doc.list.title',
          })}
        </div>
        <CustomButton
          disabled={!permission.create}
          className="button-add"
          icon={<IconSVG type="create" />}
          onClick={() => {
            navigate(ADMIN_ROUTE_PATH.CREATE_DOC_MANAGEMENT);
          }}
        >
          {intl.formatMessage({
            id: 'doc.list.button.add',
          })}
        </CustomButton>
      </div>
      <div className="doc-management__filter">
        <CustomInput
          placeholder={intl.formatMessage({
            id: 'doc.list.search',
          })}
          prefix={<IconSVG type="search" />}
          className="input-search"
          onChange={(e) => {
            if (debouncedUpdateInputValue.cancel) {
              debouncedUpdateInputValue.cancel();
            }
            debouncedUpdateInputValue(e.target.value);
          }}
          allowClear
        />
      </div>
      {permission.read && (
        <TableWrap
          className={`custom-table ${data?.data.content && data?.data.content?.length > 0 && 'table-doc'}`}
          data={data?.data.content}
          // isLoading={isLoading}
          page={page}
          size={size}
          total={data?.data.total}
          setSize={setSize}
          setPage={setPage}
          showPagination={true}
        >
          <Column
            title={intl.formatMessage({
              id: 'doc.list.table.image',
            })}
            dataIndex="image"
            width={'25%'}
            render={(_, record: any) => {
              console.log(record);
              if (record.avatar && record.avatar.preview) {
                return <img className="image-doc" src={process.env.REACT_APP_URL_IMG_S3 + record.avatar.preview} />;
              }
            }}
          />
          <Column
            title={intl.formatMessage({
              id: 'doc.list.table.title',
            })}
            dataIndex="title"
            width={'30%'}
            render={(_, record: any) => {
              return <div className="title-doc">{record.title}</div>;
            }}
          />
          <Column
            title={intl.formatMessage({
              id: 'doc.list.table.createDate',
            })}
            dataIndex="createDate"
            width={'15%'}
            render={(_, record: any) => {
              return <div>{moment(record.createdOnDate).format(FORMAT_DATE_VN)}</div>;
            }}
          />
          {/* <Column
          title={intl.formatMessage({
            id: 'doc.list.table.content',
          })}
          dataIndex="content"
          width={'25%'}
          render={(_, record: any) => {
            return <div className="content-doc" dangerouslySetInnerHTML={{ __html: record.content }}></div>;
          }}
        /> */}
          <Column
            title={intl.formatMessage({
              id: 'doc.list.table.action',
            })}
            dataIndex="action"
            width={'20%'}
            render={(_, record: any) => (
              <div className="action-doc">
                <div
                  className={permission.read ? '' : 'disable'}
                  onClick={() => permission.read && navigate(`detail/${record.id}`)}
                >
                  <IconSVG type="edit" />
                </div>
                <span className="divider"></span>
                <div
                  className={permission.delete ? '' : 'disable'}
                  onClick={() => permission.delete && setIsShowModalDelete({ id: record.id, name: record.title })}
                >
                  <IconSVG type="delete" />
                </div>
              </div>
            )}
            align="center"
          />
        </TableWrap>
      )}
      <ConfirmDeleteModal
        name={isShowModalDelete && isShowModalDelete.name ? isShowModalDelete.name : ''}
        visible={!!isShowModalDelete}
        onSubmit={handleDelete}
        onClose={() => {
          setIsShowModalDelete(undefined);
        }}
      />
    </Card>
  );
};
export default DocTab;
