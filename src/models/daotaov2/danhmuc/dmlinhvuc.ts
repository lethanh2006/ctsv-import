import useInitModel from '@/hooks/useInitModel';

export default () => {
  const objInit = useInitModel<LinhVucDaoTao.IRecordBo>(
    'dm-linh-vuc-dao-tao',
    undefined,
    undefined,
    undefined,
    { ma: 1 },
  );

  return {
    ...objInit,
  };
};
