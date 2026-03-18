export enum EGioiTinh {
	Nam = 'Nam',
	Nu = 'Nữ',
}

export enum EHinhThucTuyenDung {
	THI_TUYEN = 'Thi tuyển',
	XET_TUYEN = 'Xét tuyển',
	HOP_DONG = 'Hơp đồng',
	BIET_PHAI = 'Biệt phái',
	DIEU_DONG = 'Điều động',
}

export enum EViTriViecLam {
	DUNG_NGANH = 'Có việc làm đúng ngành đào tạo',
	LIEN_QUAN = 'Có việc làm liên quan đến ngành đào tạo',
	KHONG_LIEN_QUAN = 'Có việc làm không liên quan đến ngành đào tạo',
	TIEP_TUC_HOC = 'Tiếp tục học',
	CHUA_CO = 'Chưa có việc làm',
}

export enum ENoiNgoaiTru {
	NOI_TRU = 'Nội trú',
	NGOAI_TRU = 'Ngoại trú',
}

export enum ETrangThaiDot {
	CHO_XU_LY = 'Chờ xử lý',
	YEU_CAU_CHINH_SUA = 'Yêu cầu chỉnh sửa',
	DA_BAN_HANH = 'Đã ban hành',
}

export const colorTrangThaiDot: Record<ETrangThaiDot, string> = {
	[ETrangThaiDot.CHO_XU_LY]: 'blue',
	[ETrangThaiDot.YEU_CAU_CHINH_SUA]: 'orange',
	[ETrangThaiDot.DA_BAN_HANH]: 'green',
};

export enum ETrangThaiSinhVienDot {
	CHO_XU_LY = 'Chờ xử lý',
	DA_RA_QUYET_DINH = 'Đã ra quyết định',
	KHONG_DUYET = 'Không duyệt',
}

export const colorTrangThaiSinhVienDot: Record<ETrangThaiSinhVienDot, string> = {
	[ETrangThaiSinhVienDot.CHO_XU_LY]: 'blue',
	[ETrangThaiSinhVienDot.DA_RA_QUYET_DINH]: 'green',
	[ETrangThaiSinhVienDot.KHONG_DUYET]: 'orange',
};

export enum ETrangThaiNhanSu {
	DANG_LAM_VIEC = 'Đang làm việc',
	DA_CHUYEN_DI = 'Đã chuyển đi',
	DA_DIEU_DONG = 'Đã điều động',
	CHO_NGHI_HUU = 'Chờ nghỉ hưu',
	DA_NGHI_HUU = 'Đã nghỉ hưu',
	DA_BIET_PHAI = 'Đã biệt phái',
	CHUYEN_DEN = 'Chuyển đến',
	THOI_VIEC = 'Thôi việc',
	DANG_DI_HOC = 'Đang đi học',
	KHAC = 'Khác',
	NGHI_KHONG_LUONG = 'Nghỉ không lương',
	NGHI_THEO_CHE_DO = 'Nghỉ theo chế độ',
	HET_HAN_HOP_DONG = 'Hết hạn hợp đồng',
}
