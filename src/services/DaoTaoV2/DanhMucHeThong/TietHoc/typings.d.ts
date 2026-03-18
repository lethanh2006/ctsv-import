declare module TietHoc {
	export interface IRecordCoSo {
		_id: string;
		tietHoc: number;
		maNhomTietHoc: string;
		nhomTietHoc: NhomTietHoc.IRecordCoSo;
		timeBatDau: string;
		timeKetThuc: string;
	}
}
