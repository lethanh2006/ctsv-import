import { type PhieuDangKyTinChi } from '@/services/DangKyTinChi/PhieuDangKyTinChi/typing';
import type { ChuongTrinhDaoTao } from '@/services/DanhMucHeThong/ChuongTrinhDaoTao/typings';
import { type HocPhan } from '@/services/DanhMucHeThong/HocPhan/typings';
import type { ETrangThaiDotThanhToan } from '@/services/HocPhi/constant';
import type { DotQuyDoiDiem } from '@/services/KetQuaHocTap/DotQuyDoiDiem/typing';
import { type ELoaiDiemChu } from '@/services/KetQuaHocTap/constant';
import type { ETrangThaiDuThi } from '@/services/KhaoThi/SinhVienThi/constant';
import type { KhoaNganh } from '@/services/NamHoc/KhoaNganh/typings';
import type { LopHanhChinh } from '@/services/NamHoc/LopHanhChinh/typings';
import type { EDoiTuongLopHanhChinh } from '@/services/NamHoc/constant';
import { type SinhVien } from '@/services/SinhVien/typings';
import type { EMaTrangThaiThanhToan, ETrangThaiAnDinhHocPhi } from '@/services/TaiChinh/constant';
import type { ToChucNhanSu } from '@/services/ToChucNhanSu/typing';
import { type HocKy } from '../HocKy/typing';
import { type ThoiKhoaBieu } from '../ThoiKhoaBieu/typing';
import type {
	EHinhThucGiangDay,
	ELoaiHinhHocTap,
	ELoaiHocPhanDangKyTinChi,
	ELoaiLogLopHocPhan,
	ELoaiLopHocPhan,
	ELoaiPhanCongGiangDay,
	ELoaiThayDoiHocVien,
	ETrangThaiDiemLop,
	ETrangThaiDuyetDiem,
	ETrangThaiDuyetGiangDay,
	ETrangThaiLopHocPhan,
	ETrangThaiThi,
} from '../constant';

declare module LopHocPhan {
	export interface IRecord {
		_id: string;
		ten: string;
		tenCha?: string;
		maHocKy: string;
		csdt: CoSoDaoTao.IRecord;
		hocKy?: HocKy.IRecord;
		maHocPhan: string;
		hocPhan?: HocPhan.IRecord;
		gioiThieuChung?: string;
		lmsUrl?: string; // Link học trực tuyến

		siSoKeHoach: number; // Sĩ số sinh từ kế hoạch
		siSoToiDa: number; // Sĩ số tối đa sinh viên có thể đăng ký
		siSo?: number; // Sĩ số hiện tại
		siSoDangKy?: number; // Sĩ số hiện tại
		phongHoc?: string;
		siSoNhuCauAnDinh?: number; //Sĩ số ấn định nhu cầu học phần
		loai: ELoaiLopHocPhan;
		soThuTuLop?: number;
		soThuTuNhom?: number;
		moodleShortname?: string | null;
		trangThaiDuyetGiangDay?: ETrangThaiDuyetGiangDay;
		hinhThucGiangDay?: EHinhThucGiangDay;

		trangThaiAnDinhHocPhiNhuCau?: ETrangThaiAnDinhHocPhi;

		// 1 lớp tín chỉ cho n lớp hành chính
		// Lúc thêm mới lớp tín chỉ thì gửi kèm
		lopHpHcList?: Partial<ILopHpLopHc>[];
		lopHpHcLabel?: string;
		// Fake
		maLopHpHcList?: string[];
		doiTuongLopHanhChinh?: EDoiTuongLopHanhChinh;

		/** Danh sách khóa ngành định hướng cho lớp học phần này */
		listLopHpKn?: ILopHpKhoaNganh[];

		dotHuyId?: string;
		trangThaiLop: ETrangThaiLopHocPhan;
		trangThaiDiemLop: ETrangThaiDiemLop;
		thoiGianNhapDiem?: { start: string; end: string };
		/** Thời gian GV nộp điểm */
		thoiGianNopDiem?: string;
		isNopDiemMuon?: boolean;

