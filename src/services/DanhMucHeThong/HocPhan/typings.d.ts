import { type HocKy } from '@/services/HocKy/HocKy/typing';
import { type ETrangThaiDeCuongHPHK, type ELoaiToChucDayHoc } from '../constant';

declare module HocPhan {
	export interface IRecord {
		_id: string;
		ma: string;
		ten: string;
		tenTiengAnh?: string;
		soTinChi: number;
		maTrinhDo: string;
		trinhDo?: TrinhDoDaoTao.IRecordCoSo;
		donVi: string;
		createdAt?: string;
		updatedAt?: string;
		active: boolean;
		deCuongHienTaiId?: string;
		deCuongHienTai?: Partial<IDeCuongHocPhan>;

		isTinhSoTinChi: boolean;
		isTinhDiem: boolean;
	}

	export interface IDeCuongHocPhan {
		_id: string;
		ma: string;
		hocPhanId: string;
		hocPhan: IRecord;
		nguoiBienSoan: string;
		ngayApDung: string;
		canCuId: string;
		canCu: VanBanQuyDinh.IRecord;
		// soTinChi: number;
		// isTinhDiem: boolean;
		mucTieuHocPhan: string;
		noiDungTomTat: string;
		noiDungChiTiet: string;
		active: boolean;
		createdAt?: string;
		updatedAt?: string;

		trongSo1?: number;
		trongSo2?: number;
		trongSo3?: number;
		trongSo4?: number;
		trongSo5?: number;
		trongSo6?: number;
		trongSo7?: number;
		trongSo8?: number;
		trongSo9?: number;
		trongSo10?: number;
	}

	export interface IGiangVienDeCuong {
		_id: string;
		deCuongId: string;
		deCuong?: IDeCuongHocPhan;
		nhanSuSsoId: string | null;
		hoTen?: string | null;
		chucDanh?: string | null;
		hocHam?: string | null;
		hocVi?: string | null;
		soDienThoai?: string | null;
		diaChi?: string | null;
	}

	export interface ILichTrinhChung {
		_id: string;
		ten: string;
		deCuongHpId: string;
		gioLyThuyet: number;
		gioBaiTapTL: number;
		gioThucHanh: number;
		gioTuHoc: number;
	}

	export interface ITienTrinhHocPhan {
		_id: string;
		deCuongId: string;
		deCuong?: IDeCuongHocPhan;
		tuan: number;
		noiDung: string;
		noiDungChinh: string;
		yeuCauSinhVien: string;
		ghiChu: string;
		ndTienTrinhList?: INoiDungTienTrinh[];
	}

	export interface INoiDungTienTrinh {
		_id: string;
		tienTrinhHpId: string;
		tienTrinhHp?: ITienTrinhHocPhan;
		loaiToChucDayHoc: ELoaiToChucDayHoc;
		soTiet: number;
	}

	export interface IHocLieuDeCuong {
		_id: string;
		hocLieuId: string;
		hocLieu?: HocLieu.IRecord;
		deCuongId: string;
		deCuong?: IDeCuongHocPhan;
		batBuoc: boolean;
	}

	export interface IDeCuongHocPhanHocKy {
		_id: string;
		maHocKy: string;
		hocKy: HocKy.IRecord;
		maHocPhan: string;
		tenHocPhan: string;
		donVi: string;
		hocPhan: IRecord;
		deCuongId: string;
		deCuong: IDeCuongHocPhan;
		maHocPhanHocKy: string;
		trangThaiDiem: ETrangThaiDeCuongHPHK;
	}
}
