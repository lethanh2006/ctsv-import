export enum ELoaiThongKeQuyTrinhDong {
	AGGREGATION = 'Aggregation',
	CUSTOM = 'Custom',
}

export enum ELoaiBieuDoThongKe {
	TABLE = 'Bảng',
	DONUT = 'Biểu đồ tròn',
	COLUMN = 'Biểu đồ cột',
}

export const MapKeyLoaiThongKe = {
	[ELoaiThongKeQuyTrinhDong.AGGREGATION]: 'Tổng hợp',
	[ELoaiThongKeQuyTrinhDong.CUSTOM]: 'Tùy biến',
};

export enum ELoaiFilterThongKe {
	DOT = 'Theo đợt',
	TRUONG_THONG_TIN = 'Theo trường thông tin',
}
