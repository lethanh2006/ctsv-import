import { type ELoaiBieuMau } from '../constant';

declare module BieuMau {
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

	export type TGridItem = {
		noiDung: string;
		_id: string;
	};

	export interface Khoi {
		_id: string;
		tieuDe: string;
		moTa: string;
		danhSachCauHoi: CauHoi[];
	}

	export interface GeneralInfo {
		id: string;
		code: string;
		name: string;
		description: string;
		info: any;
	}

	export interface Record {
		_id: string;
		tieuDe: string;
		moTa: string;
		createdAt: string;
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
		// kichHoat: boolean;
		danhSachKhoi: Khoi[];
		// doiTuong: string;
		defaultQuestion?: boolean;

		levelsId: string;
		levelName: string;
		khaoSatChaId: string;
		maDonVi: string;
		tenDonVi: string;
		idDonVi: string;
		thongTinNguoiTao: {
			nhanSuSsoId: string;
			ten: string;
			maCanBo: string;
			maDonVi: string;
			tenDonVi: string;
			idDonVi: string;
			_id: string;
		};
	}
	export interface IDataThongKe {
		_id: '655dc81a67710b35cb807d3d';
		idDot: '655db9ea0048361119673bea';
		idKhaoSat: '655db9840048361119673bac';
		userId: '010101010';
		__v: 0;
		createdAt: '2023-11-22T09:21:30.440Z';
		danhSachTraLoi: {
			idCauHoi: string;
			listLuaChon: [];
			listLuaChonBang: [
				{
					idCot: '655db9840048361119673b9f';
					textCot: '6';
					idHang: '655db9840048361119673ba2';
					textHang: '3';
					_id: '655dc83767710b35cb807d91';
				},
				{
					idCot: '655db9840048361119673b9f';
					textCot: '6';
					idHang: '655db9840048361119673ba1';
					textHang: '2';
					_id: '655dc83767710b35cb807d92';
				},
				{
					idCot: '655db9840048361119673b9f';
					textCot: '6';
					idHang: '655db9840048361119673ba0';
					textHang: '1';
					_id: '655dc83767710b35cb807d93';
				},
			];
			listUrlFile: [];
			_id: '655dc83767710b35cb807d90';
		}[];

		hoTen: 'Sinh viên không xóa';
		khoaHoc: '7_1_2018';
		nganh: '7810103';
		saved: false;
		startedAt: '2023-11-22T09:21:30.448Z';
		updatedAt: '2023-11-22T09:21:59.846Z';
		userCode: '010101010';
		nguoiTraLoi: 'Sinh viên không xóa';
		maDinhDanh: '010101010';
		thoiGianTraLoi: '16:21:30 22/11/2023';
		khaoSat: Record;
		index: 1;
		key: 0;
	}

	export interface ThongKeLuaChon {
		noiDungLuaChon: string;
		idLuaChon: string;
		soLuong: number;
	}

	export interface ThongKeCot {
		idCot: string;
		noiDungCot: string;
		soLuong: number;
	}

	export interface ThongKeLuaChonGrid {
		noiDungHang: string;
		idHang: string;
		thongKeCot: ThongKeCot[];
	}

	export interface ThongKeLuaChonNumeric {
		giaTriTuyenTinh: number;
		soLuong: number;
	}

	export interface ThongKeCauHoi {
		_id: string;
		noiDungCauHoi: string;
		loai: string;
		soLuongTraLoi: number;
		batBuoc?: boolean;
		ketQua: (ThongKeLuaChon | ThongKeLuaChonGrid | ThongKeLuaChonNumeric)[];
	}

	export interface ThongKeKhoi {
		_id: string;
		tieuDe: string;
		moTa: string;
		thongKeCauHoi: ThongKeCauHoi[];
	}

	export interface ThongKe {
		_id: string;
		tieuDe: string;
		moTa: string;
		loai: string;
		thongKeKhoi: ThongKeKhoi[];
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
		traLoiKhac?: string;
	}
}
