import type { EPhanLoaiSucKhoe, ETinhTrangSucKhoe, ETrangThaiKhamSucKhoe } from './constant';

declare module DotKhamSucKhoe {
	export interface IRecord {
		_id: string;
		ten: string;
		maHocKy: string;
		tenHocKy: string;
		thoiGianBatDau: Date;
		thoiGianKetThuc: Date;
		danhSachKhoaNganh: KhoaNganh.IRecord;
		trangThai: ETrangThaiKhamSucKhoe;
		ghiChu: string;
	}

	export interface IDotKhamKhoaNganh {
		_id: string;
		dotKhamSucKhoeId: string;
		maKhoaNganh: string;
		tenKhoaNganh: string;
		maKhoaSinhVien: string;
		maNganh: string;
	}

	export interface ISucKhoeSinhVien {
		_id: string;
		dotKhamSucKhoeId: string;
		dotKhamSucKhoe: IRecord;
		maSinhVien: string;
		sinhVienSsoId: string;
		hoTen: string;
		tinhTrangSucKhoe: ETinhTrangSucKhoe;
		maXetNghiem: string;
		benhTat: string;
		tuVan: string;
		phanLoaiSucKhoe: EPhanLoaiSucKhoe;
		ghiChu: string;
	}

	export interface IThongKeSucKhoeSinhVien {
		total: number;
		binhThuong: number;
		chuaDanhGia: number;
		coBenh: number;
	}
}
