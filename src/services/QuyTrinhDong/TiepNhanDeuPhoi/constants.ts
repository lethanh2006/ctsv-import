import {EModuleKey} from "@/services/base/constant";
import {EPhanHe} from "@/services/QuyTrinhDong/constant";

export enum TrangThaiKhaiBao {
  DA_KHAI_BAO = 'Đã khai báo',
  CHUA_KHAI_BAO = 'Chưa khai báo',
}
export enum TrangThaiTiepNhan {
  CHUA_CO = 'Chưa có kết quả tiếp nhận',
  DA_DUYET = 'Chưa khai báo',
  KHONG_DUYET = 'Không duyệt',
  CHINH_SUA_LAI = 'Chỉnh sửa lại',
}

export const MapColorTrangThaiTiepNhan = {
  [TrangThaiTiepNhan.CHUA_CO]: 'yellow',
  [TrangThaiTiepNhan.DA_DUYET]: 'green',
  [TrangThaiTiepNhan.KHONG_DUYET]: 'red',
  [TrangThaiTiepNhan.CHINH_SUA_LAI]: 'yellow',
};
export enum TrangThaiTiepNhanDon {
  DUYET = 'Duyệt',
  KHONG_DUYET = 'Không duyệt',
  CHINH_SUA_LAI = 'Chỉnh sửa lại',
}
export const MapCurrentRoles = {
  [EModuleKey.VPS]: EPhanHe.VAN_PHONG_DIEU_HANH,
  [EModuleKey.CONNECT]: EPhanHe.VWA_CONNECT,
  [EModuleKey.QLDT]: EPhanHe.QLDT,
  [EModuleKey.CTSV]: EPhanHe.CONG_TAC_SINH_VIEN,
  [EModuleKey.TCNS]: EPhanHe.TCNS,
  [EModuleKey.CONG_CAN_BO]: EPhanHe.CONG_CAN_BO,
  [EModuleKey.QLKH]: EPhanHe.QUAN_LY_KHOA_HOC,
};
