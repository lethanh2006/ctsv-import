import useInitModel from '@/hooks/useInitModel';
import { MLichSuQuay } from '@/services/Minigame/LichSuQuay/typing';

export default () => {
  const objInit = useInitModel<MLichSuQuay.IRecord>('lich-su-vong-quay');

  return {
    ...objInit,
  };
};
