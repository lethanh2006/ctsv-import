import useInitModel from '@/hooks/useInitModel';

export default () => {
  const objInit = useInitModel<HinhThucKhenThuong.IRecord>('hinh-thuc-khen-thuong');

  return {
    ...objInit,
  };
};
