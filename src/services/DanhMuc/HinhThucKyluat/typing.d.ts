declare module HinhThucKyLuat {
	export interface IRecord {
		_id: string;
		ma: string;
		ten: string;
		soThuTu: number;
		moTa: string;
		suDung: boolean;
		capKyLuatId: string;
		capKyLuat?: CapKyLuat.IRecord;
	}
}
