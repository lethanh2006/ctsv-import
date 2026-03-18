import { type SinhVien } from '@/services/SinhVien/typings';

declare module KyLuat {
	export interface IRecord {
		change?: boolean | Record<string, any> | null;
		_id: string;
		thongTinNhanSuId: string;
		sinhVien?: SinhVien.IRecord;
		capKyLuatId: string;
		capKyLuat?: CapKyLuat.IRecord;
		hinhThucKyLuatId: string | null;
		hinhThucKyLuat?: HinhThucKyLuat.IRecord | null;
		soQuyetDinh: string;
		coQuanQuyetDinh: string;
		nguoiKy: string;
		ngayQuyetDinh: string;
		ngayKy: string;
		noiDung: string;
		urlFileUpload: string | null;
		anhHuongThoiGianKyLuat?: boolean;
		thoiGianDieuChinh?: number;
		hoTen?: string;
		daXetDieuChinhTangLuong?: string;
	}
}
