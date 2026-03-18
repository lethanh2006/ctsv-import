declare module NhomNganhDaoTao {
	export interface IRecordBo {
		_id: string;
		ten: string;
		ma: string;
		maDmLinhVucDaoTao?: string;
		dmLinhVucDaoTao?: LinhVucDaoTao.IRecordBo;
		createdAt?: string;
		updatedAt?: string;
	}

	export interface IRecordByLinhVuc {
		// _id: string; //'643d1f73e5d0f0aacc495a81';
		ma: string; //'01';
		ten: string; //'Chương trình cơ bản';
		count: number; //4;
		nhomNganhList?: IRecordBo[];
	}
}