		parent?: IRecord;
		children?: IRecord[];
		/** Lớp ghép thời khóa biểu cùng */
		tenLopGhepTkb?: string;
		lopGhepTkb?: IRecord;

		maHocPhanHocKy?: string;
		deCuong?: Partial<HocPhan.IDeCuongHocPhanHocKy>;
		// Populated
		nhanSuList?: IRecordNhanSuLopHP[];

		//Lớp nhu cầu
		lopNhuCau: boolean;
		dotDangKyNhuCauId: string;
		danhSachLhpSv: ISinhVienNhuCau[];

		maCSDT?: string;
		maHinhThuc: string;
		hinhThuc?: HinhThucDaoTao.IRecordCoSo;
		maTinhChat: string;
		// tinhChat?: TinhChatChuongTrinh.IRecord;

		/** Đã chốt kế hoạch rà soát học phần chưa? */
		chotKeHoach?: boolean;
		chotTkb: boolean;
		dangKyTinChi?: boolean;
		khoaTkb?: boolean;
		cauHinhTkb?: TCauHinhGiaiDoan[];
		maHoaLichHoc?: TMaHoaLichHoc[];
		thoiKhoaBieuList?: ThoiKhoaBieu.IRecord[];
		soTietTrongTuan?: number;
		syncLms?: boolean;
		idLmsOdoo?: string;

		/** Ký số? */
		urlFileKy: string;
		idFileKy: string;

		//Cán bộ ký
		trinhKy: boolean;
		daKy: boolean;
		thongTinNguoiKy: {
			ten: string;
			ssoId: string;
			thoiGianKy: Date;
		};

		//Trưởng bộ môn ký
		nguoiPhuTrachTrinhKy?: boolean;
		nguoiPhuTrachDaKy?: boolean;
		nguoiPhuTrach?: string;
		ssoIdNguoiPhuTrach?: string;
		thongTinNguoiPhuTrachKy: {
			ten: string;
			ssoId: string;
			thoiGianKy: Date;
		};
		tinhHocPhiTheoLop?: boolean;
		payStatus?: EMaTrangThaiThanhToan;
	}

	export interface ILopHpKhoaNganh {
		_id: string;
		tenLopHp: string;
		lopHp?: IRecord;
		maKn: string;
		khoaNganh?: KhoaNganh.IRecord;
	}

	export interface ILopHpLopHc {
		_id: string;
		maLopHp?: string;
		lopHocPhan?: IRecord;
		maLopHc: string;
		lopHanhChinh?: LopHanhChinh.IRecord;
	}

	export type ISinhVienNhuCau = {
		lopHocPhanId?: string;
		sinhVienSsoId: string;
		maKhoaNganh: string;
	};

	export type TMaHoaLichHoc = {
		id?: string; // Fake id
		/** 0: Chủ nhật, 1: Thứ 2 ... */
		thu: number;
		tietBatDau: number;
		soTiet: number;
		nhanSuSsoId?: string; //SsoId
		nhanSu?: ToChucNhanSu.INhanSu;
		maNhanSu?: string;
		tenNhanSu?: string;

		loaiHinhHocTap?: ELoaiHinhHocTap;
		maNhomTietHoc?: string;
		danhSachTuan: { tuan: number; tkbId: string }[];
		phongHoc?: string;

		// FAKE IN FRONT END
		lopHocPhanId?: string; // Fake
		tenLop?: string; // Fake
		tenHocPhan?: string;
	};

	export type TCauHinhGiaiDoan = {
		tuan: number;
		soTiet: number;
	};

	export interface IRecordSinhVienLopHP extends IHocPhi {
		_id: string;
		lopHocPhanId: string;
		lopHocPhan?: IRecord;
		sinhVienSsoId: string;
		sinhVien?: SinhVien.IRecord;
		// maKhoaNganh?: string;
		// khoaNganh?: KhoaNganh.IRecord;

		maSvHk?: string; // {ssoId}|{maHocKy}
		idPhieuDktc?: string;
		// phieuDktc: ;
		loai?: ELoaiHocPhanDangKyTinChi;

