import type { DiemThi } from '../DiemThi/typings';
import type { HocPhanThi } from '../HocPhanThi/typings';
import type { KyThi } from '../KyThi/typings';
import type { LichThi } from '../LichThi/typings';
import type {
	EDieuKienCongNo,
	EDieuKienHocTap,
	ELoaiThi,
	ELyDoThamDinh,
	ETrangThaiDuThi,
	ETrangThaiSinhVienThi,
} from './constant';

declare module SinhVienThi {
	export interface IRecord extends DiemThi.TKetQuaThiCuoi {
		_id: string;
		sessionDongBo?: string;
		kyThiId: string;
		kyThi: KyThi.IRecord;
		loaiThi: ELoaiThi;

		ssoId: string;
		ten: string;
		ma: string;
		diemLan1?: number;

		// Học phần
		maHocPhan: string;
		hocPhanThi?: HocPhanThi.IRecord;
		maHocPhanQldt: string;
		// tenHocPhan?: string;
		deCuongId?: string;
		field?: string;

		maHocKyHoc?: string;
		tenHocKyHoc?: string;
		lichThiId?: string;
		lichThi?: LichThi.IRecord;

		maPhach?: string;
		sbd?: number;
		// maPhachPhucKhao?: string;
		// maPhachThamDinh?: string;

		// Tư cách dự thi
		dieuKienKetQuaHocTap?: EDieuKienHocTap;
		dieuKienCongNo?: EDieuKienCongNo;
		/** Điều kiện dự thi */
		trangThai: ETrangThaiSinhVienThi;
		khoaDongBoTuCach?: boolean;
		thoiGianSyncTaiChinh?: string;
		thoiGianSyncQLDT?: string;

		// Trạng thái
		blockRaSoatDiem?: boolean;
		daRaSoatDiem?: boolean;
		daChotDiem?: boolean;
		daDuyetDiem?: boolean;
		daCongBoDiem?: boolean;
		trongTuiThi?: boolean;

		chamPhucKhao?: boolean;
		daRaSoatDiemPhucKhao?: boolean;
		daChotDiemPhucKhao?: boolean;
		daDuyetDiemPhucKhao?: boolean;
		daCongBoDiemPhucKhao?: boolean;

		// ketQuaChamChinhThuc: KetQuaChamThi;
		// daDongBoDiem: boolean;
		// chamXacNhan: {
		// 	danhSachDiem: ChamThi.DiemCham[];
		// 	diemCuoi: number;
		// 	diemSauViPham: number;
		// };
		// daChot: boolean;
		// daDuyet: boolean;
		// daCongBo: boolean;
		phat: {
			hinhThucXuPhat: string;
			phanTram: number;
			lyDo: string;
		};

		// Nộp bài?
		daNopBai?: boolean;
		urlBaiNop?: string[] | null;
		thoiGianNopBai?: string;
		choPhepNopNgoaiThoiGian?: boolean;

		/** Trạng thái dự thi */
		trangThaiDuThi?: ETrangThaiDuThi;

		/** Danh sách điểm chấm thi các lần (chính thức, phúc khảo, thẩm định) */
		danhSachDiemChamThi?: DiemThi.IRecord[];

		chamThamDinh?: boolean;
		daRaSoatDiemThamDinh?: boolean;
		lyDoChamThamDinh?: ELyDoThamDinh;

		ghiChu?: string;
	}

	export interface IDiemThiHocKySinhVien {
		kyThi: KyThi.IRecord;
		diemKthp: number;
		diemPhucKhao: number;
		hocPhanThi: HocPhanThi.IRecord;
		sinhVienThi: IRecord;
	}
}
