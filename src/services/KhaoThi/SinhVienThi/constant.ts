export enum ETrangThaiSinhVienThi {
	CHUA_DUYET = 'Chưa duyệt',
	DU_DIEU_KIEN = 'Đủ điều kiện',
	KHONG_DU_DIEU_KIEN = 'Không đủ điều kiện',
	HOAN_THI = 'Hoãn thi',
}

export const colorTrangThaiSinhVienThi: Record<ETrangThaiSinhVienThi, string> = {
	[ETrangThaiSinhVienThi.CHUA_DUYET]: 'default',
	[ETrangThaiSinhVienThi.DU_DIEU_KIEN]: 'green',
	[ETrangThaiSinhVienThi.KHONG_DU_DIEU_KIEN]: 'orange',
	[ETrangThaiSinhVienThi.HOAN_THI]: 'purple',
};

export enum ETrangThaiChamLai {
	PHUC_KHAO = 'Phúc khảo',
	THAM_DINH = 'Thẩm định',
}

export enum ELyDoThamDinh {
	CHENH_LECH = 'Chênh lệch',
	THAM_DINH = 'Thẩm định',
	THAM_DINH_YEU_CAU = 'Thẩm định theo yêu cầu',
}

export enum EDieuKienHocTap {
	DAT = 'Đạt',
	KHONG_DAT = 'Không đạt',
}

export enum EDieuKienCongNo {
	DU = 'Đủ',
	CHUA_DU = 'Chưa đủ',
	MIEN = 'Miễn',
}

export const MapKeyColorDieuKienHocTap = {
	[EDieuKienHocTap.DAT]: '#52c41a',
	[EDieuKienHocTap.KHONG_DAT]: '#ea5545',
};

export const MapKeyColorDieuKienCongNo = {
	[EDieuKienCongNo.DU]: '#52c41a',
	[EDieuKienCongNo.CHUA_DU]: '#ea5545',
	[EDieuKienCongNo.MIEN]: '#0d6efd',
};

export enum ELoaiThi {
	LAN_1 = 'Lần 1',
	THI_LAI = 'Thi lại',
}

export enum ETrangThaiDuThi {
	OK = 'OK',
	C = 'C',
	V = 'V',
	DC = 'DC',
	H = 'H',
	M = 'M',
}

export const trangThaiDuThi: Record<ETrangThaiDuThi, string> = {
	[ETrangThaiDuThi.OK]: 'Có dự thi',
	[ETrangThaiDuThi.C]: 'Cấm thi',
	[ETrangThaiDuThi.V]: 'Vắng thi',
	[ETrangThaiDuThi.DC]: 'Đình chỉ thi',
	[ETrangThaiDuThi.H]: 'Hoãn thi',
	[ETrangThaiDuThi.M]: 'Miễn thi',
};
