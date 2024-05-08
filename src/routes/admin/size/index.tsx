import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Spin } from 'antd';
import { useForm } from 'antd/es/form/Form';
import Column from 'antd/es/table/Column';
import { FormInstance } from 'antd/lib/form/Form';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { sizeApi } from '../../../apis';
import { CreateColorDto, CreateSizeDto, UpdateColorDto, UpdateSizeDto } from '../../../apis/client-axios';
import TableWrap from '../../../components/TableWrap';
import CustomButton from '../../../components/buttons/CustomButton';
import IconSVG from '../../../components/icons/icons';
import CustomInput from '../../../components/input/CustomInput';
import { ConfirmModel } from '../../../components/modals/ConfirmModel';
import CreateModal from '../../../components/modals/CreateModal';
import { ActionUser } from '../../../constants/enum';
import { QUERY_DETAIL_COLOR, QUERY_LIST_CATEGPRY } from '../../../util/contanst';
import { helper } from '../../../util/helper';
import { debounce } from 'lodash';

const SizeList = () => {
  const navigate = useNavigate();
  const intl = useIntl();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [fullTextSearch, setFullTextSearch] = useState<string>('');
  const [isSelect, setIsSelect] = useState<{ id: string; name: string | undefined; showRemove?: boolean }>();
  const [form] = useForm<FormInstance>();
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_LIST_CATEGPRY, { page, size, fullTextSearch }],
    queryFn: () => sizeApi.sizeControllerGetAll(page, size, undefined, fullTextSearch),
    enabled: true,
    staleTime: 1000,
  });

  const { data: _data, isLoading: _isLoading } = useQuery({
    queryKey: [QUERY_DETAIL_COLOR, isSelect?.id],
    queryFn: () => sizeApi.sizeControllerGetById(isSelect?.id as string),
    onSuccess: ({ data }) => {
      form.setFieldsValue(data as any);
    },
    enabled: !!isSelect?.id && !!isOpen,
    staleTime: 1000,
  });

  const { mutate: Update, isLoading: isUpdate } = useMutation(
    (dto: UpdateSizeDto) => sizeApi.sizeControllerUpdate(isSelect?.id as string, dto),
    {
      onSuccess: (data: any) => {
        setIsOpen(false);
        queryClient.invalidateQueries([QUERY_LIST_CATEGPRY]);
        helper.showSuccessMessage(ActionUser.EDIT, intl);
      },
      onError: (error: any) => {
        helper.showErroMessage(error?.response?.data, intl);
      },
    }
  );

  const { mutate: Create, isLoading: isCreate } = useMutation(
    (dto: CreateSizeDto) => sizeApi.sizeControllerCreate(dto),
    {
      onSuccess: (data: any) => {
        setIsOpen(false);
        queryClient.invalidateQueries([QUERY_LIST_CATEGPRY]);
        helper.showSuccessMessage(ActionUser.CREATE, intl);
      },
      onError: (error: any) => {
        helper.showErroMessage(error?.response?.data, intl);
      },
    }
  );

  const { mutate: Delete, isLoading: isDelete } = useMutation((id: string) => sizeApi.sizeControllerDelete(id), {
    onSuccess: (data: any) => {
      setIsOpen(false);
      queryClient.invalidateQueries([QUERY_LIST_CATEGPRY]);
      helper.showSuccessMessage(ActionUser.DELETE, intl);
    },
    onError: (error: any) => {
      helper.showErroMessage(error?.response?.data, intl);
    },
  });

  const debouncedUpdateInputValue = debounce((value) => {
    if (!value.trim()) {
      setFullTextSearch('');
    } else {
      setFullTextSearch(value);
    }
    setPage(1);
  }, 500);

  const onClose = () => {
    setIsOpen(false);
    setIsSelect(undefined);
    form.resetFields();
  };

  const onDelete = () => {
    if (isSelect?.id) {
      Delete(isSelect.id);
      setIsSelect(undefined);
    }
  };

  const onSubmit = () => {
    const params = form.getFieldsValue();
    if (!!isSelect?.id) {
      Update(params as any);
    } else {
      Create(params as any);
    }
    form.resetFields();
  };

  return (
    <Spin spinning={isCreate || isUpdate || isLoading || (isOpen && _isLoading)}>
      <Card>
        <div className="d-flex justify-content-between align-items-center">
          <div className="font-weight-700 font-size-18 font-base"> {intl.formatMessage({ id: 'size.title' })}</div>
          <CustomButton icon={<PlusOutlined />} onClick={() => setIsOpen(true)}>
            {intl.formatMessage({ id: 'common.create' })}
          </CustomButton>
        </div>
        <CustomInput
          onChange={(e) => debouncedUpdateInputValue(e.target?.value?.trim())}
          placeholder={intl.formatMessage({ id: 'common.search' })}
          prefix={<SearchOutlined />}
          className="w-44 mt-32"
        />
        <TableWrap
          className="custom-table mt-32"
          data={data?.data.content}
          isLoading={isLoading}
          page={page}
          size={size}
          total={data?.data.total}
          setSize={setSize}
          setPage={setPage}
          showPagination={true}
        >
          <Column
            title={intl.formatMessage({
              id: 'table.index',
            })}
            width={'15%'}
            render={(_, record, index) => <>{helper.renderIndex(page, index + 1)}</>}
          />
          <Column
            title={intl.formatMessage({
              id: 'table.name',
            })}
            dataIndex="name"
          />
          <Column
            title={intl.formatMessage({
              id: 'table.des',
            })}
            dataIndex="description"
          />
          <Column
            title={intl.formatMessage({
              id: 'table.action',
            })}
            dataIndex="action"
            width={'15%'}
            render={(_, record: any) => (
              <div className="d-flex justify-content-center align-items-center gap-2">
                <div
                  onClick={() => {
                    setIsSelect({ id: record.id, name: record.name });
                    setIsOpen(true);
                  }}
                  className="pointer"
                >
                  <IconSVG type="edit" />
                </div>
                <div
                  onClick={() => setIsSelect({ id: record.id, name: record.name, showRemove: true })}
                  className="pointer"
                >
                  <IconSVG type="delete" />
                </div>
              </div>
            )}
            align="center"
          />
        </TableWrap>
      </Card>

      <CreateModal alias="size" isOpen={isOpen} onSubmit={onSubmit} onClose={onClose} form={form} />

      <ConfirmModel visible={!!isSelect?.showRemove} onSubmit={onDelete} onClose={() => setIsSelect(undefined)} />
    </Spin>
  );
};
export default SizeList;
