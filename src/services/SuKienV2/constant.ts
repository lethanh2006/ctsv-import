import { type TagProps } from 'antd';
import { type SuKienV2 } from './typings';

export enum ETrangThaiThamGiaSuKien {
	THAM_DU_THANH_CONG = 'Tham dự hoạt động thành công.',
	THAM_DU_THAT_BAI = 'Tham dự hoạt động thất bại.',
	DA_THAM_DU = 'Bạn đã đã đăng ký tham gia hoạt động này trước đó.',
}

export enum ETrangThaiDienRa {
	CHUA_DIEN_RA = 'Chưa diễn ra',
	DA_DIEN_RA = 'Đã diễn ra',
	DANG_DIEN_RA = 'Đang diễn ra',
}
export const MapETrangThaiDienRa = {
	[ETrangThaiDienRa.CHUA_DIEN_RA]: 'Chưa duyệt',
	[ETrangThaiDienRa.DA_DIEN_RA]: 'Đã duyệt',
	[ETrangThaiDienRa.DANG_DIEN_RA]: 'Yêu cầu chỉnh sửa',
};
export enum ESuKienType {
	CA_NHAN = 'Cá nhân',
	TAT_CA = 'Chung',
	HOP_LOP = 'Họp lớp',
	TUAN_LE_CONG_DAN = 'Tuần lễ công dân',
	CAC_HOAT_DONG = 'Các hoạt động cho sinh viên',
	DAO_TAO_BOI_DUONG = 'Đào tạo bồi dưỡng',
	HOP_TAC_NGUYEN_CUU_CHUYEN_GAO = 'Hợp tác - Nghiên cứu - chuyển giao',
	THUC_THI_CHINH_SACH = 'Thực thi, phát triển chính sách',
	HOAT_DONG_XA_HOI = 'Hoạt động xã hội',
	// VAN_HOA_VAN_NGHE_THE_THAO = 'Sự kiện',
	HOAT_DONG_CAU_LAC_BO = 'Hoạt động câu lạc bộ',
	KHAC = 'Khác',
}

export enum ELoaiSuKienSinhVien {
	NGAY_HOI_VIEC_LAM = 'Ngày hội việc làm',
	HOI_THAO_CHUYEN_DE_VIEC_LAM = 'Hội thảo, nói chuyện chuyên đề về việc làm',
	DAO_TAO_KY_NANG_MEM = 'Đào tạo kỹ năng mềm',
}

export const locationPathMappingToESuKienType: Record<string, ESuKienType> = {
	'tuan-le-cong-dan': ESuKienType.TUAN_LE_CONG_DAN,
	'cac-hoat-dong-cho-sinh-vien': ESuKienType.CAC_HOAT_DONG,
	'dao-tao-boi-duong': ESuKienType.DAO_TAO_BOI_DUONG,
	'hop-tac-nghien-cuu-chuyen-giao': ESuKienType.HOP_TAC_NGUYEN_CUU_CHUYEN_GAO,
	'thuc-thi-chinh-sach': ESuKienType.THUC_THI_CHINH_SACH,
	'hoat-dong-xa-hoi': ESuKienType.HOAT_DONG_XA_HOI,
	// 'su-kien': ESuKienType.VAN_HOA_VAN_NGHE_THE_THAO,
	'hoat-dong-cau-lac-bo': ESuKienType.HOAT_DONG_CAU_LAC_BO,
	khac: ESuKienType.KHAC,
};

export const ESuKienTypeMappingToLabel: Record<ESuKienType, string> = {
	[ESuKienType.CA_NHAN]: 'Cá nhân',
	[ESuKienType.TAT_CA]: 'Chung',
	[ESuKienType.HOP_LOP]: 'Họp lớp',
	[ESuKienType.TUAN_LE_CONG_DAN]: 'Tuần lễ sinh hoạt công dân',
	[ESuKienType.CAC_HOAT_DONG]: 'Hoạt động hướng nghiệp, việc làm và kỹ năng mềm',
	[ESuKienType.DAO_TAO_BOI_DUONG]: 'Đào tạo bồi dưỡng',
	[ESuKienType.HOP_TAC_NGUYEN_CUU_CHUYEN_GAO]: 'Nghiên cứu khoa học và chuyển giao công nghệ',
	[ESuKienType.THUC_THI_CHINH_SACH]: 'Thực thi, phát triển chính sách',
	[ESuKienType.HOAT_DONG_XA_HOI]: 'Hoạt động xã hội, thiện nguyện',
	// [ESuKienType.VAN_HOA_VAN_NGHE_THE_THAO]: 'Sự kiện',
	[ESuKienType.KHAC]: 'Các đơn vị ngoài trường',
	[ESuKienType.HOAT_DONG_CAU_LAC_BO]: 'Hoạt động câu lạc bộ',
};

export const ETrangThaiDienRaMappingToTagLabel: Record<ETrangThaiDienRa, string> = {
	[ETrangThaiDienRa.CHUA_DIEN_RA]: 'Chưa diễn ra',
	[ETrangThaiDienRa.DANG_DIEN_RA]: 'Đang diễn ra',
	[ETrangThaiDienRa.DA_DIEN_RA]: 'Đã kết thúc',
};

