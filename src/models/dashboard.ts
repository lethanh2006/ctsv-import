import {
  adminGetTongSoDon,
  chuyenVienDieuPhoiGetTongSoDon,
  chuyenVienXuLyGetTongSoDon,
} from '@/services/Dashboard/dashboard';
import { useState } from 'react';
import { useModel } from 'umi';

export default () => {
  const [recordTongSoDon, setRecordTongSoDon] = useState<{ trangThai: string; soLuong: number }[]>(
    [],
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [idDichVu, setIdDichVu] = useState<string>();
  const { loaiDichVu } = useModel('dvmc.dichvumotcuav2');

  const adminGetTongSoDonDVMCModel = async (isDvmc?: boolean) => {
    setLoading(true);
    const response = await adminGetTongSoDon({
      idDichVu,
      loaiDichVu: isDvmc ? 'DVMC' : 'VAN_PHONG_SO',
    });
    setRecordTongSoDon(response?.data?.data ?? []);
    setLoading(false);
    return response?.data?.data ?? [];
  };

  const chuyenVienDieuPhoiGetTongSoDonDVMCModel = async (
    isDonCanXuLy?: number,
    stringLoaiDichVu?: 'DVMC' | 'VAN_PHONG_SO',
  ) => {
    setLoading(true);
    const response = await chuyenVienDieuPhoiGetTongSoDon({
      idDichVu,
      loaiDichVu: stringLoaiDichVu ?? loaiDichVu,
      me: isDonCanXuLy,
    });
    setRecordTongSoDon(response?.data?.data ?? []);
    setLoading(false);
  };

  const chuyenVienXuLyGetTongSoDonDVMCModel = async (
    isDonCanXuLy?: number,
    stringLoaiDichVu?: 'DVMC' | 'VAN_PHONG_SO',
  ) => {
    setLoading(true);
    const response = await chuyenVienXuLyGetTongSoDon({
      idDichVu,
      loaiDichVu: stringLoaiDichVu ?? loaiDichVu,
      me: isDonCanXuLy,
    });
    setRecordTongSoDon(response?.data?.data ?? []);
    setLoading(false);
  };

  return {
    idDichVu,
    setIdDichVu,
    loading,
    setLoading,
    recordTongSoDon,
    setRecordTongSoDon,
    adminGetTongSoDonDVMCModel,
    chuyenVienDieuPhoiGetTongSoDonDVMCModel,
    chuyenVienXuLyGetTongSoDonDVMCModel,
  };
};
