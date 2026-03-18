import useInitModel from '@/hooks/useInitModel';

export default () => {
  const objInit = useInitModel<CapKyLuat.IRecord>('cap-ky-luat');

  return {
    ...objInit,
  };
};
