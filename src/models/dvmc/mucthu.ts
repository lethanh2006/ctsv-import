import useInitModel from '@/hooks/useInitModel';
import type { ThanhToan } from '@/services/DVMC/ThanhToan/typings';
import { ipTaiChinh } from '@/utils/ip';

export default () => {
  const objInit = useInitModel<ThanhToan.Price>('muc-thu', 'condition', undefined, ipTaiChinh);
  return objInit;
};