		diemHpSvHk?: IDiemHpSvHk;
		createdAt?: string;

		payStatus: EMaTrangThaiThanhToan;

		// temp for đăng ký tín chỉ
		// lopChuyenToi?: IRecord; // Temp
		// trangThaiChuyenLop?: { success: boolean; reason: string };
	}

	export interface IDiemHpSvHk
		extends IDiemThanhPhan,
			IDiemThi,
			IDiemTongKet,
			HocPhan.ITrongSoDeCuong,
			HocPhan.ITrongSoThi {
		_id: string;
		sinhVienSsoId: string;
		// maSinhVien: string;
		sinhVien?: SinhVien.IRecord;

		// KHÔNG CÒN PHÂN BIỆT THEO KHÓA NGÀNH
		// maKhoaNganh: string;
		// khoaNganh?: KhoaNganh.IRecord;

		maHocPhan: string;
		hocPhan?: HocPhan.IRecord;
		maHocKy: string;
		hocKy?: HocKy.IRecord;

		/** Điểm có từ lớp học phần? */
		lopHpSvId?: string;
		tenLopHocPhan?: string;
		soThuTuLop?: number;
		lopHocPhan?: IRecord;

		/** Điểm có từ quy đổi điểm? */
		isCongNhanQuyDoiDiem?: boolean;
		dotDangKyQuyDoiDiemId?: string;
		dotDangKyQuyDoiDiem?: DotQuyDoiDiem.IRecord;
		/** Điểm từ quy đổi điểm có tính vào tích lũy? */
		coTichLuyQuyDoi?: boolean;

		/** Điểm từ học phần quy đổi (tương đương) */
		idHocPhanQuyDoi?: string;
		hocPhanQuyDoi?: HocPhan.IQuyDoiHocPhan;
		idDiemHpSvHkGoc?: string;
		diemHpSvHkGoc?: IDiemHpSvHk;

		/** Duyệt điểm thành phần */
		trangThaiDuyetDiemThanhPhan?: ETrangThaiDuyetDiem;
		/** Duyệt điểm thi */
		trangThaiDuyet?: ETrangThaiDuyetDiem;

		dat?: boolean; // Có đạt học phần này không?
		khoa: boolean; // Khóa điểm thành phần
		khoaDiemThi: boolean; // Khóa điểm thi
		public: boolean;
		/** Điểm nhập cứng, ko tính toán từ data? */
		isStatic?: boolean;
		/** Bỏ qua HP ko tính vào điểm tích lũy */
		skip?: boolean;
		tichLuy?: boolean;

		/** Chi tiết điểm chuẩn đầu ra học phần phục vụ tính chuẩn đầu ra CLO, PLO */
		danhSachDiemChuanDauRaThanhPhan?: TChiTietDiemCdr[];
		danhSachDiemChuanDauRaThi?: TChiTietDiemCdr[];
		danhSachDiemChuanDauRaThiCuoi?: TChiTietDiemCdr[];
		/** Danh sách điểm chuẩn đầu ra học phần theo CLO */
		danhSachDiemMucTieuDauRa?: TDiemChuanDauRa[];

		/** Khi get all điểm hphk của sinh viên */
		infoKhoaNganh?: Record<string, TInfoKhoaNganh>; // `maKhoaNganh` 7380101_7_1_2022: { ... }
		ghiChuDiem?: string;
	}

	export type TChiTietDiemCdr = {
		// listChuanDauRa?: ChuongTrinhDaoTao.ICdrMucTieuHocPhan[]; // PLO - CLO
		maClo: string; // CLO1
		trongSo: number; // Trọng số của CLO này
		/** diemThanhPhan1, diemThanhPhan2, diemThi1, diemThi2 ... */
		field: keyof IDiemThanhPhan | keyof IDiemThi;
		diem?: number;
	};

	export type TDiemChuanDauRa = {
		maClo: string; // CLO1
		diem?: number;

		pass?: boolean; // Có đạt CLO này không?
		diemToiThieu?: number; // Điểm tối thiểu để đạt CLO này
	};

