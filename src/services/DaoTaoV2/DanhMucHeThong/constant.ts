export enum ELoaiToChucDayHoc {
	LY_THUYET = 'Lý thuyết',
	BAI_TAP = 'Bài tập/thảo luận',
	THUC_HANH = 'Thực hành',
	TU_HOC = 'Tự học',
}

export enum ELoaiHocLieu {
	VAN_BAN = 'Văn bản',
	VIDEO = 'Video',
	TRAC_NGHIEM = 'Trắc nghiệm',
}

export enum ELoaiChuongTrinhDaoTao {
	CHUAN = 'Chuan',
	KE_HOACH = 'KeHoach',
}

export const LoaiChuongTrinhDaoTao: Record<ELoaiChuongTrinhDaoTao, string> = {
	[ELoaiChuongTrinhDaoTao.CHUAN]: 'Chuẩn',
	[ELoaiChuongTrinhDaoTao.KE_HOACH]: 'Kế hoạch',
};

export enum ETrangThaiCtdt {
	// BIEN_SOAN = 'BIEN_SOAN',
	// CHO_CONG_BO = 'CHO_CONG_BO',
	CONG_BO = 'CONG_BO',
	RA_SOAT = 'RA_SOAT',
	LUU_TRU = 'LUU_TRU',
}

export const trangThaiCtdt: Record<ETrangThaiCtdt, string> = {
	// [ETrangThaiCtdt.BIEN_SOAN]: 'Đang biên soạn',
	// [ETrangThaiCtdt.CHO_CONG_BO]: 'Chờ công bố',
	[ETrangThaiCtdt.CONG_BO]: 'Đã công bố',
	[ETrangThaiCtdt.RA_SOAT]: 'Đang rà soát',
	[ETrangThaiCtdt.LUU_TRU]: 'Lưu trữ',
};

export const colorTrangThaiCtdt: Record<ETrangThaiCtdt, string> = {
	// [ETrangThaiCtdt.BIEN_SOAN]: 'orange',
	// [ETrangThaiCtdt.CHO_CONG_BO]: 'blue',
	[ETrangThaiCtdt.CONG_BO]: 'green',
	[ETrangThaiCtdt.RA_SOAT]: 'magenta',
	[ETrangThaiCtdt.LUU_TRU]: 'purple',
};

export enum ELoaiHocPhanCTDT {
	BAT_BUOC = 'Bắt buộc',
	TU_CHON = 'Tự chọn',
	TOT_NGHIEP = 'Tốt nghiệp',
}

// Thao tác rà soát chương trình đào tạo
export enum ELoaiThaoTacRaSoatCtdt {
	GIU_NGUYEN = 'GIU_NGUYEN',
	THAY_THE_KHOI_HP_CT = 'THAY_THE_KHOI_HP_CT',
	THEM_KHOI_HP_CT = 'THEM_KHOI_HP_CT',
	SUA_KHOI_HP_CT = 'SUA_KHOI_HP_CT',
	XOA_KHOI_HP_CT = 'XOA_KHOI_HP_CT',
}

export const loaiThaoTacRaSoatCtdt: Record<ELoaiThaoTacRaSoatCtdt, string> = {
	[ELoaiThaoTacRaSoatCtdt.THAY_THE_KHOI_HP_CT]: 'Chuyển đổi',
	[ELoaiThaoTacRaSoatCtdt.XOA_KHOI_HP_CT]: 'Xóa khối',
	[ELoaiThaoTacRaSoatCtdt.SUA_KHOI_HP_CT]: 'Chỉnh sửa',
	[ELoaiThaoTacRaSoatCtdt.THEM_KHOI_HP_CT]: 'Thêm mới',
	[ELoaiThaoTacRaSoatCtdt.GIU_NGUYEN]: 'Giữ nguyên',
};

export const colorLoaiThaoTacRaSoatCtdt: Record<ELoaiThaoTacRaSoatCtdt, string> = {
	[ELoaiThaoTacRaSoatCtdt.THAY_THE_KHOI_HP_CT]: 'green',
	[ELoaiThaoTacRaSoatCtdt.XOA_KHOI_HP_CT]: 'orange',
	[ELoaiThaoTacRaSoatCtdt.SUA_KHOI_HP_CT]: 'yellow',
	[ELoaiThaoTacRaSoatCtdt.THEM_KHOI_HP_CT]: 'blue',
	[ELoaiThaoTacRaSoatCtdt.GIU_NGUYEN]: 'default',
};

/** Số tín chỉ học kỳ cảnh báo MIN */
export const soTinChiHocKyMin = APP_CONFIG_SO_TIN_CHI_HOC_KY_MIN;
/** Số tín chỉ học kỳ cảnh báo MAX */
export const soTinChiHocKyMax = APP_CONFIG_SO_TIN_CHI_HOC_KY_MAX;

// ĐỀ CƯƠNG HỌC PHẦN HỌC KỲ
export enum ETrangThaiDeCuongHPHK {
	CHUA_DUYET = 'Chưa duyệt',
	DA_DUYET = 'Đã duyệt',
}

export const colorTrangThaiDeCuongHPHK: Record<ETrangThaiDeCuongHPHK, string> = {
	[ETrangThaiDeCuongHPHK.CHUA_DUYET]: 'red',
	[ETrangThaiDeCuongHPHK.DA_DUYET]: 'green',
};

export enum ELoaiPhongHoc {
	THUC_HANH = 'Thực hành',
	LY_THUYET = 'Lý thuyết',
	PHONG_LAB = 'Phòng Lab',
	VAT_LY = 'Vật lý',
	HOA_HOC = 'Hóa học',
	TIENG_ANH = 'Tiếng Anh',
	PHONG_HOP = 'Phòng họp',
}

export enum ETrangThaiPhong {
	HOAT_DONG = 'Hoạt động',
	BAO_TRI = 'Bảo trì',
}

export enum EPhuongThucTinhDiem {
	DAT = 'Đạt',
	BAC = 'Theo bậc',
	DIEM = 'Tính điểm',
}

// Ý kiến rà soát đề cương học phần
export enum ETrangThaiYKienHocPhan {
	CHUA_CO_Y_KIEN = 'Chưa có ý kiến',
	CO_Y_KIEN = 'Đã có ý kiến',
}

export const colorYKienHocPhan: Record<ETrangThaiYKienHocPhan, string> = {
	[ETrangThaiYKienHocPhan.CHUA_CO_Y_KIEN]: 'default',
	[ETrangThaiYKienHocPhan.CO_Y_KIEN]: 'green',
};

export enum ELoaiQuyetDinh {
	BAO_LUU = 'Bảo lưu',
	THOI_HOC = 'Thôi học',
	TOT_NGHIEP = 'Tốt nghiệp',
	QUY_DOI_DIEM = 'Quy đổi điểm',
	SONG_NGANH = 'Song ngành',
	KHAC = 'Khác',
}

export enum ELoaiNganhChuyenNganh {
	NGANH = 'nganh',
	CHUYEN_NGANH = 'chuyen_nganh',
	CHUYEN_NGANH_PHU = 'chuyen_nganh_phu',
}
