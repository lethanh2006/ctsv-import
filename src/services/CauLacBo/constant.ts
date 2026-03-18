export enum EChucVuThanhVienCauLacBo {
	CHU_NHIEM = 'CHU_NHIEM',
	PHO_CHU_NHIEM = 'PHO_CHU_NHIEM',
	UY_VIEN = 'UY_VIEN',
}

export enum EVaiTroThanhVienPhongBan {
	TRUONG_BAN = 'TRUONG_BAN',
	PHO_TRUONG_BAN = 'PHO_TRUONG_BAN',
}

export const MapKeyChucVuThanhVienCLB = {
	[EChucVuThanhVienCauLacBo.UY_VIEN]: 'Ủy viên',
	[EChucVuThanhVienCauLacBo.PHO_CHU_NHIEM]: 'Phó chủ nhiệm',
	[EChucVuThanhVienCauLacBo.CHU_NHIEM]: 'Chủ nhiệm',
};

export const MapKeyVaiTroThanhVienPhongBanCLB = {
	[EVaiTroThanhVienPhongBan.PHO_TRUONG_BAN]: 'Phó trưởng ban',
	[EVaiTroThanhVienPhongBan.TRUONG_BAN]: 'Trưởng ban',
};

export enum ETrangThaiHoatDong {
	DA_THUC_HIEN = 'Đã thực hiện',
	CHUA_THUC_HIEN = 'Chưa thực hiện',
	HUY = 'Hủy',
}

export const MapKeyColorTrangThaiHoatDongCLB = {
	[ETrangThaiHoatDong.DA_THUC_HIEN]: '#28a745',
	[ETrangThaiHoatDong.CHUA_THUC_HIEN]: '#1890ff',
	[ETrangThaiHoatDong.HUY]: '#ff4d4f',
};

export enum ETrangThaiThanhVien {
	DANG_HOAT_DONG = 'Đang hoạt động',
	NGUNG_HOAT_DONG = 'Ngừng hoạt động',
}

export const MapKeyColorTrangThaiThanhVienCLB = {
	[ETrangThaiThanhVien.DANG_HOAT_DONG]: '#28a745',
	[ETrangThaiThanhVien.NGUNG_HOAT_DONG]: '#ff4d4f',
};

export enum ELoaiThanhVienCauLacBo {
	CHINH_THUC = 'Chính thức',
	CTV = 'Cộng tác viên',
}
