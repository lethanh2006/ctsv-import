// export enum ETrangThaiTiepNhanMinhChung {
// 	CHO_XU_LY = 'Chờ xử lý',
// 	DUYET = 'Duyệt',
// 	KHONG_DUYET = 'Không duyệt',
// }
export enum ETrangThaiTiepNhanMinhChung {
	CHO_XU_LY = 'Chờ xử lý',
	XAC_NHAN = 'Xác nhận',
	DUYET = 'Duyệt',
	KHONG_DUYET = 'Không duyệt',
}

export const MapTitleETrangThaiTiepNhanMinhChung = {
	[ETrangThaiTiepNhanMinhChung.DUYET]: 'CVHT duyệt',
	[ETrangThaiTiepNhanMinhChung.XAC_NHAN]: 'Khoa xác nhận',
	[ETrangThaiTiepNhanMinhChung.CHO_XU_LY]: 'Chờ xử lý',
	[ETrangThaiTiepNhanMinhChung.KHONG_DUYET]: 'CVHT không duyệt',
};

export const MapColorETrangThaiTiepNhanMinhChung = {
	[ETrangThaiTiepNhanMinhChung.CHO_XU_LY]: '#1890ff',
	[ETrangThaiTiepNhanMinhChung.DUYET]: '#28a745',
	[ETrangThaiTiepNhanMinhChung.KHONG_DUYET]: '#dc3545',
	[ETrangThaiTiepNhanMinhChung.XAC_NHAN]: '#28a745',
};