	type TInfoKhoaNganh = Pick<SinhVien.IDiemHocPhanSv, 'maHocKyDat' | 'maHocKyCaiThien' | 'soLanHoc' | 'trongCtdt'> & {
		maHocPhanQuyDoi?: string;
	};

	export interface IDiemThanhPhan {
		diemThanhPhan1?: number;
		diemThanhPhan2?: number;
		diemThanhPhan3?: number;
		diemThanhPhan4?: number;
		diemThanhPhan5?: number;
		diemThanhPhan6?: number;
		diemThanhPhan7?: number;
		diemThanhPhan8?: number;
		diemThanhPhan9?: number;
		diemThanhPhan10?: number;
		trangThaiThi?: ETrangThaiThi;
	}

	export interface IDiemThi {
		diemThi1?: number;
		diemThi2?: number;

		/** Điểm thi 1, 2 của trọng số thứ 2 */
		diemThi12?: number;
		diemThi22?: number;

		diemThi13?: number;
		diemThi23?: number;
		diemThi14?: number;
		diemThi24?: number;
		diemThi15?: number;
		diemThi25?: number;
	}

	export interface IDiemTongKet {
		/** Trạng thái dự thi */
		trangThaiDuThi?: ETrangThaiDuThi;

		/** Điểm thi cuối */
		diemKthp?: number;

		diemTongKet?: number;
		diemThang4?: number;
		diemChu?: ELoaiDiemChu;
	}

	interface IHocPhi {
		billItemId?: string;
		trangThaiThanhToan?: ETrangThaiDotThanhToan;
	}

	export interface IRecordNhanSuLopHP {
		_id: string;
		lopHocPhanId: string;
		lopHocPhan: IRecord;
		nhanSuSsoId: string;
		nhanSu?: ToChucNhanSu.INhanSu;
		maNhanSu?: string;
		tenNhanSu?: string;
		maLoaiPhongUuTien: string;
		loai?: ELoaiPhanCongGiangDay;
		lichDayThinhGiang?: TLichDayThinhGiang[];
		lichDayCoHuu?: TLichDayThinhGiang[];
	}

	export type TLichDayThinhGiang = {
		/** 0: thứ 2, 1: thứ 3... ~ `thuTrongTuan` */
		thu: number;
		tietBatDau: number;
		tietKetThuc: number;
	};

	export type TInitConfig = {
		maMonHoc: string;
		tongDangKy: number;
		capChiaLop: 1 | 2;
		sySoToiDa: number[];
	};

	export interface ILopDuKien {
		_id: string;
		ten: string;
		hocKyFk: string;
		hocKy?: HocKy.IRecord;
		hocPhanFk: string;
		hocPhan: HocPhan.IRecord;
		tongSoNhuCau: number;
		siSoToiDa: number;
		siSoNhomToiDa: number;
		siSoToiThieu: number;
		thongTinLop?: Partial<IRecord>[];
	}

	export interface ILogLopHocPhan {
		_id: string;
		loai: ELoaiLogLopHocPhan;
		loaiThayDoiHocVien?: ELoaiThayDoiHocVien;
		idLopGoc: string;
		idLopChuyen?: string;
		hocVienSsoId: string;
		maHocVien: string;
		tenHocVien: string;
		hocVien?: SinhVien.IRecord;
		lopGoc?: IRecord;
		lopChuyen?: IRecord;
		idPhieuDangKyTinChi: string;
		phieuDangKyTinChi: PhieuDangKyTinChi.IRecord;
	}

	export interface ILopHpLopHc {
		_id?: string;
		maLopHp: string;
		lopHocPhan?: IRecord;
		maLopHc: string;
		lopHanhChinh?: LopHanhChinh.IRecord;
	}

	export interface IThongKeTyLeNhapDiem {
		chuaNhap: number;
		daNhap: number;
	}

	export interface IThongKeLopXepLich extends Pick<IRecord, '_id' | 'ten' | 'hocPhan' | 'nhanSuList'> {
		tongSoTietDaXep: number;

		// Fake
		tongSoTiet: number;
	}

