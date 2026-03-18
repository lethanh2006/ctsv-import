import useInitModel from '@/hooks/useInitModel';
import { MVoucher } from '@/services/Minigame/Voucher/typing';

export default () => {
  const objInit = useInitModel<MVoucher.ICauHinhVoucherDto>('cau-hinh-voucher');

  return {
    ...objInit,
  };
};
