export enum ECachTinhDiem {
	TRUNG_BINH = 'Trung bình',
	DAT = 'Đạt/không đạt',
}

export enum ELoaiNhuCauHocPhan {
	KE_HOACH = 'soNhuCauTheoKeHoach',
	HOC_LAI = 'soNhuCauHocLai',
	HOC_CAI_THIEN = 'soNhuCauHocCaiThien',
	CAM_THI = 'soNhuCauCamThi',
}

export const loaiNhuCauHocPhan: Record<ELoaiNhuCauHocPhan, string> = {
	[ELoaiNhuCauHocPhan.KE_HOACH]: 'Theo tiến trình chuẩn',
	[ELoaiNhuCauHocPhan.HOC_LAI]: 'Học lại',
	[ELoaiNhuCauHocPhan.HOC_CAI_THIEN]: 'Học cải thiện',
	[ELoaiNhuCauHocPhan.CAM_THI]: 'Bị cấm thi kỳ trước',
};

export const ColorLoaiNhuCauHocPhan = ['#007eb9', '#057B85', '#84C318', '#F9E900', '#F6AF65', '#FF6F6F', '#e04ed4'];

// Trong thống kê đợt đăng ký tín chỉ
export const LoaiDangKyTinChi = {
	nhuCau: 'Theo nhu cầu',
	tienTrinh: 'Theo đúng tiến trình',
	hocVuot: 'Học vượt',
	hocLai: 'Học lại',
	hocCaiThien: 'Học cải thiện',
	chuaTheoTienTrinh: 'Chưa theo tiến trình',
	ngoaiChuongTrinh: 'Ngoài chương trình đào tạo',
};

export enum ELoaiHocPhanDangKyTinChi {
	NHU_CAU = 'NhuCau',
	TIEN_TRINH = 'TienTrinh',
	HOC_LAI = 'HocLai',
	HOC_VUOT = 'HocVuot',
	CAI_THIEN = 'HocCaiThien',
	// NGANH_2 = 'kyTruoc',
	CHUA_THEO_TIEN_TRINH = 'ChuaTheoTienTrinh',
	HOC_NGOAI = 'NgoaiChuongTrinh',
	// TAT_CA = 'TatCa',
}

export const LoaiHocPhanDangKyTinChi = {
	[ELoaiHocPhanDangKyTinChi.NHU_CAU]: 'Theo nhu cầu',
	[ELoaiHocPhanDangKyTinChi.TIEN_TRINH]: 'Theo đúng tiến trình',
	[ELoaiHocPhanDangKyTinChi.HOC_LAI]: 'Học lại',
	[ELoaiHocPhanDangKyTinChi.HOC_VUOT]: 'Học vượt',
	[ELoaiHocPhanDangKyTinChi.CAI_THIEN]: 'Học cải thiện',
	// [ELoaiHocPhanDangKyTinChi.NGANH_2]: 'Học ngành 2',
	[ELoaiHocPhanDangKyTinChi.CHUA_THEO_TIEN_TRINH]: 'Chưa theo tiến trình',
	[ELoaiHocPhanDangKyTinChi.HOC_NGOAI]: 'Học ngoài CTĐT',
	// [ELoaiHocPhanDangKyTinChi.TAT_CA]: 'Tất cả học phần',
};

// THỜI KHÓA BIỂU
export enum ELoaiHinhHocTap {
	LY_THUYET = 'Lý thuyết',
	THUC_HANH = 'Thực hành',
	THI_NGHIEM = 'Thí nghiệm',
	DO_AN = 'Đồ án tốt nghiệp',
	BAI_TAP = 'Bài tập',
	BAI_TAP_LON = 'Bài tập lớn',
}

// Điểm danh lớp

export enum ETrangThaiLopDiemDanh {
	CHUA_DIEM_DANH = 'CHUA_DIEM_DANH',
	DA_DIEM_DANH = 'DA_DIEM_DANH',
}

export const trangThaiLopDiemDanh: Record<ETrangThaiLopDiemDanh, string> = {
	[ETrangThaiLopDiemDanh.CHUA_DIEM_DANH]: 'Chưa điểm danh',
	[ETrangThaiLopDiemDanh.DA_DIEM_DANH]: 'Đã điểm danh',
};

