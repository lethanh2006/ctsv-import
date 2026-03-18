import type { EVaiTroPhamViQuyTrinh } from '../QuyTrinhDong/constant';
import type {
	ECapHoatDongHuyDongGiaoDucTuTuongChinhTri,
	EDonViTinh,
	ELoaiDoiTuong,
	ELoaiDonViPhoiHop,
} from './constants';

declare module HoatDongChung {
	export interface IDuToanKinhPhi {
		_id: string;
		soThuTu: number;
		keHoachHoatDongNamId: string;
		hoatDong: string;
		donViTinh: string;
		donViTinhKhac: string;
		soLuong: number;
		soLuongNguoi: number;
		soLuongNgay: number;
		soLuongKhac: number;
		dinhMuc: number;
		ghiChu: string;
		tienDoHoanThanh: string;
		tepDinhKem: string[] | null;
		chungTuYeuCau: string;
		info: string;

		//fake data
		index: number;
	}

	export interface PhamViHoatDong {
		loaiDoiTuong: ELoaiDoiTuong;
		danhSachLoaiVaiTro: EVaiTroPhamViQuyTrinh[];
		ghiChu: string;
		danhSachMaThamChieu: string[];
	}

	export interface ThongTinPhanBoNguonKinhPhi {
		maNguonKinhPhi: string;
		tenNguonKinhPhi: string;
		kinhPhiPhanBo: number;
	}

	export interface IRecord {
		_id: string;
		phanLoaiCap1: string;
		phanLoaiCap2: string;
		ten: string;
		maHocKy: string;
		loai: string;
		thoiGianBatDau: string;
		thoiGianKetThuc: string;
		danhSachDuToanKinhPhi: IDuToanKinhPhi[];
		danhSachPhamVi: PhamViHoatDong[];
		diaDiem: string;
		soLuongThamGia: number;
		soLuongThamGiaGv: number;
		soLuongTiepCan: number;
		soLuongThamGiaNgoaiHocVien: number;
		tinh: string;
		donViPhoiHop: string;
		donViChuTri: string;
		loaiDonViPhoiHop: ELoaiDonViPhoiHop;
		loaiDonViChuTri: ELoaiDonViPhoiHop;
		thongTinPhanBoNguonKinhPhi: ThongTinPhanBoNguonKinhPhi[];
		cap: ECapHoatDongHuyDongGiaoDucTuTuongChinhTri;
		info: {
			type: string;
			refId: string;
		};
	}

	export interface DanhSachSinhVienThamGia {
		_id: string;
		hoatDongCtsvId: string;
		ma: string;
		maNganh: string;
		ssoId: string;
		ten: string;
		tenNganh: string;
		trangThaiThamGia: string;
	}
}
