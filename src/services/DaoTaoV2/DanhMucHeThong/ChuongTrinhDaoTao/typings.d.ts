import type { NamHoc } from '@/services/NamHoc/NamHoc/typings';
import type { ChungChi } from '../ChungChi/typing';
import { type HocPhan } from '../HocPhan/typings';
import type { NganhDaoTao } from '../Nganh/typings';
import type {
	ELoaiChuongTrinhDaoTao,
	ELoaiHocPhanCTDT,
	ELoaiThaoTacRaSoatCtdt,
	ETrangThaiCtdt,
} from '@/services/constant';

declare module ChuongTrinhDaoTao {
	export interface IRecord {
		_id: string;
		ma: string;
		ten: string;
		tenTiengAnh: string;
		maTrinhDoDaoTao: string;
		trinhDoDaoTao?: TrinhDoDaoTao.IRecordCoSo;
		maNganh: string;
		nganh?: NganhDaoTao.IRecordCoSo;
		loai: ELoaiChuongTrinhDaoTao;
		trangThai: ETrangThaiCtdt;

		thoiGianDaoTao: number;
		tongSoTinChi: number;
		canCuId: string;
		canCu?: VanBanQuyDinh.IRecord;
		namBanHanh: number;
		// active?: boolean;
		// maLoaiChungChiList: string[];
		loaiChungChiList?: LoaiChungChi.IRecord[];
		url?: string | null;

		mucTieuDaoTao: string;
		chuanDauVao: string;
		chuanDauRa: string;
		viTriLamViec: string;

		// Với Chương trình kế hoạch cho Khóa ngành cụ thể
		maKhoaSinhVien?: string;
		khoaSinhVien?: KhoaSinhVien.IRecord;
		maChuongTrinhDaoTaoChuan?: string;
		chuongTrinhDaoTaoChuan?: IRecord;

		createdAt?: string;
		updatedAt?: string;
	}

	export interface IKhoiHocPhanCTDT extends IHocPhanBase {
		maChuongTrinhDaoTao: string;
		chuongTrinhDaoTao?: IRecord;
		maKhoiKienThuc?: string;
		khoiKienThuc?: KhoiKienThuc.IRecord;
		maChuyenNganh?: string;
		chuyenNganh?: NganhDaoTao.IRecordCoSo;
		loaiHocPhanCtdt: ELoaiHocPhanCTDT;

		soThuTuKy?: number;
		soThuTuKyKeHoach?: number;
		// tinhChuanDauRa?: boolean;

		ten?: string; // Tên khối chương trình tự chọn
		soTinChiTuChonPhaiHoc?: number;
		isTinhSoTinChiTichLuy?: boolean;
		// maLoaiHocPhan?: string;
		// loaiHocPhan?: HocPhan.ILoaiHocPhan;
		hocPhanCtdtList?: IHocPhanTuChonCTDT[];
	}

	export interface IHocPhanTuChonCTDT extends IHocPhanBase {
		khoiHpCtId: string;
		khoiHpCt?: IKhoiHocPhanCTDT;
	}

	export interface IHocPhanBase {
		_id: string;
		maHocPhan: string;
		hocPhan?: HocPhan.IRecord;
		// maHocPhanTienQuyet: string;
		// hocPhanTienQuyet?: HocPhan.IRecord;
		// maHocPhanTruoc: string;
		// hocPhanTruoc?: HocPhan.IRecord;
		// maHocPhanSongHanh: string;
		// hocPhanSongHanh?: HocPhan.IRecord;
		dsHocPhanTienQuyet?: Pick<HocPhan.IRecord, 'ma' | 'ten' | 'soTinChi'>[];
		dsHocPhanTruoc?: Pick<HocPhan.IRecord, 'ma' | 'ten' | 'soTinChi'>[];
		dsHocPhanSongHanh?: Pick<HocPhan.IRecord, 'ma' | 'ten' | 'soTinChi'>[];

		createdAt?: string;
		updatedAt?: string;
	}

	export interface IChungChiCTDT {
		_id: string;
		maChuongTrinhDaoTao: string;
		chuongTrinhDaoTao?: IRecord;
		maLoaiChungChi: string;
		loaiChungChi?: ChungChi.ILoaiChungChi;

		danhSachChungChiCtdtCdr?: Partial<IChuanDauRa>[];
	}

	export interface IChuanDauRa {
		_id: string;
		chungChiCtdtId: string;
		chungChiCtdt?: IChungChiCTDT;
		maChungChi: string;
		chungChi?: ChungChi.IRecord;
		chuanDauRa: number;
	}

	export interface IDotRaSoat {
		_id: string;
		maNamHoc: string;
		namHoc?: NamHoc.IRecord;
		ten: string;
		thoiGianBatDau: string;
		thoiGianKetThuc: string;
	}

	export interface IThaoTacRaSoat {
		_id: string;
		loai: ELoaiThaoTacRaSoatCtdt;
		maChuongTrinh: string; // Mã chương trình mới
		chuongTrinh?: IRecord;
		idKhoiHpCt: string; // Khối mới
		khoiHpCt?: IKhoiHocPhanCTDT;
		listKhoiHpCtGoc?: Partial<IKhoiGocRaSoat>[];
		ghiChu?: string;
	}

	export interface IKhoiGocRaSoat {
		_id: string;
		idKhoiHpCt: string; // Khối gốc
		khoiHpCt?: IKhoiHocPhanCTDT;
		idThaoTac: string;
		thaoTac?: IThaoTacRaSoat;
	}

	export type TSoSanhChuongTrinh = {
		chuongTrinhRaSoat: Partial<IRecord>;
		khoiCtHp: IKhoiHocPhanCTDT[]; // Khối gốc
		listThaoTac: Partial<IThaoTacRaSoat>[]; // Danh sách thao tác
	};
}
