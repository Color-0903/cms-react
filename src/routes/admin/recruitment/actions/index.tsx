import { Editor } from '@tinymce/tinymce-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Form, Spin, Switch } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { recruitApi } from '../../../../apis';
import { CreateRecruitDto, UpdateRecruitDto } from '../../../../apis/client-axios';
import CustomButton from '../../../../components/buttons/CustomButton';
import CustomInput from '../../../../components/input/CustomInput';
import { ADMIN_ROUTE_NAME } from '../../../../constants/route';
import { CustomHandleSuccess } from '../../../../components/response/success';
import { ActionUser, PERMISSIONS } from '../../../../constants/enum';
import { CustomHandleError } from '../../../../components/response/error';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import CheckPermission, { Permission } from '../../../../util/check-permission';
import { ConfirmDeleteModal } from '../../../../components/modals/ConfirmDeleteModal';
import { QUERY_LIST_RECRUITMENT, QUERY_RECRUITMENT_DETAIL } from '../../../../util/contanst';

const ActionRecruitment = () => {
  const intl = useIntl();
  const { id } = useParams();
  const [form] = Form.useForm<any>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteRecruitment, setIsDeleteRecruitment] = useState<boolean>(false);
  const [loadingImg, setLoadingImg] = useState<boolean>(false);
  const [dataEditor, setDataEditor] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [status, setStatus] = useState<boolean>(true);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [loadingImgOnEditor, setLoadingImgOnEditor] = useState<boolean>(false);
  const { authUser } = useSelector((state: RootState) => state.auth);
  const [permission, setPermission] = useState<Permission>({
    read: false,
    create: false,
    delete: false,
    update: false,
  });

  useEffect(() => {
    if (authUser?.user?.roles) {
      console.log();
      setPermission({
        read: Boolean(CheckPermission(PERMISSIONS.ReadRecruit, authUser)),
        create: Boolean(CheckPermission(PERMISSIONS.UpdateRecruit, authUser)),
        delete: Boolean(CheckPermission(PERMISSIONS.UpdateRecruit, authUser)),
        update: Boolean(CheckPermission(PERMISSIONS.UpdateRecruit, authUser)),
      });
    }
  }, [authUser]);

  const { data: dataRecruitment, isFetching: loadingData } = useQuery(
    [QUERY_RECRUITMENT_DETAIL, id],
    () => recruitApi.recruitControllerGetDetail(id as string),
    {
      onError: (error) => {},
      onSuccess: (response) => {
        setTitle(response.data.title || '');
        setDataEditor(response.data.content || '');
        setStatus(response.data.isVisible);
      },
      enabled: !!id,
      refetchOnWindowFocus: false,
    }
  );

  const {
    mutate: DeleteRecruit,
    status: statusDeleteRecruit,
    isLoading: deleteLoading,
  } = useMutation((id: string) => recruitApi.recruitControllerDeleteRecruit(id), {
    onSuccess: (data) => {
      queryClient.invalidateQueries([QUERY_LIST_RECRUITMENT]);
      navigate(`/admin/${ADMIN_ROUTE_NAME.RECRUIMENT_MANAGEMENT}`);
      CustomHandleSuccess(ActionUser.DELETE, intl);
    },
    onError: (error: any) => {
      CustomHandleError(error.response.data, intl);
    },
  });

  const {
    mutate: recruitCreate,
    status: statusCreateRecruit,
    isLoading: createLoading,
  } = useMutation((createRecruit: CreateRecruitDto) => recruitApi.recruitControllerCreateRecruit(createRecruit), {
    onSuccess: ({ data }) => {
      navigate(`/admin/${ADMIN_ROUTE_NAME.RECRUIMENT_MANAGEMENT}`);
      CustomHandleSuccess(ActionUser.CREATE, intl);
    },
    onError: (error: any) => {
      CustomHandleError(error.response.data, intl);
    },
  });

  const {
    mutate: recruitUpdate,
    status: statusUpdateRecruit,
    isLoading: updateLoading,
  } = useMutation(
    (updateRecruit: UpdateRecruitDto) => recruitApi.recruitControllerUpdateRecruit(id as string, updateRecruit),
    {
      onSuccess: ({ data }) => {
        navigate(`/admin/${ADMIN_ROUTE_NAME.RECRUIMENT_MANAGEMENT}`);
        CustomHandleSuccess(ActionUser.EDIT, intl);
      },
      onError: (error: any) => {
        CustomHandleError(error.response.data, intl);
      },
    }
  );

  const onFinish = () => {
    setIsSubmit(true);
    if (title.trim() === '' || dataEditor === '') {
      return;
    }
    if (id) {
      recruitUpdate({
        title: title,
        content: dataEditor,
        isVisible: status,
      });
    } else {
      recruitCreate({
        title: title,
        content: dataEditor,
        isVisible: status,
      });
    }
  };

  const handleDelete = () => {
    if (isDeleteRecruitment && id) {
      DeleteRecruit(id);
    }
    setIsDeleteRecruitment(false);
  };

  const handleChangeEditor = (content: any, editor: any) => {
    setDataEditor(content);
  };

  const uploadFunction = (blobInfo: any, progress: any) =>
    new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.withCredentials = false;
      const token = localStorage.getItem('token');
      xhr.open('POST', `${process.env.REACT_APP_API_URL}/assets/upload`);
      xhr.setRequestHeader('Authorization', token || '');
      xhr.upload.onprogress = (e) => {
        progress((e.loaded / e.total) * 100);
      };

      xhr.onload = () => {
        if (xhr.status === 403) {
          reject({ message: 'HTTP Error: ' + xhr.status, remove: true });
          return;
        }

        if (xhr.status < 200 || xhr.status >= 300) {
          reject('HTTP Error: ' + xhr.status);
          return;
        }

        const json = JSON.parse(xhr.responseText);

        if (!json) {
          reject('Invalid JSON: ' + xhr.responseText);
          return;
        }

        resolve(process.env.REACT_APP_URL_IMG_S3 + json?.preview);
      };

      xhr.onerror = () => {
        reject('Image upload failed due to a XHR Transport error. Code: ' + xhr.status);
      };

      const formData = new FormData();
      formData.append('file', blobInfo.blob());
      formData.append('s3FilePath', 'recruit');

      xhr.send(formData);
    });

  return (
    <Card id="create-recruit-management">
      <Spin
        className="custom-spin"
        size="large"
        spinning={loadingData || createLoading || updateLoading || deleteLoading}
      >
        <div className="container-recruit">
          <div
            className={`left-container ${isSubmit && dataEditor === '' && 'content-error'} ${
              loadingImgOnEditor && 'loading-img-editor'
            }`}
          >
            {loadingImgOnEditor && <Spin />}
            <Editor
              id="tinymce-container"
              // apiKey="500t4oxkedhg9hhhvt9a1rotn3zf0qhufy8pm0or6f6i8m69"
              apiKey={process.env.REACT_APP_TINY_KEY}
              value={dataEditor || ''}
              init={{
                menubar: 'file edit view insert format tools table help',
                paste_data_images: true,
                plugins:
                  'print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons',
                toolbar:
                  'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl | addButton addButtonNoLink addCheckbox addTextBg embedMaps addIframe addIconShowMore table',
                toolbar_mode: 'wrap',
                font_size_formats: '11px 12px 13px 14px 16px 18px 24px 36px 48px',
                formats: {
                  bold: { inline: 'b', remove: 'all' },
                  italic: { inline: 'i', remove: 'all' },
                  underline: { inline: 'u', exact: true },
                  strikethrough: { inline: 'strike', exact: true },
                },
                images_upload_credentials: true,
                images_upload_url: `${process.env.REACT_APP_API_URL}/assets/upload`,
                file_picker_types: 'image',
                images_file_types: 'jpg,jpeg,jfif,png,svg',
                images_upload_handler: uploadFunction as any,
              }}
              onEditorChange={(recruitValue, editor) => {
                handleChangeEditor(recruitValue, editor);
              }}
            />
            {isSubmit && dataEditor === '' && (
              <span className="text-error">
                {intl.formatMessage({
                  id: 'recruit.create.error.content',
                })}
              </span>
            )}
          </div>
          <div className="right-container">
            <div className="right-container__content">
              <div className="right-container__content__title">
                <div className="right-container__content__title__label">
                  {intl.formatMessage({
                    id: 'recruit.create.title',
                  })}
                </div>
                <CustomInput
                  value={title}
                  className={`${isSubmit && title === '' && 'title-error'}`}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={255}
                />
                {isSubmit && title.trim() === '' && (
                  <span className="text-error">
                    {intl.formatMessage({
                      id: 'recruit.create.error.title',
                    })}
                  </span>
                )}
              </div>
              <div className="right-container__content__status custom-switch">
                <div className="right-container__content__status__label">
                  {intl.formatMessage({
                    id: 'recruit.create.status',
                  })}
                </div>
                <Switch
                  checked={status}
                  onChange={(e) => {
                    setStatus(e);
                  }}
                />
              </div>
            </div>
            <div className="right-container__action">
              {id ? (
                <div className="more-action">
                  <CustomButton
                    className="button-save"
                    onClick={() => {
                      permission.update && onFinish();
                    }}
                    disabled={loadingImgOnEditor || !permission.update}
                  >
                    {intl.formatMessage({
                      id: 'recruit.edit.button.save',
                    })}
                  </CustomButton>
                  <CustomButton
                    className="button-delete"
                    onClick={() => {
                      permission.delete && setIsDeleteRecruitment(true);
                    }}
                    disabled={!permission.delete}
                  >
                    {intl.formatMessage({
                      id: 'recruit.edit.button.delete',
                    })}
                  </CustomButton>
                </div>
              ) : (
                <div className="more-action">
                  <CustomButton
                    className="button-create"
                    onClick={onFinish}
                    disabled={loadingImgOnEditor || !permission.create}
                  >
                    {intl.formatMessage({
                      id: 'recruit.create.button.create',
                    })}
                  </CustomButton>
                  <CustomButton
                    className="button-cancel"
                    onClick={() => {
                      navigate(-1);
                    }}
                  >
                    {intl.formatMessage({
                      id: 'recruit.create.button.cancel',
                    })}
                  </CustomButton>
                </div>
              )}
            </div>
          </div>
        </div>
        <ConfirmDeleteModal
          name={dataRecruitment?.data.title || ''}
          visible={isDeleteRecruitment}
          onSubmit={handleDelete}
          onClose={() => setIsDeleteRecruitment(false)}
        />
      </Spin>
    </Card>
  );
};

export default ActionRecruitment;
