export enum ELoaiGiaTriMacDinh {
	NHAP_SAN = 'NHAP_SAN',
	QUY_DOI_MINH_CHUNG = 'QUY_DOI_MINH_CHUNG',
	HAM_TUY_BIEN = 'HAM_TUY_BIEN',
}

export const MapKeyNameLoaiGiaTriMacDinh = {
	[ELoaiGiaTriMacDinh.NHAP_SAN]: 'Nhập sẵn',
	[ELoaiGiaTriMacDinh.QUY_DOI_MINH_CHUNG]: 'Quy đổi từ minh chứng',
	[ELoaiGiaTriMacDinh.HAM_TUY_BIEN]: 'Hàm tùy biến',
};

export enum EXepLoai {
	XUAT_SAC = 'XUAT_SAC',
	TOT = 'TOT',
	KHA = 'KHA',
	TRUNG_BINH = 'TRUNG_BINH',
	YEU = 'YEU',
	KEM = 'KEM',
	KHONG_THAM_GIA = 'KHONG_THAM_GIA',
}

export const MapKeyNameXepLoai = {
	[EXepLoai.XUAT_SAC]: 'Xuất sắc',
	[EXepLoai.TOT]: 'Tốt',
	[EXepLoai.KHA]: 'Khá',
	[EXepLoai.TRUNG_BINH]: 'Trung bình',
	[EXepLoai.YEU]: 'Yếu',
	[EXepLoai.KEM]: 'Kém',
	[EXepLoai.KHONG_THAM_GIA]: 'Không tham gia đánh giá',
};

export enum ELoaiDoiTuongChamDiem {
	SINH_VIEN = 'SINH_VIEN',
	CAN_SU = 'CAN_SU',
	CVHT = 'CVHT',
}

export const MapKeyNameLoaiDoiTuongChamDiem: any = {
	[ELoaiDoiTuongChamDiem.CAN_SU]: 'Ban cán sự lớp',
	[ELoaiDoiTuongChamDiem.CVHT]: 'Cố vấn học tập',
	[ELoaiDoiTuongChamDiem.SINH_VIEN]: 'Sinh viên',
};

export enum ETrangThaiChamDiem {
	DANG_CHAM = 'DANG_CHAM',
	DA_CHAM_XONG = 'DA_CHAM_XONG',
	DANG_NIEM_YET = 'DANG_NIEM_YET',
	DANG_XU_LY_KHIEU_NAI = 'DANG_XU_LY_KHIEU_NAI',
	DA_CONG_BO = 'DA_CONG_BO',
	KHONG_THAM_GIA = 'KHONG_THAM_GIA',
}

export const MapKeyNameTrangThaiChamDiem = {
	[ETrangThaiChamDiem.DANG_CHAM]: 'Đang chấm',
	[ETrangThaiChamDiem.DANG_XU_LY_KHIEU_NAI]: 'Đang xử lý khiếu nại',
	[ETrangThaiChamDiem.DA_CHAM_XONG]: 'Đã chấm xong',
	[ETrangThaiChamDiem.DA_CONG_BO]: 'Đã công bố',
	[ETrangThaiChamDiem.DANG_NIEM_YET]: 'Đang niêm yết',
	[ETrangThaiChamDiem.KHONG_THAM_GIA]: 'Không tham gia đánh giá',
};
