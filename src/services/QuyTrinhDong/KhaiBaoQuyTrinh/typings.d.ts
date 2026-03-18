import type { TruongThongTin } from '@/services/QuanLyKhoaHocV2/LoaiHinhNCKH/typings';
import type { QuyTrinh } from '@/services/QuyTrinhDong/typings';

declare module KhaiBaoQuyTrinh {
	export interface IRecord {
		_id: string;
		ssoId: string;
		quyTrinhId: string;
		moTa: string;
		dotQuyTrinhId: string;
		createdAt: string;
		nguoiKhaiBao: {
			ssoId: string;
			ten: string;
			ma: string;
			email: string;
		};
		danhSachBuocXuLy: IBuocXuLy[];
		danhSachKhaiBao: {
			ten: string;
			ma: string;
			thongTinKhaiBao: any;
		}[];
		__v: 0;
		quyTrinh: QuyTrinh.IRecord;
		daTraKetQua?: boolean;
		ngayHenTraKetQua?: string;
		thoiGianTraKetQua?: string;
		hoTenNguoiTraKetQua?: string;
		idHoaDon: string;
		[key: string]: any;
	}
	export interface IDanhSachForm {
		ten: string;
		ma: string;
		cauHinhLoaiHinh: TruongThongTin[];
	}
	export interface IDonViXuLy {
		ten: string;
		ma: string;
		phuongThucPhanCong: string;
		danhSachThanhVienXuLy: IThanhVienXuLy[];
	}
	export interface IBuocXuLy {
		ten: string;
		ma: string;
		maFormKhaiBao: string;
		maFormTiepNhan: string;
		thongTinTiepNhan: any;
		ghiChu: string;
		maBoPhanXuLy: string;
		trangThaiTiepNhan: string;
		vanBan: VanBan.IRecord;
		hanCuoiTiepNhan: string;
		coKhaiBao: boolean;
		daDienThongTin: boolean;
		laBuocHienTai: boolean;
		danhSachMaBoPhanXuLy: string[];
		danhSachThanhVienXuLy: IThanhVienXuLy[];
		laBuocCuoi: boolean;
		laBuocHienTai: boolean;
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
	}
}
