import useInitModel from '@/hooks/useInitModel';

export default () => {
  const objInit = useInitModel<HinhThucKyLuat.IRecord>('hinh-thuc-ky-luat');

  return {
    ...objInit,
  };
};
