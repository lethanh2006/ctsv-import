import { Card } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import TableQuanLyDon from '../QuanLyDon/components/TableQuanLyDonChuyenVien';
import ThongTinTongHop from './components/ThongTinTongHop';
import dayjs from "dayjs";

const ThongTinTongHopChuyenVienDieuPhoi = () => {
  const { idDichVu, chuyenVienDieuPhoiGetTongSoDonDVMCModel } = useModel('dashboard');
  const { setTrangThaiQuanLyDon, getAllBieuMauChuyenVienDieuPhoiModel } =
    useModel('dvmc.dichvumotcuav2');

  useEffect(() => {
    chuyenVienDieuPhoiGetTongSoDonDVMCModel();
  }, [idDichVu]);

  useEffect(() => {
    setTrangThaiQuanLyDon(undefined);
    getAllBieuMauChuyenVienDieuPhoiModel('DVMC');
    return () => {
      setTrangThaiQuanLyDon('PROCESSING');
    };
  }, []);

  return (
    <>
      <ThongTinTongHop />
      <Card  title="Danh sách đơn cần xử lý trong ngày">
        <TableQuanLyDon hideFilter isDashboard/>
      </Card>
    </>
  );
};

export default ThongTinTongHopChuyenVienDieuPhoi;
