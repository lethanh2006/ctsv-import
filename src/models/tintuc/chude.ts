import useInitModel from '@/hooks/useInitModel';
import { getAllLoaiChuDe } from '@/services/TienIch/TinTuc';
import { type TinTuc } from '@/services/TienIch/TinTuc/typing';
import { useState } from 'react';

export default () => {
  const objInit = useInitModel<TinTuc.IChuDe>('common-topic', undefined, undefined, undefined, {
    order: 1,
  });
  const { setLoading } = objInit;
  const [danhSachLoaiChuDe, setDanhSachLoaiChuDe] = useState<string[]>([]);
  const [loaiChuDe, setLoaiChuDe] = useState<string>();

  const getAllLoaiChuDeModel = async () => {
    setLoading(true);
    const response = await getAllLoaiChuDe();
    setDanhSachLoaiChuDe(response?.data?.data ?? []);
    setLoading(false);
  };

  return {
    ...objInit,
    setLoaiChuDe,
    loaiChuDe,
    getAllLoaiChuDeModel,
    danhSachLoaiChuDe,
  };
};
