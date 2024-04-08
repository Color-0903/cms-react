import { Editor } from '@tinymce/tinymce-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Form, Spin, Switch, Upload, message } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { assetsApi, newsApi } from '../../../../apis';
import { CreateNewsDto, UpdateNewsDto } from '../../../../apis/client-axios';
import CustomButton from '../../../../components/buttons/CustomButton';
import IconSVG from '../../../../components/icons/icons';
import CustomInput from '../../../../components/input/CustomInput';
import { MyUploadProps } from '../../../../constants/constant';
import { ADMIN_ROUTE_NAME } from '../../../../constants/route';
import { regexImage } from '../../../../validate/validator.validate';
import { CustomHandleSuccess } from '../../../../components/response/success';
import { ActionUser, PERMISSIONS } from '../../../../constants/enum';
import { CustomHandleError } from '../../../../components/response/error';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import CheckPermission, { Permission } from '../../../../util/check-permission';
import { ConfirmModel } from '../../../../components/modals/ConfirmModel';
import { QUERY_LIST_NEWS, QUERY_NEWS_DETAIL } from '../../../../util/contanst';

const ActionNews = () => {
  const intl = useIntl();
  const { id } = useParams();
  const [form] = Form.useForm<any>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [avatar, setAvatar] = useState<{ id: string; src: string }>();
  const [isDeleteNew, setIsDeleteNew] = useState<boolean>(false);
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
        read: Boolean(CheckPermission(PERMISSIONS.ReadNews, authUser)),
        create: Boolean(CheckPermission(PERMISSIONS.CreateNews, authUser)),
        delete: Boolean(CheckPermission(PERMISSIONS.DeleteNews, authUser)),
        update: Boolean(CheckPermission(PERMISSIONS.UpdateNews, authUser)),
      });
    }
  }, [authUser]);

  const { data: dataNew, isFetching: loadingData } = useQuery(
    [QUERY_NEWS_DETAIL, id],
    () => newsApi.newsControllerGetDetail(id as string),
    {
      onError: (error) => {},
      onSuccess: (response) => {
        setTitle(response.data.title || '');
        setDataEditor(response.data.content || '');
        setStatus(response.data.isVisible);
        if (response.data.avatar) {
          setAvatar({
            id: response.data.avatar.id,
            src: process.env.REACT_APP_URL_IMG_S3 + response.data.avatar.preview,
          });
        }
      },
      enabled: !!id,
      refetchOnWindowFocus: false,
    }
  );

  const {
    mutate: DeleteNew,
    status: statusDeleteNew,
    isLoading: deleteLoading,
  } = useMutation((id: string) => newsApi.newsControllerDeleteNews(id), {
    onSuccess: (data) => {
      queryClient.invalidateQueries([QUERY_LIST_NEWS]);
      navigate(`/admin/${ADMIN_ROUTE_NAME.NEWS_MANAGEMENT}`);
      CustomHandleSuccess(ActionUser.DELETE, intl);
    },
    onError: (error: any) => {
      CustomHandleError(error.response.data, intl);
    },
  });

  const {
    mutate: newCreate,
    status: statusCreateNew,
    isLoading: createLoading,
  } = useMutation((createnew: CreateNewsDto) => newsApi.newsControllerCreateNews(createnew), {
    onSuccess: ({ data }) => {
      navigate(`/admin/${ADMIN_ROUTE_NAME.NEWS_MANAGEMENT}`);
      CustomHandleSuccess(ActionUser.CREATE, intl);
    },
    onError: (error: any) => {
      CustomHandleError(error.response.data, intl);
    },
  });

  const {
    mutate: newUpdate,
    status: statusUpdatenew,
    isLoading: updateLoading,
  } = useMutation((updatenew: UpdateNewsDto) => newsApi.newsControllerUpdateNews(id as string, updatenew), {
    onSuccess: ({ data }) => {
      navigate(`/admin/${ADMIN_ROUTE_NAME.NEWS_MANAGEMENT}`);
      CustomHandleSuccess(ActionUser.EDIT, intl);
    },
    onError: (error: any) => {
      CustomHandleError(error.response.data, intl);
    },
  });

  const onFinish = () => {
    setIsSubmit(true);
    if (title.trim() === '' || dataEditor === '' || !avatar || avatar.id === '') {
      return;
    }
    if (id) {
      newUpdate({
        title: title,
        content: dataEditor,
        avatarId: avatar?.id,
        isVisible: status,
      });
    } else {
      newCreate({
        title: title,
        content: dataEditor,
        avatarId: avatar?.id,
        isVisible: status,
      });
    }
  };

  const handleDelete = () => {
    if (isDeleteNew && id) {
      DeleteNew(id);
    }
    setIsDeleteNew(false);
  };

  const { mutate: UploadImage, status: statusUploadImage } = useMutation(
    (uploadProps: MyUploadProps) =>
      assetsApi.assetControllerUploadFile(uploadProps.file, undefined, uploadProps.s3FilePath),
    {
      onSuccess: ({ data }) => {
        const newData = data as any;
        console.log({ data });
        setAvatar({ id: newData.id, src: process.env.REACT_APP_URL_IMG_S3 + newData.source });
        setLoadingImg(false);
      },
      onError: (error: any) => {
        setLoadingImg(false);
        message.error(
          intl.formatMessage({
            id: 'error.IMAGE_INVALID',
          })
        );
      },
    }
  );

  const customRequest = async (options: any) => {
    const { file, onSuccess, onError } = options;
    if (!file || !regexImage.test(file.name)) {
      message.error(
        intl.formatMessage({
          id: 'error.IMAGE_INVALID',
        })
      );
      return;
    }
    setLoadingImg(true);
    UploadImage({ file, assetFolderId: undefined, s3FilePath: 'news' });
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
      formData.append('s3FilePath', 'news');

      xhr.send(formData);
    });

  return (
    <Card id="create-new-management">
      <Spin
        className="custom-spin"
        size="large"
        spinning={loadingData || createLoading || updateLoading || deleteLoading}
      >
        <div className="container-new">
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
              onEditorChange={(newValue, editor) => {
                handleChangeEditor(newValue, editor);
              }}
            />
            {isSubmit && dataEditor === '' && (
              <span className="text-error">
                {intl.formatMessage({
                  id: 'new.create.error.content',
                })}
              </span>
            )}
          </div>
          <div className="right-container">
            <div className="right-container__content">
              <div
                className={`right-container__content__image ${
                  isSubmit && (!avatar || avatar?.src === '') && 'image-error'
                }`}
              >
                {loadingImg ? (
                  <Spin />
                ) : avatar && avatar.src ? (
                  <div className="right-container__content__image__display">
                    <img src={avatar.src} />
                    <span
                      onClick={() => {
                        setAvatar(undefined);
                      }}
                    >
                      <IconSVG type="close-white" />
                    </span>
                  </div>
                ) : (
                  <div className="right-container__content__image__upload">
                    <Upload
                      name="avatar"
                      className="avatar-uploader"
                      showUploadList={false}
                      customRequest={customRequest}
                    >
                      <span className="icon-upload">
                        <IconSVG type="upload-2" />
                      </span>
                      <div className="text-upload">
                        {intl.formatMessage({
                          id: 'new.create.upload',
                        })}
                      </div>
                    </Upload>
                  </div>
                )}
              </div>
              {isSubmit && (!avatar || avatar?.src === '') && (
                <span className="text-error custom-label">
                  {intl.formatMessage({
                    id: 'new.create.error.image',
                  })}
                </span>
              )}
              <div className="right-container__content__title">
                <div className="right-container__content__title__label">
                  {intl.formatMessage({
                    id: 'new.create.title',
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
                      id: 'new.create.error.title',
                    })}
                  </span>
                )}
              </div>
              <div className="right-container__content__status custom-switch">
                <div className="right-container__content__status__label">
                  {intl.formatMessage({
                    id: 'new.create.status',
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
                    disabled={loadingImg || loadingImgOnEditor || !permission.update}
                  >
                    {intl.formatMessage({
                      id: 'new.edit.button.save',
                    })}
                  </CustomButton>
                  <CustomButton
                    className="button-delete"
                    onClick={() => {
                      permission.delete && setIsDeleteNew(true);
                    }}
                    disabled={!permission.delete}
                  >
                    {intl.formatMessage({
                      id: 'new.edit.button.delete',
                    })}
                  </CustomButton>
                </div>
              ) : (
                <div className="more-action">
                  <CustomButton
                    className="button-create"
                    onClick={onFinish}
                    disabled={loadingImg || loadingImgOnEditor || !permission.create}
                  >
                    {intl.formatMessage({
                      id: 'new.create.button.create',
                    })}
                  </CustomButton>
                  <CustomButton
                    className="button-cancel"
                    onClick={() => {
                      navigate(-1);
                    }}
                  >
                    {intl.formatMessage({
                      id: 'new.create.button.cancel',
                    })}
                  </CustomButton>
                </div>
              )}
            </div>
          </div>
        </div>
        <ConfirmModel
          visible={isDeleteNew}
          onSubmit={handleDelete}
          onClose={() => setIsDeleteNew(false)}
        />
      </Spin>
    </Card>
  );
};

export default ActionNews;