export const colorTrangThaiLopDiemDanh: Record<ETrangThaiLopDiemDanh, string> = {
	[ETrangThaiLopDiemDanh.CHUA_DIEM_DANH]: 'red',
	[ETrangThaiLopDiemDanh.DA_DIEM_DANH]: 'green',
};

export enum ETrangThaiGiamSat {
	CHUA_GIAM_SAT = 'CHUA_GIAM_SAT',
	OK = 'OK',
	NOK = 'NOK',
}

export const trangThaiGiamSat: Record<ETrangThaiGiamSat, string> = {
	[ETrangThaiGiamSat.CHUA_GIAM_SAT]: 'Chưa giám sát',
	[ETrangThaiGiamSat.OK]: 'Diễn ra bình thường',
	[ETrangThaiGiamSat.NOK]: 'Có vấn đề',
};

export enum ELoaiLopHocPhan {
	CHINH = 'C',
	LY_THUYET = 'LT',
	THUC_HANH = 'TH',
	THI_NGHIEM = 'TN',
	BAI_TAP = 'BT',
	BAI_TAP_LOP = 'BTL',
	DO_AN_TOT_NGHIEP = 'DATN',
}

export const ETenLoaiLopHocPhan: Record<ELoaiLopHocPhan, string> = {
	[ELoaiLopHocPhan.CHINH]: 'Lớp tín chỉ',
	[ELoaiLopHocPhan.LY_THUYET]: 'Lớp lý thuyết',
	[ELoaiLopHocPhan.THUC_HANH]: 'Lớp thực hành',
	[ELoaiLopHocPhan.THI_NGHIEM]: 'Lớp thí nghiệm',
	[ELoaiLopHocPhan.BAI_TAP]: 'Lớp bài tập',
	[ELoaiLopHocPhan.BAI_TAP_LOP]: 'Lớp bài tập lớn',
	[ELoaiLopHocPhan.DO_AN_TOT_NGHIEP]: 'Lớp đồ án tốt nghiệp',
};

export enum ETrangThaiLopHocPhan {
	MO = 'Mở',
	DONG = 'Đóng',
}

export enum EHinhThucGiangDay {
	ONLINE = 'ONLINE',
	TRUC_TIEP = 'TRUC_TIEP',
}

export const hinhThucGiangDay: Record<EHinhThucGiangDay, string> = {
	[EHinhThucGiangDay.ONLINE]: 'Online',
	[EHinhThucGiangDay.TRUC_TIEP]: 'Trực tiếp',
};

// Trạng thái điểm thành phần lớp

export enum ETrangThaiDiemLop {
	CHUA_NOP_DIEM = 'Chưa nộp điểm',
	DA_NOP_DIEM = 'Đã nộp điểm',
	DA_DUYET = 'Đã duyệt',
}

export const colorTrangThaiDiemLop: Record<ETrangThaiDiemLop, string> = {
	[ETrangThaiDiemLop.CHUA_NOP_DIEM]: 'orange',
	[ETrangThaiDiemLop.DA_NOP_DIEM]: 'blue',
	[ETrangThaiDiemLop.DA_DUYET]: 'green',
};

// Trạng thái điểm kết thúc học phần
export enum ETrangThaiDuyetDiem {
	CHUA_DUYET = 'CHUA_DUYET',
	CHUYEN_VIEN_DUYET = 'CHUYEN_VIEN_DUYET',
	QUAN_LY_DUYET = 'QUAN_LY_DUYET',
}

export const colorTrangThaiDuyetDiem: Record<ETrangThaiDuyetDiem, string> = {
	[ETrangThaiDuyetDiem.CHUA_DUYET]: 'orange',
	[ETrangThaiDuyetDiem.CHUYEN_VIEN_DUYET]: 'blue',
	[ETrangThaiDuyetDiem.QUAN_LY_DUYET]: 'green',
};

