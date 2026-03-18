import { type ELoaiBieuMau } from '../constant';

declare module BieuMau {
	export interface IRecord {
		_id: string;
		tieuDe: string;
		moTa: string;
		// phamVi: EPhamViChuDe;
		// hinhThucDaoTaoId?: number;
		// isTatCaHe?: boolean;
		// danhSachLopTinChi: GeneralInfo[];
		// danhSachLopHanhChinh: GeneralInfo[];
		// danhSachNguoiDung: GeneralInfo[];
		// danhSachKhoaHoc: GeneralInfo[];
		// danhSachNganhHoc: GeneralInfo[];
		// loaiDoiTuongSuDung: ELoaiDoiTuong[];
		coCamKet: boolean;
		noiDungCamKet: string;
		// soPhutThucHien?: number;
		// soLuotTraLoiToiDa?: number;
		// thoiGian?: string[];
		// danhSachVaiTro: string[];
		loai: ELoaiBieuMau; // "Khảo sát"
		// thoiGianBatDau: string;
		// thoiGianKetThuc: string;
		kichHoat: boolean;
		danhSachKhoi: Khoi[];
		// doiTuong: string;
	}

	export interface LuaChon {
		noiDung: string;
		dung?: boolean;
		_id: string;
	}

	export interface CauHoi {
		loai: string;
		batBuoc: boolean;
		noiDungCauHoi: string;
		cauTraLoiKhac: boolean;
		luaChon: LuaChon[];
		luaChonCot: {
			noiDung: string;
			_id: string;
		}[];
		luaChonHang: {
			noiDung: string;
			_id: string;
		}[];
		gioiHanDuoiTuyenTinh: number;
		gioiHanTrenTuyenTinh: number;
		_id: string;
	}

	export interface Khoi {
		tieuDe: string;
		moTa: string;
		isTieuDeDanhMuc: boolean;
		danhSachCauHoi: CauHoi[];
	}

	export interface LuaChonBangRecord {
		_id?: string;
		idCot: string;
		idHang: string;
	}

	export interface TraLoiRecord {
		_id?: string;
		listLuaChon?: string[];
		listLuaChonBang?: LuaChonBangRecord[];
		traLoiText?: string;
		idCauHoi: string;
		luaChonTuyenTinh?: number;
		listUrlFile?: string[];
	}
}
