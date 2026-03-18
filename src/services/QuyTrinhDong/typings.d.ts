import type { EKieuDuLieu } from '@/services/QuyTrinh/LoaiHinh/constants';
import type { LoaiHinh } from '@/services/QuyTrinh/LoaiHinh/typing';
import type { EDoiTuong, EVaiTro } from '@/services/QuyTrinh/constant';
import type { EDoiTuongPhamViQuyTrinh, EPhanHe, EVaiTroPhamViQuyTrinh } from './constant';

declare module QuyTrinh {
	export interface PhamViQuyTrinh {
		index: number;
		doiTuong: EDoiTuongPhamViQuyTrinh;
		danhSachVaiTro: EVaiTroPhamViQuyTrinh[];
		danhSachMaThamChieu: string[];
		guiDenNguoiCuThe: string[];
		danhSachNguoiNhanSv: IThanhVienXuLy[];
		danhSachNguoiNhanGvCb: IThanhVienXuLy[];
	}

	export interface CanBoXuLy {
		ten: string;
		ma: string;
		danhSachLinhVuc: string[];
	}

	export interface IRecord {
		_id: string;
		ten: string;
		ghiChu: string;
		moTa: string;
		active: boolean;
		isTraKetQua: boolean;
		soNgayHenTraKetQua?: number;
		maFormHienThi: string;
		maTruongHienThi: string;
		linhVuc: string;
		choPhepGuiNhieuLan: boolean;
		danhSachPhamViQuyTrinh: PhamViQuyTrinh[];
		danhSachFormKhaiBao: IMauDon[];
		danhSachFormTiepNhan: IMauDon[];
		danhSachBoPhanXuLy: IBoPhanXuLy[];
		boPhanChiuTrachNhiem: IBoPhanXuLy;
		danhSachMappingDoiTuong: IDoiTuongMapping[];
		danhSachCauHinhThongTinChung: IDanhSachCauHinhThongTinChung[];
		cauHinhDotQuyTrinh: ICauHinhDotQuyTrinh;
		danhSachBuocXuLy: IBuocXuLy[];
		cauTrucThanhToan: {
			ten: string;
			yeuCauTraPhi: boolean;
			idNguonThu: string;
			idKhoanThu: string;
			idMucThu: string;
			thanhToanTheoSoLuong: boolean;
			maFormThamChieuSoLuongThanhToan: string;
			maTruongThamChieuSoLuongThanhToan: string;
		};
		order: number;
		phanHe: EPhanHe[];
		[key: string]: any;
	}
	export interface ICauHinhDotQuyTrinh {
		nguonDot: string;
		phanHeNguon: string;
		internalPath: string;
	}
	export interface IUser {
		ssoId: string;
		ten: string;
		vaiTroHoiDong: string;
		ma: string;
		donVi: string;
		maDonVi: string;
		hocHam: string;
		hocVi: string;
		soDienThoai: string;
		email: string;
	}
	export interface IDanhSachPhamViQuyTrinh {
		doiTuong: EDoiTuong;
		danhSachVaiTro: EVaiTro[];
		danhSachMaThamChieu: string[];
		guiDenNguoiCuThe: [string];
		danhSachNguoiNhanSv: IUser[];

		danhSachNguoiNhanGvCb: IUser[];
	}
	export interface IDoiTuongMapping {
		truongThongTin: string;
		giaTri: any;
		id: string;
	}
	export interface IDanhSachCauHinhThongTinChung {
		ten: string;
		noiDung: string;
		html: boolean;
		[key: string]: any;
	}
	export interface IMauDon {
		ten: string;
		ma: string;
		cauHinhLoaiHinh: LoaiHinh.TruongThongTin[];
		fileId: string;
		file: { name: string }[];
		[key: string]: any;
	}
	export interface IBuocXuLy {
		ten: string;
		ma: string;
		moTa: string;
		suDungForm: true;
		maFormKhaiBao: string;
		maFormTiepNhan: string;
		danhSachMaBoPhanXuLy: string[];
		vanBan: VanBan.IRecord;
		[key: string]: any;
	}

	export interface IDanhSachForm {
		ten: string;
		ma: string;
		cauHinhLoaiHinh: TruongThongTin[];
	}
	export interface IBoPhanXuLy {
		ten: string;
		ma: string;
		phuongThucPhanCong: string;
		danhSachThanhVienXuLy: IThanhVienXuLy[];
		maDonVi: string;
		[key: string]: any;
	}
	export interface IBoPhanXuLyByBuoc {
		maBuoc: string;
		boPhanXuLy: IBoPhanXuLy[];
	}
	export interface IThanhVienXuLy {
		ssoId: string;
		ten: string;
		ma: string;
		donVi: string;
		hocHam: string;
		hocVi: string;
		soDienThoai: string;
		email: string;
		[key: string]: any;
	}
}
