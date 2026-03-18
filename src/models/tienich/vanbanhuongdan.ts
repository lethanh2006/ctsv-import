import useInitModel from '@/hooks/useInitModel';
import { type VanBanHuongDan } from '@/services/TienIch/VanBanHuongDan/typing';
import { useState } from 'react';

export default () => {
  const objInit = useInitModel<VanBanHuongDan.IRecord>('van-ban-huong-dan');

  const [visibleFormFile, setVisibleFormFile] = useState<boolean>(false);
  const [editFile, setEditFile] = useState<boolean>(false);
  const [recordFile, setRecordFile] = useState<VanBanHuongDan.IFile>();

  return {
    ...objInit,
    recordFile,
    setRecordFile,
    editFile,
    setEditFile,
    visibleFormFile,
    setVisibleFormFile,
  };
};
