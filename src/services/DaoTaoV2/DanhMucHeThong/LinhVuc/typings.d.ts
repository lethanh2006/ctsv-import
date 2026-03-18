declare module LinhVucDaoTao {
	export interface IRecordBo {
		_id: string;
		ma: string;
		ten: string;
		maDmKhoiNganh: string;
		dmKhoiNganh?: KhoiNganhDaoTao.IRecordBo;
		createdAt?: string;
		updatedAt?: string;
	}
}
