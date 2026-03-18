import { type HocPhan } from '@/services/DaoTaoV2/DanhMucHeThong/HocPhan/typings';
import type { ETrangThaiYKienHocPhan } from '@/services/DaoTaoV2/DanhMucHeThong/constant';
import { type SinhVien } from '@/services/SinhVien/typings';
import type { HocKy } from '../HocKy/typing';
import type { ELoaiNhuCauHocPhan } from '@/services/constant';

declare module DangKyNhuCau {
	export interface IDotDangKy {
		_id: string;
		ten: string;
		maHocKy: string;
		hocKy?: HocKy.IRecord;
		thoiGianBatDau: string;
		thoiGianKetThuc: string;
		khoaNganhList?: KhoaNganh.IRecord[];
		sinhVienList?: SinhVien.IRecord[];

		active?: boolean;
	}

	export interface IDotDangKyKhoaNganh {
		_id: string;
		dotDangKyNhuCauId: string;
		dotDangKyNhuCau: IDotDangKy;
		maKhoaNganh: string;
		khoaNganh: KhoaNganh.IRecord;
	}

	export interface IDangKyNhuCau {
		_id: string;
		dotDkNhuCauId: string;
		dotDkNhuCau: IDotDangKy;
		sinhVienSsoId: string;
		sinhVien: SinhVien.IRecord;
		tongSoNhuCau: number;
	}

	export interface INhuCauHocPhan extends TSoNhuCauHocPhan {
		_id: string;
		// banDkNhuCauId?: string; // FAKE
		maHocKy: string;
		hocKy?: HocKy.IRecord;
		maHocPhan: string;
		hocPhan: HocPhan.IRecord;
		maKhoaNganh: string;
		khoaNganh?: KhoaNganh.IRecord;
		// loaiNhuCauHocPhan: ELoaiNhuCauHocPhan;

		// Đơn vị gửi ý kiến
		idCanBoGuiYKien?: string;
		hoTenCanBoGuiYKien?: string;
		// maDonVi?: string;
		// donVi?: ToChucNhanSu.IDonVi;
		yKien?: string;
		thoiGianGuiYKien?: string;
		trangThaiYKien?: ETrangThaiYKienHocPhan;
	}

	export type TSoNhuCauHocPhan = Record<ELoaiNhuCauHocPhan, number>;

	// export interface ITongHopNhuCau extends Record<ELoaiNhuCauHocPhan, number> {
	// 	maHocPhan: string; //'DHKT03';
	// 	tenHocPhan: string; //'Kinh tế vi mô';
	// 	soTinChi: number;
	// 	tongNhuCau: number;
	// 	'Khóa ngành': string[];
	// 	'SL theo KHHT chuẩn': number;
	// }
}
