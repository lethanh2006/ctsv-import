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

export enum ELoaiCauHoi {
	SingleChoice = 'SingleChoice',
	MultipleChoice = 'MultipleChoice',
	GridSingleChoice = 'GridSingleChoice',
	GridMultipleChoice = 'GridMultipleChoice',
	NumericRange = 'NumericRange',
	Text = 'Text',
	UploadFile = 'UploadFile',
	NumberInputRating = 'Numberinputrating',
	//diem ren luyen
	MINH_CHUNG = 'diemMinhChung',
	HE_THONG = 'diemHeThong',
}

export enum ELoaiCauHoiDrl {
  NumberInputRating = 'Numberinputrating',
  //diem ren luyen
  MINH_CHUNG = 'diemMinhChung',
  HE_THONG = 'diemHeThong',
}

export const ELoaiCauHoiMappingToLabel: Record<ELoaiCauHoi, string> = {
	[ELoaiCauHoi.SingleChoice]: 'Chọn 1 đáp án',
	[ELoaiCauHoi.MultipleChoice]: 'Chọn nhiều đáp án',
	[ELoaiCauHoi.GridSingleChoice]: 'Dạng bảng (chọn một)',
	[ELoaiCauHoi.GridMultipleChoice]: 'Dạng bảng (chọn nhiều)',
	[ELoaiCauHoi.NumericRange]: 'Đánh giá (dạng số)',
	[ELoaiCauHoi.Text]: 'Câu trả lời Text',
	[ELoaiCauHoi.UploadFile]: 'Tải lên file',
	[ELoaiCauHoi.NumberInputRating]: 'Đánh giá (nhập số)',
	[ELoaiCauHoi.MINH_CHUNG]: 'Minh chứng điểm rèn luyện',
	[ELoaiCauHoi.HE_THONG]: 'Điểm hệ thống điểm rèn luyện',
};

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
	// TRAC_NGIEM = 'Trắc nghiệm',
	// KHAI_BAO_Y_TE = 'Khai báo y tế',
	// DANH_GIA_GIANG_VIEN = 'Đánh giá giảng viên',
	DANH_GIA_CAN_BO = 'Đánh giá cán bộ',
	CHAM_DIEM_REN_LUYEN = 'Chấm điểm rèn luyện',
}

export enum ELoaiDot {
	BIEU_MAU = 'BIEU_MAU',
}
