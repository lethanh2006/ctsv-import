import type { DotKhamSucKhoe } from './typing';

export enum ETrangThaiKhamSucKhoe {
	CHO_DUYET = 'Chờ duyệt',
	DA_DUYET = 'Đã duyệt',
	YEU_CAU_CHINH_SUA = 'Yêu cầu chỉnh sửa',
}

export const colorETrangThaiKhaiBaoSucKhoe: Record<ETrangThaiKhamSucKhoe, string> = {
	[ETrangThaiKhamSucKhoe.CHO_DUYET]: 'blue',
	[ETrangThaiKhamSucKhoe.DA_DUYET]: 'green',
	[ETrangThaiKhamSucKhoe.YEU_CAU_CHINH_SUA]: 'orange',
};

export enum ETinhTrangSucKhoe {
	BINH_THUONG = 'Bình thường',
	CAN_LUU_Y = 'Cần lưu ý',
	CHUA_CO_KET_QUA = 'Chưa có kết quả',
}

export const MapKeyNameTinhTrangSuckhoe = {
	[ETinhTrangSucKhoe.BINH_THUONG]: 'Đủ sức khỏe học tập - làm việc',
	[ETinhTrangSucKhoe.CAN_LUU_Y]: 'Cần lưu ý',
	[ETinhTrangSucKhoe.CHUA_CO_KET_QUA]: 'Chưa có kết quả',
};

export const colorETinhTrangSucKhoe: Record<ETinhTrangSucKhoe, string> = {
	[ETinhTrangSucKhoe.BINH_THUONG]: 'green',
	[ETinhTrangSucKhoe.CAN_LUU_Y]: 'red',
	[ETinhTrangSucKhoe.CHUA_CO_KET_QUA]: 'default',
};

export const fieldTinhTrangSucKhoe: Record<ETinhTrangSucKhoe, keyof DotKhamSucKhoe.IThongKeSucKhoeSinhVien> = {
	[ETinhTrangSucKhoe.BINH_THUONG]: 'binhThuong',
	[ETinhTrangSucKhoe.CAN_LUU_Y]: 'coBenh',
	[ETinhTrangSucKhoe.CHUA_CO_KET_QUA]: 'chuaDanhGia',
};

export const i18nTinhTrangSucKhoe: Record<ETinhTrangSucKhoe, string> = {
	[ETinhTrangSucKhoe.BINH_THUONG]: 'ketquakhamsuckhoe.stat.binhThuong',
	[ETinhTrangSucKhoe.CAN_LUU_Y]: 'ketquakhamsuckhoe.stat.canLuuY',
	[ETinhTrangSucKhoe.CHUA_CO_KET_QUA]: 'ketquakhamsuckhoe.stat.chuaCoKetQua',
};

export enum EPhanLoaiSucKhoe {
	I = 'I',
	II = 'II',
	III = 'III',
	IV = 'IV',
	V = 'V',
}
