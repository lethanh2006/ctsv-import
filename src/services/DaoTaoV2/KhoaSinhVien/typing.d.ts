declare module KhoaSinhVien {
	export interface IRecord {
		_id: string;
		ma: string;
		ten: string;
		namHocBatDau: number;
		createdAt: string;
		updatedAt: string;
		namHocId: number;
		maHinhThucDaoTao: string;
		maTrinhDoDaoTao: string;
		hinhThucDaoTao: {
			_id: string;
			danhMucHTDTId: string;
			maDmHinhThuc: string;
			ma: string;
			ten: string;
			createdAt: string;
			updatedAt: string;
			canCuId: string;
		};
		trinhDoDaoTao: {
			_id: string;
			dmTrinhDoId: string;
			maDmTrinhDo: string;
			ma: string;
			ten: string;
			canCuId: string;
			createdAt: string;
			updatedAt: string;
			dmTrinhDo: {
				_id: string;
				ma: string;
				ten: string;
				createdAt: string;
				updatedAt: string;
			};
		};
	}
}
