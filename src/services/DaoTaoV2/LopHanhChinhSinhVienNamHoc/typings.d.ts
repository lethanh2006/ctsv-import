import type { LopHanhChinh } from '../NamHoc/LopHanhChinh/typings';
import type { NamHoc } from '../NamHoc/NamHoc/typings';
import type { SinhVien } from '../SinhVien/typings';
import type { EVaiTroBanCanSuLop } from './constants';

declare module LopHanhChinhSinhVienNamHoc {
	export interface IRecord {
		_id: string;
		lopHcSvId: string;
		maNamHoc: string;
		namHoc: NamHoc.IRecord;
		vaiTro: EVaiTroBanCanSuLop;
		lopHcSv: {
			sinhVien: SinhVien.IRecord;
			lopHanhChinh: LopHanhChinh.IRecord;
		};
	}
}
