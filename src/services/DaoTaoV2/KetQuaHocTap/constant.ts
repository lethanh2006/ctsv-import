import { ETrangThaiSinhVienDot } from '@/services/constant';
import type { DotQuyDoiDiem } from './DotQuyDoiDiem/typing';
import type { XetHocVu } from './XetHocVu/typing';

export enum ELoaiDiemChu {
	A_PLUS = 'A+',
	A = 'A',
	// A_MINUS = 'A-',
	B_PLUS = 'B+',
	B = 'B',
	// B_MINUS = 'B-',
	C_PLUS = 'C+',
	C = 'C',
	// C_MINUS = 'C-',
	D_PLUS = 'D+',
	D = 'D',
	// D_MINUS = 'D-',
	PASS = 'P',
	// CR = 'CR',
	F = 'F',
	// NCR = 'NCR',
	HOAN_THI = 'I', // hoãn thi (Incomplete)
	CHUA_DU_DU_LIEU = 'X', // chưa đủ dữ liệu
	MIEN_THI = 'M', // miễn thi
	// IP = 'IP', // In Progress
	// MT = 'MT', // Multi-term
	// NGR = 'NGR',
	// W = 'W', // rút khỏi khóa học (Withdrawn)
	// DAT_NGOAI_CHUONG_TRINH = 'S', // Đạt ngoài chương trình Stastifcation
	// KHONG_DAT_NGOAI_CHUONG_TRINH = 'U', // Không đạt ngoài chương trình Unsatisfactory
}

export const ColorDiemChu: Record<ELoaiDiemChu, string> = {
	[ELoaiDiemChu.A_PLUS]: '#13b755',
	[ELoaiDiemChu.A]: '#13b755',
	// [ELoaiDiemChu.A_MINUS]: '#13b755',
	[ELoaiDiemChu.B_PLUS]: '#33adff',
	[ELoaiDiemChu.B]: '#33adff',
	// [ELoaiDiemChu.B_MINUS]: '#33adff',
	[ELoaiDiemChu.C_PLUS]: '#ffab50',
	[ELoaiDiemChu.C]: '#ffab50',
	// [ELoaiDiemChu.C_MINUS]: '#ffab50',
	[ELoaiDiemChu.D_PLUS]: '#ff7171',
	[ELoaiDiemChu.D]: '#ff7171',
	// [ELoaiDiemChu.D_MINUS]: '#ff7171',
	[ELoaiDiemChu.F]: '#a90b00',
	// [ELoaiDiemChu.NCR]: '#a90b00',
	[ELoaiDiemChu.PASS]: '#13b755',
	// [ELoaiDiemChu.CR]: '#13b755',
	[ELoaiDiemChu.HOAN_THI]: 'rgb(173 173 173)',
	[ELoaiDiemChu.CHUA_DU_DU_LIEU]: 'rgb(173 173 173)',
	[ELoaiDiemChu.MIEN_THI]: '#13b755',
	// [ELoaiDiemChu.IP]: 'rgb(173 173 173)',
	// [ELoaiDiemChu.MT]: '#13b755',
	// [ELoaiDiemChu.NGR]: 'rgb(173 173 173)',
	// [ELoaiDiemChu.W]: 'rgb(173 173 173)',
	// [ELoaiDiemChu.DAT_NGOAI_CHUONG_TRINH]: '#13b755',
	// [ELoaiDiemChu.KHONG_DAT_NGOAI_CHUONG_TRINH]: '#a90b00',
};

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

export const localeTrinhDoKqhtHocKy: Record<ETrinhDoKqhtHocKy, string> = {
	[ETrinhDoKqhtHocKy.NAM_THU_1]: 'ketquahoctap.ketquahocky.trinhdo.namthu1',
	[ETrinhDoKqhtHocKy.NAM_THU_2]: 'ketquahoctap.ketquahocky.trinhdo.namthu2',
	[ETrinhDoKqhtHocKy.NAM_THU_3]: 'ketquahoctap.ketquahocky.trinhdo.namthu3',
	[ETrinhDoKqhtHocKy.NAM_THU_4]: 'ketquahoctap.ketquahocky.trinhdo.namthu4',
	[ETrinhDoKqhtHocKy.NAM_THU_5]: 'ketquahoctap.ketquahocky.trinhdo.namthu5',
};

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

export const fieldTrangThaiSinhVienQuyDoiDiem: Record<ETrangThaiSinhVienDot, keyof DotQuyDoiDiem.IThongKeSVQuyDoiDiem> =
	{
		[ETrangThaiSinhVienDot.CHO_XU_LY]: 'choXuLy',
		[ETrangThaiSinhVienDot.DA_RA_QUYET_DINH]: 'daRaQuyetDinh',
		[ETrangThaiSinhVienDot.KHONG_DUYET]: 'khongCongNhan',
	};

export enum EMinhChungQuyDoiDiem {
	HOC_PHAN = 'Học phần',
	CHUNG_CHI = 'Chứng chỉ',
}

export enum ETrinhDoMinhChungQuyDoiDiem {
	CAO_DANG = 'Cao đẳng',
	DAI_HOC = 'Đại học',
}

export enum ELoaiHocPhanMinhChung {
	NGOAI_CHUONG_TRINH = 'Ngoài chương trình',
	TRONG_CHUONG_TRINH = 'Trong chương trình',
}

export enum ELoaiXuLyKQHT {
	CANH_BAO_HOC_TAP = 'CANH_BAO_HOC_TAP',
	THU_THACH = 'THU_THACH',
	BUOC_THOI_HOC = 'BUOC_THOI_HOC',
}

export const loaiXuLyKQHT: Record<ELoaiXuLyKQHT, string> = {
	[ELoaiXuLyKQHT.CANH_BAO_HOC_TAP]: 'sinhvien.xethocvu.loaixulykqht.canhBaoHocTap',
	[ELoaiXuLyKQHT.THU_THACH]: 'sinhvien.xethocvu.loaixulykqht.thuThach',
	[ELoaiXuLyKQHT.BUOC_THOI_HOC]: 'sinhvien.xethocvu.loaixulykqht.buocThoiHoc',
};

export const colorLoaiXuLyKQHT: Record<ELoaiXuLyKQHT, string> = {
	[ELoaiXuLyKQHT.CANH_BAO_HOC_TAP]: 'orange',
	[ELoaiXuLyKQHT.THU_THACH]: 'blue',
	[ELoaiXuLyKQHT.BUOC_THOI_HOC]: 'red',
};

export enum ETrangThaiDuyetXuLyKqht {
	CHO_DUYET = 'Chờ duyệt',
	DA_DUYET = 'Đã duyệt',
	KHONG_DUYET = 'Không duyệt',
}
