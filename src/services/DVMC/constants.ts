import { unitName } from '../base/constant';

const appBasePath = process.env.APP_CONFIG_BASE_PATH || '/';

export enum MaDichVuVps {
	MUON_OTO = 'MUON_OTO',
	MUON_PHONG_HOC = 'MUON_PHONG_HOC',
	BAO_CAO_SU_CO = 'BAO_CAO_SU_CO',
}
export const accessFileUpload = {
	doc: '.doc,.docx',
	excel: '.xlsm, .xls, .xlsx',
	image: '.png, .jpg, .jpeg',
	pdf: '.pdf',
};
export enum TrangThaiBuoc {
	OK = 'Đã duyệt',
	NOT_OK = 'Không duyệt',
	PROCESSING = 'Đang xử lý',
}

export enum TrangThaiThaoTac {
	PENDING = 'Chưa duyệt',
	OK = 'Đã duyệt',
	NOT_OK = 'Không duyệt',
}
export const Setting = {
	navTheme: 'dark',
	primaryColor: '#007EB9',
	layout: 'mix',
	contentWidth: 'Fluid',
	fixedHeader: false,
	fixSiderbar: true,
	colorWeak: false,
	title: 'PTIT S-Link',
	pwa: false,
	logo: `${appBasePath}favicon.ico`,
	iconfontUrl: '',
	version: 'v1.0',
	tenTruong: unitName,
};
export const LevelDonViHanhChinh = ['Tỉnh', 'Tỉnh, quận', 'Tỉnh, quận, xã', 'Tỉnh, quận, xã, số nhà tên đường'];

export const LevelCCCD = ['Số CMT/CCCD', 'Số CMT/CCCD, ngày cấp', 'Số CMT/CCCD, ngày cấp, nơi cấp'];
export enum ElementTemplateType {
	TEXT_INPUT = 'Nhập Text 1 dòng',
	TEXT_AREA = 'Nhập Text nhiều dòng',
	INPUT_NUMBER = 'Nhập số',
	DATE_PICKER = 'Chọn ngày tháng',
	UPLOAD_SINGLE = 'Chọn 1 file',
	UPLOAD_MULTI = 'Chọn nhiều file',
	DROP_LIST_SINGLE = 'Lựa chọn một (dạng Droplist)',
	DROP_LIST_MULTI = 'Lựa chọn nhiều (dạng Droplist)',
	RADIO_BUTTON = 'Lựa chọn một (Radio)',
	CHECKLIST = 'Lựa chọn nhiều (Checklist)',
	DON_VI_HANH_CHINH = 'Đơn vị hành chính',
	TABLE = 'Dạng bảng',
	MY_SEMESTER = 'Kỳ học của sinh viên',
	MY_YEAR = 'Năm học của sinh viên',
	MY_CREDIT = 'Môn học của sinh viên',
	// CREDIT = 'Môn học',
	MY_COURSE = 'Lớp tín chỉ của sinh viên',
	// _OTO = 'Dịch vụ Ô-tô',
	TEXT_BLOCK = 'Đoạn văn bản',
	DAN_TOC = 'Dân tộc',
	TON_GIAO = 'Tôn giáo',
	// HOC_PHAN_CO_DIEM = 'Học phần có điểm',
	// CMT_CCCD = 'CMT/CCCD',
	// BUTTON_SEARCH_PHONG = 'Button tìm phòng VPS',
}
export enum EFileType {
	doc = 'Tài liệu (doc, docx)',
	pdf = 'Tài liệu (pdf)',
	excel = 'Excel (xlsx, xls)',
	image = 'Ảnh (png, jpg, jpeg)',
}
export enum LoaiDoiTuongXuLyQuyTrinh {
	DON_VI_CU_THE = 'Đơn vị cụ thể',
	DON_VI_QUAN_LY = 'Đơn vị quản lý',
	// CO_VAN_HOC_TAP = 'Cố vấn học tập',
}
export enum TrangThaiDonDVMC {
	OK = 'Đã duyệt',
	NOT_OK = 'Không duyệt',
	PROCESSING = 'Đang xử lý',
}
export enum ColorTrangThaiDonMotCua {
	PENDING = 'gray',
	OK = '#28a745cc',
	NOT_OK = 'red',
	PROCESSING = 'yellow',
}
export enum TrangThaiThanhToan {
	open = 'open',
	paid = 'paid',
	overpaid = 'overpaid',
}
export const MapKeyTrangThaiThanhToan = {
	[TrangThaiThanhToan.open]: 'Chưa thanh toán đủ',
	[TrangThaiThanhToan.paid]: 'Đã thanh toán đủ',
	[TrangThaiThanhToan.overpaid]: 'Thanh toán thừa',
};
