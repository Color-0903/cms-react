export const MANAGEMENT_TYPE = {
  ADMIN: '/admin/',
  TRAINER: '',
};

export const ANSWER_ORDER = ['a', 'b', 'c', 'd'];
export interface MyUploadProps {
  file: File;
  assetFolderId?: string;
  s3FilePath?: string;
  typeUpload?: string;
}
