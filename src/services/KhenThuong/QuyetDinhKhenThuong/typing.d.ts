import { type ELoaiKhenThuong } from '../constants';
import { type SinhVien } from '@/services/SinhVien/typings';

declare module QuyetDinhKhenThuong {
	export interface CaNhan {
		loai: ELoaiKhenThuong;
		capKhenThuongId?: string;
		coQuanQuyetDinh?: string;
		createdAt: string;
		daXetDieuChinhTangLuong?: boolean;
		donVi?: string;
		donViId?: string;
		hinhThucKhenThuongId?: string;
		idGoc?: string;
		idQuyetDinhKhenThuong?: string;
		loaiKhenThuongId?: string;
		ngayKy?: string;
		ngayQuyetDinh?: string;
		nguoiKy?: string;
		noiDung?: string;
		phuongThucKhenThuongId?: string;
		soQuyetDinh?: string;
		ssoId: string;
		sinhVien?: SinhVien.IRecord;
		sinhVienId?: string;
		updatedAt: string;
		urlFileUpload?: string;
		_id: string;
	}

	export interface DonVi {
		loai: ELoaiKhenThuong;
		donViId: string;
	}

	export interface IRecord {
		_id: string;
		soQuyetDinh?: string;
		coQuanQuyetDinh?: string;
		ngayQuyetDinh?: string;
		ngayKy?: string;
		nguoiKy?: string;
		noiDung?: string;
		fileDinhKem?: string;
		danhSachCaNhan?: CaNhan[];
		danhSachDonVi?: DonVi[];
	}
}
