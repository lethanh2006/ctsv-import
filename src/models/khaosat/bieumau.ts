import useInitModel from '@/hooks/useInitModel';
import { kichHoatBieuMau } from '@/services/KhaoSat/BieuMau';
import { type BieuMau } from '@/services/KhaoSat/BieuMau/typing';
import { message } from 'antd';
import { useForm } from 'antd/lib/form/Form';

export default () => {
  const objInit = useInitModel<BieuMau.IRecord>('khao-sat', undefined);
  const { setFormSubmiting, getModel } = objInit;
  const [formCauHinhBieuMau] = useForm();

  const kichHoatBieuMauModel = async (payload: { id: string; data: { kichHoat: boolean } },getData?:()=>void) => {
    setFormSubmiting(true);
    await kichHoatBieuMau(payload);
    message.success('Xử lý thành công');
    setFormSubmiting(false);
    if (getData) getData()
    else getModel();
  };

  return {
    ...objInit,
    formCauHinhBieuMau,
    kichHoatBieuMauModel,
  };
};
