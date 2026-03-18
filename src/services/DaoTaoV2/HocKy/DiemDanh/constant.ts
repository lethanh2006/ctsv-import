export enum ELoaiDiemDanh {
	HOC_TAP = 'HOC_TAP',
}

export enum ETrangThaiUserDiemDanh {
	CO_MAT = 'CO_MAT',
	VANG_CO_PHEP = 'VANG_CO_PHEP',
	VANG_KHONG_PHEP = 'VANG_KHONG_PHEP',
	CHUA_DIEM_DANH = 'CHUA_DIEM_DANH',
}

export const trangThaiUserDiemDanh: Record<ETrangThaiUserDiemDanh, string> = {
	[ETrangThaiUserDiemDanh.CO_MAT]: 'Có mặt',
	[ETrangThaiUserDiemDanh.VANG_CO_PHEP]: 'Vắng có phép',
	[ETrangThaiUserDiemDanh.VANG_KHONG_PHEP]: 'Vắng không phép',
	[ETrangThaiUserDiemDanh.CHUA_DIEM_DANH]: 'Chưa điểm danh',
};

export const colorTrangThaiUserDiemDanh: Record<ETrangThaiUserDiemDanh, string> = {
	[ETrangThaiUserDiemDanh.CO_MAT]: 'green',
	[ETrangThaiUserDiemDanh.VANG_CO_PHEP]: 'blue',
	[ETrangThaiUserDiemDanh.VANG_KHONG_PHEP]: 'orange',
	[ETrangThaiUserDiemDanh.CHUA_DIEM_DANH]: 'red',
};
