export enum ELoaiDoiTuong {
	TAT_CA = 'Tất cả',
	// VAI_TRO = 'Vai trò',
	LOP_TIN_CHI = 'Lớp tín chỉ',
	LOP_HANH_CHINH = 'Lớp hành chính',
	NGANH = 'Ngành',
	// DON_VI = 'Đơn vị',
	KHOA = 'Khóa',
	NGUOI_DUNG_CU_THE = 'Người dùng cụ thể',
}

export enum EVaiTroKhaoSat {
	SINH_VIEN = 'sinh_vien',
	NHAN_VIEN = 'nhan_vien',
}

export enum ELoaiCauHoi {
	SingleChoice = 'Chọn 1 đáp án',
	MultipleChoice = 'Chọn nhiều đáp án',
	GridSingleChoice = 'Dạng bảng (chọn một)',
	GridMultipleChoice = 'Dạng bảng (chọn nhiều)',
	NumericRange = 'Đánh giá (dạng số)',
	Text = 'Câu trả lời Text',
	UploadFile = 'Tải lên file',
}

export enum EVaiTroBieuMau {
	SINH_VIEN = 'sinh_vien',
	NHAN_VIEN = 'nhan_vien',
}

export const TenVaiTroBieuMau = {
	[EVaiTroBieuMau.SINH_VIEN]: 'Sinh viên',
	[EVaiTroBieuMau.NHAN_VIEN]: 'Cán bộ, giảng viên',
};

export enum ELoaiBieuMau {
	KHAO_SAT = 'Khảo sát',
	TRAC_NGHIEM = 'Trắc nghiệm',
	KHAI_BAO_Y_TE = 'Khai báo y tế',
	DANH_GIA_GIANG_VIEN = 'Đánh giá giảng viên',
	CHAM_DIEM_REN_LUYEN = 'Chấm điểm rèn luyện',
	QUESTIONS = 'Self Assessment Questions',
}

export enum ELoaiDot {
	BIEU_MAU = 'BIEU_MAU',
}

export enum ELoaiCauHoiPublic {
	SINGLE_CHOICE = 'SingleChoice',
	MULTIPLE_CHOICE = 'MultipleChoice',
	TEXT = 'Text',
	GRID_MULTIPLE_CHOICE = 'GridMultipleChoice',
	GRID_SINGLE_CHOICE = 'GridSingleChoice',
	NUMERIC_RANGE = 'NumericRange',
	RENDER_INPUT_RATING = 'Numberinputrating',
	UPLOAD_FILE = 'UploadFile',
	RENDER_INPUT = 'RenderInput',
}

export const mapLoaiCauHoi: Record<any, string> = {
	[ELoaiCauHoiPublic.SINGLE_CHOICE]: 'Chọn 1 đáp án',
	[ELoaiCauHoiPublic.MULTIPLE_CHOICE]: 'Chọn nhiều đáp án',
	[ELoaiCauHoiPublic.TEXT]: 'Câu trả lời Text',
	[ELoaiCauHoiPublic.GRID_MULTIPLE_CHOICE]: 'Dạng bảng (chọn nhiều)',
	[ELoaiCauHoiPublic.GRID_SINGLE_CHOICE]: 'Dạng bảng (chọn một)',
	[ELoaiCauHoiPublic.NUMERIC_RANGE]: 'Đánh giá (dạng số)',
	[ELoaiCauHoiPublic.RENDER_INPUT_RATING]: 'Câu trả lời số',
	[ELoaiCauHoiPublic.UPLOAD_FILE]: 'Tải lên file',
	[ELoaiCauHoiPublic.RENDER_INPUT]: 'Câu trả lời dạng ngắn',
};
