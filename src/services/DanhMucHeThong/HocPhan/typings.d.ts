import type { HocKy } from '@/services/HocKy/HocKy/typing';
import type { KhoaNganh } from '@/services/NamHoc/KhoaNganh/typings';
import type { ToChucNhanSu } from '@/services/ToChucNhanSu/typing';
import type {
	ELoaiHocLieu,
	ELoaiHocPhiHocPhan,
	ELoaiPhongHoc,
	ELoaiTaiLieu,
	ELoaiToChucDayHoc,
	ETrangThaiDeCuongHPHK,
	ETrangThaiDuyetDeCuongHocPhan,
} from '../constant';
import { ELoaiThangDiemTuyChinh } from './constant';

declare module HocPhan {
	export interface IRecord {
		_id: string;
		ma: string;
		ten: string;
		tenTiengAnh?: string;
		maLoaiHocPhan: string;
		loaiHocPhan?: ILoaiHocPhan;
		soTinChi: number;
		maTrinhDoDaoTao: string;
		trinhDoDaoTao?: TrinhDoDaoTao.IRecordCoSo;
		maDonVi: string;
		donVi?: ToChucNhanSu.IDonVi;
		active: boolean;
		deCuongHienTaiId?: string;
		deCuongHienTai?: IDeCuongHocPhan;

		loaiHocPhi?: ELoaiHocPhiHocPhan;

		// Phục vụ xếp thời khóa biểu
		coXepThoiKhoaBieu: boolean;
		loaiPhong?: ELoaiPhongHoc;
		// loaiPhongThucHanh?: ELoaiPhongHoc;
		siSoToiThieu?: number;
		siSoToiDa?: number;
		soTietTrongTuan?: number;
		soTietTichLuy?: number;

		createdAt?: string;
		updatedAt?: string;
	}

	export interface ILoaiHocPhan {
		_id: string;
		ma: string;
		ten: string;

		isPhanMuc: boolean;
		isTinhDiem: boolean;
		isTinhSoTinChiDangKy: boolean;
		isTinhSoTinChiTichLuy: boolean;
		hocNgoaiGio: boolean;
		// khoiTuChon?: boolean;
		// khoiTotNghiep?: boolean;
	}

	export interface IDeCuongHocPhan extends ITrongSoDeCuong, IHinhThucThi, ITrongSoThi {
		_id: string;
		ma: string;
		maHocPhan: string;
		hocPhan: IRecord;
		// nguoiBienSoan: string;
		// ngayApDung: string;
		thoiDiemApDung?: string;
		maCanCu: string;
		canCu: VanBanQuyDinh.IRecord;
		// soTinChi: number;
		// isTinhDiem: boolean;
		mucTieuHocPhan: string;
		chuanDauRa: string;
		// noiDungTomTat: string;
		// noiDungChiTiet: string;
		active: boolean;
		createdAt?: string;
		updatedAt?: string;
		url?: string | null;

		trangThaiDuyet: ETrangThaiDuyetDeCuongHocPhan;

		thongTinTrongSo: IThongTinTrongSo[];
		thongTinTrongSoThi?: IThongTinTrongSo[];
		/** Ngưỡng điểm THI KTHP đủ điều kiện đạt học phần (mặc định: 0.1)
		 * => Điểm thi >= ngưỡng thì mới đủ đạt học phần (tương đương ngưỡng điểm THÀNH PHẦN) */
		nguongDiemDieuKienKthp?: number;

		//Grading Scheme
		thangDiemTuyChinh: {
			loai: ELoaiThangDiemTuyChinh;
			thangDiem: TThangDiemTuyChinh[];

			//fake
			suDung: boolean;
		};

		//fake data
		danhSachHinhThuc: string[];

		dataPartitionCode: string;
	}

	export type TThangDiemTuyChinh = {
		diemChu: string;
		canDuoi: number;
		canTren: number;

		index: number;
	};

	export interface IThongTinTrongSo {
		field: number;
		trongSo: number;
		/** Ngưỡng điểm đủ điều kiện dự thi (mặc định: 0.1) => Điểm sinh viên >= ngưỡng thì mới đủ ĐKDT */
		nguongDiemDieuKien?: number;
		moTa?: string;

		/** Hình thức đánh giá: Nhập tay nếu là thành phần, chọn tên từ danh sách hình thức thi nếu là tổng kết */
		hinhThucDanhGia?: string;
		chuanDauRa?: string;
	}

	export interface ITrongSoThi {
		trongSoThi1?: number;
		trongSoThi2?: number;
		trongSoThi3?: number;
		trongSoThi4?: number;
		trongSoThi5?: number;
	}

	export interface IHinhThucThi {
		hinhThucThi1Id: string;
		hinhThucThi2Id: string;
		hinhThucThi3Id: string;
		hinhThucThi4Id: string;
		hinhThucThi5Id: string;
		// hinhThucThi6Id: string;
		// hinhThucThi7Id: string;
		// hinhThucThi8Id: string;
		// hinhThucThi9Id: string;
		// hinhThucThi10Id: string;
	}

	export interface ITrongSoDeCuong {
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
		tieuDe: string;
		ten: string;
		deCuongHpId: string;
		gioLyThuyet: number;
		gioBaiTapTL: number;
		gioThucHanh: number;
		gioTuHoc: number;

		giaiDoanDayHoc?: string; // Giai đoạn dạy học (1, 2, 3, 4, trước khi đến lớp, trên lớp...)
		listMaChuanDauRa?: string[]; // Danh sách mã chuẩn đầu ra CLO
		listTrongSoTuongUng?: string[]; // [trongSo1, trongSo2, trongSoThi1, trongSoThi2...]
		thuTuHienThi?: number; // Thứ tự hiển thị (1, 2, 3, 4, 5...)
	}

