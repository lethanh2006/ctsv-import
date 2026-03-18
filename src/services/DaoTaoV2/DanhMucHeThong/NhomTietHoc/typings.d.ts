declare module NhomTietHoc {
	export interface IRecordCoSo {
		_id: string;
		ma: string;
		ten: string;
		active: boolean;

		maTrinhDoDaoTao: string;
		trinhDoDaoTao?: TrinhDoDaoTao.IRecordCoSo;
		maHinhThucDaoTao: string;
		hinhThucDaoTao: HinhThucDaoTao.IRecordCoSo;

		tietHocList?: TietHoc.IRecordCoSo[];
	}
}
