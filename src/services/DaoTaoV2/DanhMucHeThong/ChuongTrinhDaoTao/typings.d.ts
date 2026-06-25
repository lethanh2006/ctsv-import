import type {
	ELoaiChuongTrinhDaoTao,
	ELoaiHocPhanCTDT,
	ELoaiThaoTacRaSoatCtdt,
	ETrangThaiCtdt,
} from '@/services/constant';
import type { NamHoc } from '@/services/NamHoc/NamHoc/typings';
import type { ChungChi } from '../ChungChi/typing';
import { type HocPhan } from '../HocPhan/typings';
import type { NganhDaoTao } from '../Nganh/typings';

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
		thoiGianDaoTaoToiDa?: number;
		tongSoTinChi: number;
		canCuId: string;
		canCu?: VanBanQuyDinh.IRecord;
		namBanHanh: number;
		// active?: boolean;
		// maLoaiChungChiList: string[];
		// loaiChungChiList?: LoaiChungChi.IRecord[];
		url?: string | null;

		mucTieuDaoTao: string;
		chuanDauVao: string;
		chuanDauRa: string;
		viTriLamViec: string;
		thongTinHocPhi?: string;
		ngonNguDaoTao?: string;

		// Với Chương trình kế hoạch cho Khóa ngành cụ thể
		maKhoaNganh?: string;
		maKhoaSinhVien?: string;
		khoaSinhVien?: KhoaSinhVien.IRecord;
		maChuongTrinhDaoTaoChuan?: string;
		chuongTrinhDaoTaoChuan?: IRecord;

		soLuongPlo?: number; // Số lượng chuẩn đầu ra PLO
		trangThaiPloClo?: ETrangThaiPloClo;

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

	export type TThongKePloSinhVien = {
		ma: string;
		ssoId: string;
		ten: string;

		danhSachDiemPlo: TDiemPlo[];

		danhSachChuanDauRaMucTieu: TDiemPi[];
	};

	export type THocPhanTienTrinhKhung = IKhoiHocPhanCTDT & {
		// Populate
		/** Đã được sắp xếp giảm dần mã học kỳ */
		lichSuDiem?: LopHocPhan.IDiemHpSvHk[];
	};

	export interface ICdrMucTieuHocPhan {
		_id?: string;
		maChuongTrinhDaoTao?: string;
		maHocPhan?: string;
		hocPhan?: HocPhan.IRecord;
		deCuongId?: string;

		/** Chuẩn đầu ra CTĐT (PLO) */
		maPlo?: string;
		danhMucChuanDauRa?: IChuanDauRa;

		/** Chuẩn đầu ra học phần (CLO) */
		maClo?: string;
		mucTieuHocPhan?: HocPhan.IChuanDauRa;

		/**
		 * Tỷ lệ ảnh hưởng của CLO này đến PLO
		 * Với DAU là 1, 2, 3 hoặc I, R, M, với Vinh: Tổng tỷ lệ theo CLO = tỉ lệ phân phối cho Học phần
		 */
		tyLeAnhHuong: number;
		/** Quan trọng (A - Assessment) hay ko? Học phần này sẽ để đánh giá chuẩn đầu ra CTĐT */
		isQuanTrong?: boolean; // DAU
		diemToiThieu?: number; // Vinh
	}

	export type TDiemPi = {
		/** Điểm trung bình đánh giá PI */
		trungBinhPi: number;
		/** Danh sách các điểm thành phần hỗ trợ đánh giá PI này */
		danhSachHocPhan: TDiemPiHocPhan[];

		maPlo: string;

		diemPloToiThieu?: number;
		trungBinhPi?: number;
		ten: string;
	};
}
