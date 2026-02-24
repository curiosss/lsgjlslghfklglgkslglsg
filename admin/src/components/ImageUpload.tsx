import { useState } from 'react';
import { Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { uploadFile, deleteFile } from '../api/upload';
import type { UploadFile } from 'antd/es/upload';
import type { UploadRequestOption } from '@rc-component/upload/lib/interface';

interface ImageUploadProps {
  value?: string;
  onChange?: (url: string) => void;
}

export const ImageUpload = ({ value, onChange }: ImageUploadProps) => {
  const [loading, setLoading] = useState(false);

  const fileList: UploadFile[] = value
    ? [{ uid: '-1', name: 'image', status: 'done', url: value }]
    : [];

  const handleUpload = async (options: UploadRequestOption) => {
    const { file } = options;
    setLoading(true);
    try {
      const { data: resp } = await uploadFile(file as File);
      if (resp.data) {
        onChange?.(resp.data.url);
        message.success('Файл загружен');
      }
    } catch {
      message.error('Ошибка загрузки файла');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (value) {
      try {
        await deleteFile(value);
      } catch {
        // ignore delete errors
      }
      onChange?.('');
    }
  };

  return (
    <Upload
      listType="picture-card"
      fileList={fileList}
      customRequest={handleUpload}
      onRemove={handleRemove}
      maxCount={1}
      accept="image/*"
    >
      {!value && (
        <div>
          <PlusOutlined spin={loading} />
          <div style={{ marginTop: 8 }}>Загрузить</div>
        </div>
      )}
    </Upload>
  );
};
