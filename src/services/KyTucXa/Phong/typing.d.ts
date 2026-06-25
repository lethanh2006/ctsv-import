declare module PhongKTX {
	export interface IRecord {
		_id: string;
		ma: string;
		ten?: string;

		maGioiTinh?: EGioiTinh | string;
		soLuongToiDa?: number;
		soLuongHienTai?: number;
		cachBoTri?: string;
		maKhoanThuPhong?: string;
		maKhoanThuCoc?: string;
		moTa?: string;
		danhSachAnh?: string[];
		danhSachTienIch: ITienIch[];
		maToaNha?: string;
		toaNha?: ToaNha.IRecord;
		tangThu?: number;
		soPhongTam?: number;
		maLoaiPhongKtx?: string;
		loaiPhongKtx?: any;
		isChoThue?: boolean;
		disableUpdate?: boolean;

		dangKyKyTucXaRule?: {
			_id?: string;
			phongId?: string;
			gioiTinh?: EGioiTinh | string;
			maxPerKhoa?: number | null;
			quocTichPhong?: string | null;
		};
	}

	export interface IThongKePhong {
		tongQuan: {
			soLuongPhongChoThue: number;
			tongSoPhong: number;
			tongSucChua: number;
			soLuongSinhVienDaDangKy: number;
			soLuongChoConTrong: number;
		};
		bieuDoLapDayToaNha: {
			maToaNha: string;
			tenToaNha: string;
			sinhVienDaDangKy: number;
			tongSucChua: number;
			tiLeLapDay: number;
		}[];
	}
}
