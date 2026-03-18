import useInitModel from '@/hooks/useInitModel';

export default () => {
  const objInit = useInitModel<TrinhDoDaoTao.IRecordBo>(
    'dm-trinh-do-dao-tao',
    undefined,
    undefined,
    undefined,
    { ma: 1 },
  );

  return {
    ...objInit,
  };
};