export const trangThaiDuyetDiem: Record<ETrangThaiDuyetDiem, string> = {
	[ETrangThaiDuyetDiem.CHUA_DUYET]: 'Chưa duyệt',
	[ETrangThaiDuyetDiem.CHUYEN_VIEN_DUYET]: 'Chuyên viên duyệt',
	[ETrangThaiDuyetDiem.QUAN_LY_DUYET]: 'Quản lý duyệt',
};

export const tooltipDuyetDiem: Record<ETrangThaiDuyetDiem, string> = {
	[ETrangThaiDuyetDiem.CHUA_DUYET]: 'Chuyên viên duyệt điểm',
	[ETrangThaiDuyetDiem.CHUYEN_VIEN_DUYET]: 'Quản lý duyệt điểm',
	[ETrangThaiDuyetDiem.QUAN_LY_DUYET]: 'Đã duyệt',
};

// PHÂN CÔNG GIẢNG DẠY
export enum ELoaiPhanCongGiangDay {
	CAN_BO = 'CAN_BO',
	THINH_GIANG = 'THINH_GIANG',
}

export const loaiPhanCongGiangDay: Record<ELoaiPhanCongGiangDay, string> = {
	[ELoaiPhanCongGiangDay.CAN_BO]: 'Giảng viên cơ hữu',
	[ELoaiPhanCongGiangDay.THINH_GIANG]: 'Thỉnh giảng',
};

// DUYỆT GIẢNG DẠY
export enum ETrangThaiDuyetGiangDay {
	DA_DUYET = 'Đã duyệt',
	DANG_XU_LY = 'Đang xử lý',
	CHUA_CO_DANG_KY = 'Chưa có đăng ký',
}

export const colorTrangThaiDuyetGiangDay: Record<ETrangThaiDuyetGiangDay, string> = {
	[ETrangThaiDuyetGiangDay.CHUA_CO_DANG_KY]: 'orange',
	[ETrangThaiDuyetGiangDay.DANG_XU_LY]: 'blue',
	[ETrangThaiDuyetGiangDay.DA_DUYET]: 'green',
};

export enum ELoaiHocLuc {
	XUAT_SAC = 'Xuất sắc',
	GIOI = 'Giỏi',
	KHA = 'Khá',
	TRUNG_BINH = 'Trung bình',
	YEU = 'Yếu',
	KEM = 'Kém',
	EMPTY = 'Chưa xếp loại',
}

export const colorLoaiHocLuc: Record<ELoaiHocLuc, string> = {
	[ELoaiHocLuc.XUAT_SAC]: '#52c41a',
	[ELoaiHocLuc.GIOI]: '#7ecb08',
	[ELoaiHocLuc.KHA]: '#ffee04',
	[ELoaiHocLuc.TRUNG_BINH]: '#ffc20a',
	[ELoaiHocLuc.YEU]: '#ef9b20',
	[ELoaiHocLuc.KEM]: '#ea5545',
	[ELoaiHocLuc.EMPTY]: '#939393',
};

export const localeLoaiHocLuc: Record<ELoaiHocLuc, string> = {
	[ELoaiHocLuc.XUAT_SAC]: 'ketquahoctap.ketquahocky.hocluc.xuatsac',
	[ELoaiHocLuc.GIOI]: 'ketquahoctap.ketquahocky.hocluc.gioi',
	[ELoaiHocLuc.KHA]: 'ketquahoctap.ketquahocky.hocluc.kha',
	[ELoaiHocLuc.TRUNG_BINH]: 'ketquahoctap.ketquahocky.hocluc.trungbinh',
	[ELoaiHocLuc.YEU]: 'ketquahoctap.ketquahocky.hocluc.yeu',
	[ELoaiHocLuc.KEM]: 'ketquahoctap.ketquahocky.hocluc.kem',
	[ELoaiHocLuc.EMPTY]: 'ketquahoctap.ketquahocky.hocluc.chuaxeploai',
};

// LOG Lớp tín chỉ
export enum ELoaiLogLopHocPhan {
	THAY_DOI_HOC_VIEN = 'THAY_DOI_HOC_VIEN',
}

export enum ELoaiThayDoiHocVien {
	HUY = 'HUY',
	CHUYEN = 'CHUYEN',
}

