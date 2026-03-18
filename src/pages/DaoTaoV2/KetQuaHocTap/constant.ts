import type { DotQuyDoiDiem } from './DotQuyDoiDiem/typing';
import type { XetHocVu } from './XetHocVu/typing';

export enum ELoaiDiemChu {
	// A_PLUS = 'A+',
	A = 'A',
	B_PLUS = 'B+',
	B = 'B',
	C_PLUS = 'C+',
	C = 'C',
	D_PLUS = 'D+',
	D = 'D',
	F = 'F',
	HOAN_THI = 'I', // hoãn thi
	CHUA_DU_DU_LIEU = 'X', // chưa đủ dữ liệu
	MIEN_THI = 'R', // miễn thi
}

export enum ELoaiThoiHoc {
	THOI_HOC = 'Thôi học',
	BUOC_THOI_HOC = 'Buộc thôi học',
}

export enum ETrangThaiCongNhanKqht {
	DANG_XU_LY = 'Đang xử lý',
	DA_XU_LY = 'Đã xử lý',
}

export enum ETrinhDoKqhtHocKy {
	NAM_THU_1 = 'Năm thứ nhất',
	NAM_THU_2 = 'Năm thứ hai',
	NAM_THU_3 = 'Năm thứ ba',
	NAM_THU_4 = 'Năm thứ bốn',
	NAM_THU_5 = 'Năm thứ năm',
}

// ĐỢT XÉT HỌC VỤ

// HỘI ĐỒNG
export enum ELoaiThanhPhanHoiDong {
	CHU_TICH = 'Chủ tịch hội đồng',
	UY_VIEN_TT = 'Ủy viên thường trực',
	UY_VIEN = 'Ủy viên',
}

// CẢNH BÁO HỌC TẬP
export enum ETrangThaiDuyetCanhBao {
	CHO_DUYET = 'Chờ duyệt',
	DA_DUYET = 'Đã duyệt',
	KHONG_DUYET = 'Không duyệt',
}

export const colorTrangThaiDuyetCanhBao: Record<ETrangThaiDuyetCanhBao, string> = {
	[ETrangThaiDuyetCanhBao.CHO_DUYET]: 'blue',
	[ETrangThaiDuyetCanhBao.DA_DUYET]: 'green',
	[ETrangThaiDuyetCanhBao.KHONG_DUYET]: 'orange',
};

export const fieldTrangThaiDuyetCanhBao: Record<ETrangThaiDuyetCanhBao, keyof XetHocVu.TThongKeSV> = {
	[ETrangThaiDuyetCanhBao.CHO_DUYET]: 'choDuyet',
	[ETrangThaiDuyetCanhBao.DA_DUYET]: 'daDuyet',
	[ETrangThaiDuyetCanhBao.KHONG_DUYET]: 'khongDuyet',
};

export enum EYKienCoVanHocTap {
	DONG_Y = 'Đồng ý',
	KHONG_DONG_Y = 'Không đồng ý',
	CHUA_CO_Y_KIEN = 'Chưa có ý kiến',
}

export const colorYKienCoVanHocTap: Record<EYKienCoVanHocTap, string> = {
	[EYKienCoVanHocTap.DONG_Y]: 'green',
	[EYKienCoVanHocTap.CHUA_CO_Y_KIEN]: 'blue',
	[EYKienCoVanHocTap.KHONG_DONG_Y]: 'orange',
};

export enum ETrangThaiPhieuQuyDoiDiem {
	CHO_XU_LY = 'Chờ xử lý',
	DA_CO_KET_QUA = 'Đã có kết quả',
	DA_RA_QUYET_DINH = 'Đã ra quyết định',
}

export const colorTrangThaiPhieuQuyDoiDiem: Record<ETrangThaiPhieuQuyDoiDiem, string> = {
	[ETrangThaiPhieuQuyDoiDiem.CHO_XU_LY]: 'blue',
	[ETrangThaiPhieuQuyDoiDiem.DA_CO_KET_QUA]: 'orange',
	[ETrangThaiPhieuQuyDoiDiem.DA_RA_QUYET_DINH]: 'green',
};

export const fieldTrangThaiSinhVienQuyDoiDiem: Record<
	ETrangThaiPhieuQuyDoiDiem,
	keyof DotQuyDoiDiem.IThongKeSVQuyDoiDiem
> = {
	[ETrangThaiPhieuQuyDoiDiem.CHO_XU_LY]: 'choXuLy',
	[ETrangThaiPhieuQuyDoiDiem.DA_CO_KET_QUA]: 'daCoKetQua',
	[ETrangThaiPhieuQuyDoiDiem.DA_RA_QUYET_DINH]: 'daRaQuyetDinh',
};

export enum EMinhChungQuyDoiDiem {
	HOC_PHAN = 'Học phần',
	CHUNG_CHI = 'Chứng chỉ',
}

export enum ETrinhDoMinhChungQuyDoiDiem {
	DAI_HOC = 'Đại học',
	CAO_DANG = 'Cao đẳng',
}

export enum ELoaiHocPhanMinhChung {
	NGOAI_CHUONG_TRINH = 'Ngoài chương trình',
	TRONG_CHUONG_TRINH = 'Trong chương trình',
}

export enum ETrangThaiHocPhanQuyDoi {
	CHO_XU_LY = 'Chờ xử lý',
	CONG_NHAN = 'Công nhận',
	XIN_Y_KIEN_HOI_DONG = 'Xin ý kiến hội đồng',
	KHONG_CONG_NHAN = 'Không công nhận',
	DA_RA_QUYET_DINH = 'Đã ra quyết định',
}

export const colorTrangThaiHocPhanQuyDoi: Record<ETrangThaiHocPhanQuyDoi, string> = {
	[ETrangThaiHocPhanQuyDoi.CHO_XU_LY]: 'blue',
	[ETrangThaiHocPhanQuyDoi.CONG_NHAN]: 'orange',
	[ETrangThaiHocPhanQuyDoi.XIN_Y_KIEN_HOI_DONG]: 'purple',
	[ETrangThaiHocPhanQuyDoi.KHONG_CONG_NHAN]: 'red',
	[ETrangThaiHocPhanQuyDoi.DA_RA_QUYET_DINH]: 'green',
};
