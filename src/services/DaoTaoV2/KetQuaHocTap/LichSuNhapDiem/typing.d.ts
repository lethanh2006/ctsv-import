import { type ELoaiLogDiem } from '../../HocKy/constant';

declare module LichSuNhapDiem {
	export interface IRecord {
		_id: string;
		maSinhVien?: string;
		tenSinhVien?: string;
		sinhVienSsoId?: string;
		lopHocPhanId?: string;
		maHocPhan?: string;
		noiDung: string;

		loaiDiem: string;
		diemCu: number;
		diemMoi: number;
		loaiLogDiem: ELoaiLogDiem;
		timestamp: string;

		editedByFullname?: string;
		editedBySsoId: string;
		editedByUsername: string;
	}
}