export const LoaiThayDoiHocVien: Record<ELoaiThayDoiHocVien, string> = {
	[ELoaiThayDoiHocVien.CHUYEN]: 'Chuyển lớp',
	[ELoaiThayDoiHocVien.HUY]: 'Hủy',
};

// Loại thời gian nhập điểm học kỳ
export enum ELoaiThoiGianNhapDiem {
	FROM_TO = 'Từ ngày đến ngày',
	NUM_DAY = 'Theo số ngày (kể từ buổi học cuối)',
}

// LOG Nhập điểm
export enum ELoaiLogDiem {
	TP = 'ThanhPhan',
	KTHP = 'KetThucHocPhan',
	DUYET_TP = 'DuyetThanhPhan',
	DUYET_KTHP = 'DuyetKthp',
}

// Nhập điểm: Trạng thái thi
export enum ETrangThaiThi {
	CAM_THI = 'Cấm thi',
	DU_DIEU_KIEN = 'Đủ điều kiện',
}

export enum EValidateKetQuaHocTap {
	//Cảnh báo kết quả học tập
	TONG_SO_TIN_CHI_KHONG_DAT = 'validateTongSoTinChiKhongDat',
	TONG_SO_TIN_CHI_NO_TOAN_KHOA = 'validateTongSoTinChiNoToanKhoa',
	DIEM_TRUNG_BINH_HOC_KY = 'validateDiemTrungBinhHocKy',
	DIEM_TRUNG_BINH_TICH_LUY = 'validateDiemTrungBinhTichLuy',

	//Cảnh báo thôi học
	SO_LAN_CANH_BAO = 'validateSoLanCanhBao',
	CANH_BAO_LIEN_TIEP = 'validateCanhBaoLienTiep',
	TU_BO_HOC = 'validateTuBoHoc',
	KY_LUAT = 'validateKyLuat',
	KHONG_HOAN_THANH_HOC_PHI = 'validateKhongHoanThanhHocPhi',
	// THOI_GIAN_HOC = 'validateThoiGianHoc',
}

export const validateKetQuaHocTap: Record<EValidateKetQuaHocTap, string> = {
	//Cảnh báo kết quả học tập
	[EValidateKetQuaHocTap.TONG_SO_TIN_CHI_KHONG_DAT]: 'Tổng số tín chỉ không đạt',
	[EValidateKetQuaHocTap.TONG_SO_TIN_CHI_NO_TOAN_KHOA]: 'Tổng số tín chỉ nợ toàn khóa',
	[EValidateKetQuaHocTap.DIEM_TRUNG_BINH_HOC_KY]: 'Điểm trung bình học kỳ',
	[EValidateKetQuaHocTap.DIEM_TRUNG_BINH_TICH_LUY]: 'Điểm trung bình tích lũy',

	//Cảnh báo thôi học
	[EValidateKetQuaHocTap.SO_LAN_CANH_BAO]: 'Số lần cảnh báo',
	[EValidateKetQuaHocTap.CANH_BAO_LIEN_TIEP]: 'Cảnh báo liên tiếp',
	[EValidateKetQuaHocTap.TU_BO_HOC]: 'Tự bỏ học',
	[EValidateKetQuaHocTap.KY_LUAT]: 'Kỷ Luật',
	[EValidateKetQuaHocTap.KHONG_HOAN_THANH_HOC_PHI]: 'Không hoàn thành học phí',
	// [EValidateKetQuaHocTap.THOI_GIAN_HOC]: 'Thời gian học',
};

export enum ELoaiHpSv {
	THEO_KE_HOACH = 'THEO_KE_HOACH',
	HOC_CAI_THIEN = 'HOC_CAI_THIEN',
	HOC_LAI = 'HOC_LAI',
}

export const loaiHocSv: Record<ELoaiHpSv, string> = {
	[ELoaiHpSv.THEO_KE_HOACH]: 'Đúng chương trình',
	[ELoaiHpSv.HOC_CAI_THIEN]: 'Học cải thiện',
	[ELoaiHpSv.HOC_LAI]: 'Học lại',
};