	export interface ITienTrinhHocPhan {
		_id: string;
		deCuongId: string;
		deCuong?: IDeCuongHocPhan;
		tuanBatDau: number;
		tuanKetThuc: number;
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
		deCuongId: string;
		deCuong?: IDeCuongHocPhan;
		loaiHocLieu: ELoaiHocLieu;
		loaiTaiLieu: ELoaiTaiLieu;

		idTaiLieuThuVien?: number; // Tài liệu tinh vân
		idTaiLieuThuVienV2?: string; // Tài liệu thư viện hệ thống
		// loaiTaiLieuThuVien?: 'item' | 'edata';
		loaiTaiLieuThuVien?: string;
		maTaiLieuThuVien?: string;
		tacGia?: string;
		tenNhaXuatBan?: string;
		namXuatBan?: number;

		tieuDe?: string;
		moTa?: string;
		url?: string;
		batBuoc: boolean;
	}

	export interface IDeCuongHocPhanHocKy {
		//extends RaSoatHocPhan.TSoNhuCauHocPhan
		_id: string;
		maHocKy: string;
		hocKy?: HocKy.IRecord;
		maHocPhan: string;
		tenHocPhan: string;
		soTinChi?: number;
		maDonVi: string;
		donVi?: ToChucNhanSu.IDonVi;
		hocPhan?: IRecord;
		deCuongId?: string;
		deCuong?: IDeCuongHocPhan;

		// siSoLopToiThieu?: number;
		// siSoLopToiDa?: number;
		// siSoNhomToiThieu?: number;
		// siSoNhomToiDa?: number;
		soNhuCauDuKien?: number;
		soNhuCauKeHoach?: number;
		soLopDuKien?: number;
		soLopThucTe?: number;
		// soTietTrongTuan?: number;

		maHocPhanHocKy: string;
		trangThaiDiem: ETrangThaiDeCuongHPHK;
		active: boolean;
		daChot?: boolean;
	}

	export interface IThongKeNhuCau {
		soLuongHocPhan; // Số lượng học phần dự kiến mở lớp
		soLuongLopHocPhanDuKien; // Số lượng lớp học phần dự kiến theo nhu cầu
		soLuongLopHocPhanDaKhoiTao; // Số lượng lớp học phần khởi tạo dựa theo nhu cầu trừ cho số lượng đã chốt
		soLuongLopHocPhanDaChot; // Số lượng lớp học phần đã chốt
		tongSoNhuCauDuKien; // Số nhu cầu dự kiến
	}

	export interface IQuyDoiHocPhan {
		_id: string;
		maHocPhanCu: string;
		hocPhanCu?: IRecord;

		maHocPhanMoi1: string;
		hocPhanMoi1?: IRecord;
		maHocPhanMoi2?: string;
		hocPhanMoi2?: IRecord;
		maHocPhanMoi3?: string;
		hocPhanMoi3?: IRecord;

		maKhoaNganh?: string;
		khoaNganh?: KhoaNganh.IRecord;
		ghiChu?: string;
		maCanCu: string;
		canCu: VanBanQuyDinh.IRecord;
	}

	export type TThongKeTrangThaiDeCuong = {
		khongCoDeCuong: number;
		choDuyet: number;
		daDuyet: number;
		banHanh: number;
		yeuCauChinhSua: number;
	};

	/** Chuẩn đầu ra học phần (CLO) */
	export interface IChuanDauRa {
		_id: string;
		/** Mã Chuẩn đầu ra (CLO1, CLO2...), unique trong CTĐT */
		ma: string;
		ten: string;
		diemToiThieu?: number;

		deCuongId: string;
		deCuong?: IDeCuongHocPhan;

		moTa?: string;
	}

	export interface ICdrHinhThuc {
		_id?: string;
		cloId: string; // CLO
		dmMucTieuHocPhan?: IChuanDauRa;
		/** trongSo1, trongSo2, trongSoThi1, trongSoThi2... */
		trongSoTuongUng: string;

		/** Tỷ lệ ảnh hưởng của hình thức đánh giá này đến CLO (tổng tỷ lệ của 1 hình thức = 100%) */
		tyLeAnhHuong?: number;
		/** Có tính điểm hay không
		 * Chỉ cần nhập điểm cho những hình thức đánh giá có isTinhDiem = true
		 */
		isTinhDiem?: boolean;
		diemToiThieu?: number; // Ngưỡng điểm tối thiểu để tính đạt CLO
	}

	export interface IPhanQuyenHocPhan {
		_id: string;
		maHocPhan: string;
		hocPhan?: IRecord;

		hoTen?: string;
		maCanBo?: string;
		donVi?: string;
		ssoId: string;

		listMaPhanQuyen: string[];
	}

	export type TThongKeHocPhanDonVi = {
		maDonVi: string;
		tenDonVi: string;
		maDonViCha: string;
		tenDonViCha: string;
		khongCoDeCuong: number;
		choDuyet: number;
		daDuyet: number;
		banHanh: number;
		yeuCauChinhSua: number;

		coNoiDungGiangDay?: number;
		coHocLieu?: number;
	};

	export type TThongKeHocPhanThayDoi = {
		maHocKy: string;
		soLuongHpThayDoiDeCuong: number;
		tenHocKy: string;
		danhSachHocPhan: {
			maHocPhan: string;
			tenHocPhan: string;
		}[];
	};

	export interface ICoCheChamDiem {
		index: number;
		diemChu: string;
		canDuoi: number;
		canTren: number;
	}
}
