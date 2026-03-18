import useInitModel from '@/hooks/useInitModel';

export default () => {
  const objInit = useInitModel<LoaiKhenThuong.IRecord>('loai-khen-thuong');

  return {
    ...objInit,
  };
};
