import { type DiemHocPhan } from '../DiemHocPhan/typing';
import { type ELoaiDiemChu, type ETrangThaiCongNhanKqht } from '@/services/constant';

declare module CongNhanKQHT {
	export interface IRecord {
		_id: string;
		sinhVienSsoId: string;
		sinhVien?: SinhVien.IRecord;
		hocPhanId: string;
		hocPhan?: HocPhan.IRecord;
		trangThai: ETrangThaiCongNhanKqht; // 'Đang xử lý';
		diemTongKetQuyDoi: number; //0;
		diemThang4QuyDoi: number;
		diemChuQuyDoi: ELoaiDiemChu; // 'A+';
		minhChungId: string;
		minhChung?: IMinhChungKQHT;
	}

	export interface IMinhChungKQHT {
		_id: string;
		diemHocPhanId: string;
		diemHocPhan?: DiemHocPhan.IRecord;
		urlMinhChung: string;
	}
}