export const ETrangThaiDienRaMappingToTagColor: Record<ETrangThaiDienRa, TagProps['color']> = {
	[ETrangThaiDienRa.CHUA_DIEN_RA]: 'orange',
	[ETrangThaiDienRa.DANG_DIEN_RA]: 'blue',
	[ETrangThaiDienRa.DA_DIEN_RA]: 'green',
};

export const ETrangThaiDienRaMappingToHexColor: Record<ETrangThaiDienRa, string> = {
	[ETrangThaiDienRa.CHUA_DIEN_RA]: '#d46b08',
	[ETrangThaiDienRa.DANG_DIEN_RA]: '#096dd9',
	[ETrangThaiDienRa.DA_DIEN_RA]: '#389e0d',
};

export const ETrangThaiDienRaMappingToThongKeKey: Record<ETrangThaiDienRa, keyof SuKienV2.ThongKeTheoNam> = {
	[ETrangThaiDienRa.CHUA_DIEN_RA]: 'suKienChuaDienRa',
	[ETrangThaiDienRa.DANG_DIEN_RA]: 'suKienDangDienRa',
	[ETrangThaiDienRa.DA_DIEN_RA]: 'suKienDaDienRa',
};
export const ColorSuKien = {
	[ESuKienType.CAC_HOAT_DONG]: 'rgba(32, 152, 199, 0.7)',
	[ESuKienType.CA_NHAN]: 'rgba(32, 152, 199, 0.7)',
	[ESuKienType.DAO_TAO_BOI_DUONG]: 'rgba(32, 152, 199, 0.7)',
	[ESuKienType.HOAT_DONG_XA_HOI]: 'rgba(32, 152, 199, 0.7)',
	[ESuKienType.HOP_TAC_NGUYEN_CUU_CHUYEN_GAO]: 'rgba(32, 152, 199, 0.7)',
	[ESuKienType.TAT_CA]: 'rgba(32, 152, 199, 0.7)',
	[ESuKienType.THUC_THI_CHINH_SACH]: 'rgba(32, 152, 199, 0.7)',
};

export enum EReceiverType {
	// Topic = 'Topic',
	User = 'User',
	All = 'All',
	KhoaSinhVien = 'KhoaSinhVien',
	Khoa = 'Khoa',
	Nganh = 'Nganh',
	LopHanhChinh = 'LopHanhChinh',
	LopHocPhan = 'LopHocPhan',
}

export const LoaiDoiTuongThamGia: Partial<Record<EReceiverType, string>> = {
	[EReceiverType.User]: 'Người dùng cụ thể',
	[EReceiverType.All]: 'Toàn trường',
	[EReceiverType.Khoa]: 'Khoa',
	[EReceiverType.KhoaSinhVien]: 'Khóa sinh viên',
	[EReceiverType.Nganh]: 'Ngành đào tạo',
	[EReceiverType.LopHanhChinh]: 'Lớp hành chính',
	[EReceiverType.LopHocPhan]: 'Lớp học phần',
};

export enum ESuKienRole {
	HOC_VIEN = 'sinh_vien',
	CAN_BO = 'nhan_vien',
}

export enum ETuanLeCongDan {
	DAU_KHOA = 'Đầu khóa',
	GIUA_KHOA = 'Giữa khóa',
	CUOI_KHOA = 'Cuối khóa',
	// HOI_THAO_CHUYEN_DE_VIEC_LAM = "Hội thảo, nói chuyện chuyên đề về việc làm, đào tạo kỹ năng mềm",
	// KHAC = "Khác",
}

export enum ELoaiSoLuong {
	NGUOI = 'Người',
	NGAY = 'Ngày',
	KHAC = 'Khác',
}
export enum EPhanBoNguon {
	NGAN_SACH = 'Ngân sách nhà nước',
	TU_CHU = 'Tự chủ',
	TAI_TRO = 'Vận động tài trợ',
}

export enum ETrangThaiThamGia {
	XAC_NHAN = 'Xác nhận',
	CHUA_XAC_NHAN = 'Chưa xác nhận',
	TU_CHOI = 'Từ chối',
}

export const MapColorETrangThaiThamGia = {
	[ETrangThaiThamGia.XAC_NHAN]: 'green',
	[ETrangThaiThamGia.CHUA_XAC_NHAN]: 'orange',
	[ETrangThaiThamGia.TU_CHOI]: 'red',
};

export enum ELoaiKhaoSatSuKien {
	DANG_KY = 'DANG_KY',
	CHECK_IN = 'CHECK_IN',
	CHECK_OUT = 'CHECK_OUT',
}

export enum ELoaiSuKien {
	DANG_KY = 'Đăng ký',
	THAM_GIA = 'Tham gia',
}

export enum ELoaiCauHoiKhaoSat {
	SINGLE_CHOICE = 'SingleChoice',
	MULTIPLE_CHOICE = 'MultipleChoice',
	TEXT = 'Text',
	GRID_MULTIPLE_CHOICE = 'GridMultipleChoice',
	GRID_SINGLE_CHOICE = 'GridSingleChoice',
	NUMERIC_RANGE = 'NumericRange',
	UPLOAD_FILE = 'UploadFile',
}
