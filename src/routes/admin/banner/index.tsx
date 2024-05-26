import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, FormInstance, Image, Spin, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { useForm } from 'antd/es/form/Form';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { assetsApi, bannerApi } from '../../../apis';
import { CreateBannerDto, UpdateBannerDto } from '../../../apis/client-axios';
import FormWrap from '../../../components/FormWrap';
import CustomButton from '../../../components/buttons/CustomButton';
import { ActionUser } from '../../../constants/enum';
import { QUERY_LIST_BANNER } from '../../../util/contanst';
import { helper } from '../../../util/helper';
import { regexImage } from '../../../util/regex';

const BannerList: React.FC = () => {
  const intl = useIntl();
  const [form] = useForm<FormInstance>();
  const queryClient = useQueryClient();
  const [list, setList] = useState([]);
  const [assetSelect, setAssetSelect] = useState<any>(undefined);

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_LIST_BANNER],
    queryFn: () => bannerApi.bannerControllerGetAll(),
    onSuccess: ({ data }) => {
      setList(data as any);
    },
    enabled: true,
    staleTime: 1000,
  });

  const { mutate: Update, isLoading: isUpdate } = useMutation(
    (dto: { id: string; dto: UpdateBannerDto }) => bannerApi.bannerControllerUpdate(dto.id, dto.dto),
    {
      onSuccess: (data: any) => {
        helper.showSuccessMessage(ActionUser.EDIT, intl);
        queryClient.invalidateQueries([QUERY_LIST_BANNER]);
      },
      onError: (error: any) => {
        helper.showErroMessage(error?.response?.data, intl);
      },
    }
  );

  const { mutate: Create, isLoading: isCreate } = useMutation(
    (dto: CreateBannerDto) => bannerApi.bannerControllerCreate(dto),
    {
      onSuccess: (data: any) => {
        helper.showSuccessMessage(ActionUser.CREATE, intl);
        queryClient.invalidateQueries([QUERY_LIST_BANNER]);
      },
      onError: (error: any) => {
        helper.showErroMessage(error?.response?.data, intl);
      },
    }
  );

  const { mutate: UploadFile, isLoading: isLoadingUploadFile } = useMutation(
    (file: File) => assetsApi.assetControllerUploadFile(file),
    {
      onSuccess: async ({ data }: any) => {
        if (!!assetSelect) {
          Update({ id: assetSelect?.id, dto: { ...assetSelect, asset: data } });
        } else {
          Create({ index: (list?.length ?? 0) + 1, asset: data });
        }
      },
    }
  );

  const customRequest = async (options: any) => {
    const { file, onSuccess, onError } = options;
    if (!file || regexImage.test(file.name)) {
      helper.showErroMessage('validate.not.support', intl);
      return;
    }
    UploadFile(file);
  };

  const handleOnFinish = (values: any) => {};
  return (
    <Spin spinning={isCreate || isUpdate || isLoadingUploadFile}>
      <Card>
        <FormWrap form={form} layout="vertical" onFinish={handleOnFinish} className="pb-5">
          <div className="d-flex justify-content-between">
            <span className="font-weight-700 font-size-18 font-base">{intl.formatMessage({ id: 'banner.title' })}</span>
            <ImgCrop rotationSlider>
              <Upload showUploadList={false} customRequest={customRequest}>
                <CustomButton
                  icon={<PlusOutlined />}
                  onClick={() => setAssetSelect(undefined)}
                  disabled={list?.length > 3}
                >
                  {intl.formatMessage({ id: 'common.create' })}
                </CustomButton>
              </Upload>
            </ImgCrop>
          </div>

          <div className="mt-32 d-flex align-item-center">
            {list?.map((banner: any) => {
              return (
                <div className="col-3 px-2">
                  <Image className="rounded" src={helper?.getSourceFile(banner?.asset?.source)} />
                  <div className="text-center">
                    <ImgCrop rotationSlider>
                      <Upload showUploadList={false} customRequest={customRequest}>
                        <Button onClick={() => setAssetSelect(banner)}>
                          <UploadOutlined />
                        </Button>
                      </Upload>
                    </ImgCrop>
                  </div>
                </div>
              );
            })}
          </div>
        </FormWrap>
      </Card>
    </Spin>
  );
};

export default BannerList;
