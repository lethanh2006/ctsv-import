/** Các tuần học highlight trong khi hiển thị kế hoạch năm học */
export const tuanHocHighlight = APP_CONFIG_KE_HOACH_NAM_HIGHLIGHT_TUAN?.split(',') ?? [];

export enum ETrangThaiYKienKeHoachNamHoc {
	CHO_DUYET = 'Chờ duyệt',
	DUYET = 'Duyệt',
	KHONG_DUYET = 'Không duyệt',
}

export const colorTrangThaiYKienKeHoachNamHoc: Record<ETrangThaiYKienKeHoachNamHoc, string> = {
	[ETrangThaiYKienKeHoachNamHoc.CHO_DUYET]: 'blue',
	[ETrangThaiYKienKeHoachNamHoc.DUYET]: 'green',
	[ETrangThaiYKienKeHoachNamHoc.KHONG_DUYET]: 'red',
};

export enum EDoiTuongLopHanhChinh {
	TC = 'TC',
	LK = 'LK',
	CLC = 'CLC',
	PH = 'PH',
}

export const doiTuongLopHanhChinh: Record<EDoiTuongLopHanhChinh, string> = {
	[EDoiTuongLopHanhChinh.TC]: 'Tiêu chuẩn',
	[EDoiTuongLopHanhChinh.LK]: 'Liên kết',
	[EDoiTuongLopHanhChinh.CLC]: 'Chất lượng cao',
	[EDoiTuongLopHanhChinh.PH]: 'Phân hiệu',
};