	export type TTiLeDuyetGiangDayTheoDonVi = {
		donVi: Pick<ToChucNhanSu.IDonVi, 'maDonVi' | 'ten' | 'tenVietTat'>;
		trangThai: { chuaDangKy: number; dangXuLy: number; daDuyet: number };
	};

	export type TViewDiemHocKy = IDiemHpSvHk & {
		title?: string;
		tenHocPhan?: string;
		maHocPhanQuyDoi?: string;
		trongChuongTrinh?: boolean;
	};

	export type TSettingDiem = {
		_id?: string;
		/** Hệ thống tự động tính trạng thái thi? */
		tuDongTinhTrangThaiThi?: boolean;
		/** Bỏ qua check duyệt điểm thành phần khi cho sinh viên xem điểm */
		skipCheckDuyetDiemThanhPhan?: boolean;
		/** Bỏ qua check duyệt điểm thi khi cho sinh viên xem điểm */
		skipCheckDuyetDiemThi?: boolean;
		/** Đồng bộ điểm CLO sang điểm GPA (CLO -> GPA) */
		enableCLOScoreSync?: boolean;
		/** Cấu hình CLO/PLO lấy CLO/PLO làm gốc (tổng trọng số theo CLO/PLO = 100%) => Vinh */
		configFromLo?: boolean;
		/** Tính điểm CLO theo trọng số đánh giá thành phần */
		configCLoHinhThuc?: boolean;
		/** Điểm năng lực tối đa */
		diemNangLucToiDa?: number;

		/** Cho phép cán bộ công bố điểm thành phần lớp tín chỉ */
		choPhepGiangVienCongBoDiemThanhPhan?: boolean;
		/** Cho phép cán bộ công bố điểm thi lớp tín chỉ */
		choPhepGiangVienCongBoDiemThi?: boolean;
		/** Cho phép giảng viên ghi đè các cấu hình liên quan đến tính chất của học phần */
		choPhepGVOverrideLoaiHocPhan?: boolean;

		/** Cách tính điểm thi lại */
		cachTinhDiemThiLai?: ECachTinhDiemThiLai;

		/** Danh sách mẫu bảng điểm */
		danhSachMauBangDiem?: { ten: string; idFile: string }[];
	};

	export interface ILmsInfo {
		_id?: string;
		sinhVien: {
			_id: string; //ssoId
			id: number;
			ma: string;
			ten: string;
			email: string;
		};
		hocPhan: {
			_id: string;
			id: number;
			ten: string;
			ma: string;
		};
		tiLeHoanThanh: number;
		thoiGianTaoVao: Date;
		thoiGianCapNhatGanNhatVao: '03:23:40 22-12-2024';
		hocLieu: THocLieuLms[];
	}

	export type TThongKeTiLeDatPlo = ChuongTrinhDaoTao.IChuanDauRa & {
		diemCaoNhat: number;
		diemThapNhat: number;
		diemTrungBinh: number;
		sinhVienDat: number;
		tongSinhVien: number;
		tyLeDat: number;
		phoDiem: {
			min: number;
			max: number;
			count: number;
		}[];
	};

	export type TThongKeTiLeDatClo = HocPhan.IChuanDauRa & {
		diemCaoNhat: number;
		diemThapNhat: number;
		diemTrungBinh: number;
		sinhVienDat: number;
		tongSinhVien: number;
		tyLeDat: number;
		phoDiem: {
			min: number;
			max: number;
			count: number;
		}[];
	};

	export type TThongKeTiLeDat = TThongKeTiLeDatPlo & TThongKeTiLeDatClo;

	export interface IKhoiTaoImportKhocKy {
		session: {
			_id: string;
			syncSessionId: string;
			module: string;
			key: string;
			username: string;
			ssoId: string;
			fullname: string;
			email: string;
			dataPartitionCode: string;
			createdAt: Date;
			updatedAt: Date;
		};
		totalLop: number;
		notUpdateLop: number;
		totalLopHpSv: number;
		notUpdateLopHpSv: number;
		totalLopHpNs: number;
		notUpdateLopHpNs: number;
		totalTkb: number;
		notUpdateTkb: number;
	}
}
