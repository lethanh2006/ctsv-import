import type { ChungChi } from '../DanhMucHeThong/ChungChi/typing';
import { type ChuongTrinhDaoTao } from '../DanhMucHeThong/ChuongTrinhDaoTao/typings';
import type { NganhDaoTao } from '../DanhMucHeThong/Nganh/typings';
import type { HocKy } from '../HocKy/HocKy/typing';
import type { KetQuaHocKy } from '../KetQuaHocTap/KetQuaHocKy/typing';
import { type ELoaiDiemChu } from '../KetQuaHocTap/constant';
import { type LopHanhChinh } from '../NamHoc/LopHanhChinh/typings';
import type {
	EGioiTinh,
	EHinhThucTuyenDung,
	ELoaiNoiSinh,
	ELoaiThanhVienGiaDinh,
	ENoiNgoaiTru,
	ETrangThaiHocSv,
	ETrangThaiThanhVienGiaDinh,
	EVaiTroSvLhc,
	EViTriViecLam,
} from './constant';

declare module SinhVien {
	export interface IRecord {
		_id: string;
		dotNhapHocId: string | null;
		dotNhapHoc?: DotNhapHoc.IRecord;
		ssoId: string;
		trangThaiHoc?: ETrangThaiHocSv; //Trạng thái học tổng
		trangThaiHocNganh1?: ETrangThaiHocSv;
		trangThaiHocNganh2?: ETrangThaiHocSv;
		anhDaiDienUrl?: string | null;
		ma: string;
		ten: string;
		firstName: string;
		middleName: string;
		lastName: string;
		gioiTinh: EGioiTinh;

		quocTich: string;
		danToc: string;
		tonGiao: string;
		ngaySinh: string;
		cccd: string;
		noiCapCccd: string;
		ngayCapCccd: string;
		soDienThoai: string;
		email: string;
		doiTuong: EDoiTuongLopHanhChinh;

		maCSDT: string;
		csdt?: CoSoDaoTao.IRecord;
		// soDienThoai2: string;
		// email2: string;
		// nguoiLienLac: string;
		// soDienThoaiNguoiLienLac: string;

		loaiNoiSinh: ELoaiNoiSinh;
		quocGiaNoiSinh: string;
		tinhTpNoiSinh: string;
		// quanHuyenNoiSinh: string;
		// xaPhuongNoiSinh: string;

		tinhTpQueQuan: string;
		quanHuyenQueQuan: string;
		xaPhuongQueQuan: string;
		// soNhaTenDuongQueQuan: string;

		tinhTpThuongTru: string;
		quanHuyenThuongTru: string;
		xaPhuongThuongTru: string;
		soNhaTenDuongThuongTru: string;

		// laDoanVien: boolean;
		ngayVaoDoan: string;
		// daHocLopCamTinhDang: boolean;
		// laDangVien: boolean;
		ngayVaoDang: string;
		ngayVaoDangChinhThuc: string;

		soTaiKhoanNganHang: string;
		tenNganHang: string;
		chiNhanhNganHang: string;

		loaiKhuyetTat: string;
		canNang: number;
		chieuCao: number;
		soBaoHiemSinhVien: string;
		maBenhVienKhamChuaBenh: string;
		thanhVienGiaDinh?: TThongTinGiaDinh[];
		visaList?: TThongTinVisa[];
		maKhoaNganh?: string;
		khoaNganh?: KhoaNganh.IRecord;
		maKhoaSinhVien: string;
		khoaSinhVien?: KhoaSinhVien.IRecord;
		maNganh: string;
		nganh?: NganhDaoTao.IRecordCoSo;
		maChuyenNganh?: string;
		chuyenNganh?: NganhDaoTao.IRecordCoSo;

		svKhoaNganhList?: ISvKhoaNganh[]; // Thông tin học vụ của sinh viên tương ứng với từng khóa ngành

		// SONG NGÀNH
		maKhoaNganh2?: string;
		maKhoaSinhVien2?: string;
		maNganh2?: string;
		khoaNganh2: KhoaNganh.IRecord;
		khoaSinhVien2: KhoaSinhVien.IRecord;
		nganh2: NganhDaoTao.IRecordCoSo;
		maChuyenNganh2?: string;
		chuyenNganh2?: NganhDaoTao.IRecordCoSo;

		lopHanhChinhList?: LopHanhChinh.IRecord[];
		tenLopHanhChinhVirtual?: string;
		maTrinhDo: string;
		trinhDoDaoTao: TrinhDoDaoTao.IRecordCoSo;
		maHinhThuc: string;

		// Thông tin tuyển sinh
		doiTuongDauVao: string;
		diemTrungTuyen: number;
		soQuyetDinhTrungTuyen: string;
		ngayKyQuyetDinhTrungTuyen: string;
		ngayNhapHoc: string;
		ketQuaTuyenSinh: string;

		//Kết quả học tập tích lũy
		kqhtTichLuyList?: KetQuaHocKy.IKetQuaTichLuy[];
		kqhtTichLuyNganh1?: KetQuaHocKy.IKetQuaTichLuy;
		kqhtTichLuyNganh2?: KetQuaHocKy.IKetQuaTichLuy;

		diemRenLuyen: number;
		xepLoai: string;
		soHoatDong: number;
		gpa: number;
		congNo: boolean;
		tienNo: number;

		phanLoaiDanhGia: EPhanLoaiDanhGia;

		tienDoTichLuy: number;
		soHocPhanChuaDat: number;

		updatedAt: string;
		choPhepSua: string;
	}

	export type TThongTinGiaDinh = {
		key?: number;
		loaiThanhVien: ELoaiThanhVienGiaDinh;
		trangThaiThanhVien: ETrangThaiThanhVienGiaDinh;
		hoDem?: string;
		ten?: string;
		ngaySinh?: string;
		namSinh?: number;

		quocTich?: string;
		danToc?: string;
		tonGiao?: string;

		soDienThoai?: string;
		email?: string;
		ngheNghiep?: string;
		coQuanCongTac?: string;
		diaChiHienNay?: TDiaChi;
		hoKhauThuongTru?: TDiaChi;
		soTheBHYT?: string;
		hoatDongChinhTriXaHoi?: string;
	};

	export type TDiaChi = {
		maTP: string;
		tenTP: string;
		maQH: string;
		tenQH: string;
		maXaPhuong: string;
		tenXaPhuong: string;
		diaChi?: string;
	};

	export interface IHocBongSinhVien {
		_id: string;
		sinhVienSsoId: string;
		sinhVien?: IRecord;
		ten: string;
		donViTaiTro: string;
		thoiGianTraoTangHocBong: string;
		loaiHocBongId: string;
		loaiHocBong?: LoaiHocBong.IRecord;
		giaTriHocBong: number;
	}

	export interface IKhenThuongSinhVien {
		_id: string;
		sinhVienSsoId: string;
		sinhVien?: IRecord;
		namKhenThuong: number;
		soQuyetDinhKhenThuong: string;
		danhHieuThiDuaGiaiThuongKhenThuong: string;
		capKhenThuong: string;
		loaiDanhHieuThiDuaGiaiThuongKhenThuong: string;
		phuongThucKhenThuong: string;
	}

	export interface IKyLuatSinhVien {
		_id: string;
		sinhVienSsoId: string;
		sinhVien?: IRecord;
		capQuyetDinh: string;
		soQuyetDinh: string;
		ngayQuyetDinh: string;
		namBiKyLuat: number;
		lyDo: string;
		loaiKyLuat: string;
	}

	export interface INoiTruSinhVien {
		_id: string;
		sinhVienSsoId: string;
		sinhVien?: IRecord;
		maKyHoc: string;
		tinhTrang: ENoiNgoaiTru;
		diaChi: string;
		thoiGianKhaiBao: string;
	}

	export interface IViecLamSinhVien {
		_id: string;
		sinhVienSsoId: string;
		sinhVien?: IRecord;
		donViTuyenDung: string;
		hinhThucTuyenDung: EHinhThucTuyenDung;
		thoiGianTuyenDung: string;
		viTriViecLam: EViTriViecLam;
		mucLuongKhoiDiem: number;
		soDienThoaiLh: string;
		email: string;
	}

	export interface IThongTinHocTapHienTai {
		chuongTrinhDaoTao: ChuongTrinhDaoTao.IRecord;
		daoTaoTuNam: string; //"2023-04-28T07:06:57.151Z"
		diemTbtl4: number;
		diemTbtl10: number;
		diemTbtlChu: ELoaiDiemChu;
		hinhThucDaoTao: HinhThucDaoTao.IRecordCoSo;
		khoaSinhVien: KhoaSinhVien.IRecord;
		loaiHocVien: string; //"Sinh viên",
		lopHanhChinh: LopHanhChinh.IRecord;
		nganhDaoTao: NganhDaoTao.IRecordCoSo;
		sinhVienNamThu: string; //"Sinh viên năm nhất"
		soNamDaoTao: number;
		trangThaiSinhVien: string; //"Đang học"
	}

	export interface IChungChiSinhVien {
		_id: string;
		sinhVienSsoId: string;
		sinhVien?: IRecord;
		maChungChi: string;
		chungChi?: ChungChi.IRecord;
		ngayCap?: string;
		donViCap?: string;
		diem?: number;
		// ten?: string;
		// loaiThoiHan?: ELoaiThoiHanChungChi;
		// ngayHetHan?: string;
		// duDkDauRa?: boolean;
	}

	export interface ITienTrinhTotNghiep {
		diemTichLuyToiThieu: number;
		thongTinCdr?: ChuongTrinhDaoTao.IChungChiCTDT[];
		kqhtHocKy?: KetQuaHocKy.IRecord;
		ctdtKeHoach?: ChuongTrinhDaoTao.IRecord;
	}

	export type TThongKeTrangThai = {
		baoLuu: number;
		dangHoc: number;
		thoiHoc: number;
		totNghiep: number;
	};
	export interface IThongTinDaoTaoSinhVien {
		loaiHocVien: ELoaiSinhVien;
		thongTinNganhChinh: IThongTinHocTapHienTai;
		thongTinNganh2: IThongTinHocTapHienTai;
	}

	export interface ISinhVienHocKy {
		_id: string;
		lopHanhChinhId: string;
		sinhVienSsoId: string;
		sinhVien?: IRecord;
		lopHanhChinh?: LopHanhChinh.IRecord;
		maHocKy: string;
		hocKy?: HocKy.IRecord;

		vaiTro?: EVaiTroSvLhc;
		trangThaiHoc?: ETrangThaiHocSv;
		ghiChuHocKy?: string;
	}

	export interface IChuyenTruong {
		_id: string;
		sinhVienSsoId: string;
		maSinhVien?: string;
		tenSinhVien?: string;
		sinhVien?: IRecord;

		loaiChuyenTruong: ELoaiChuyenTruong;
		tenTruong: string;
		tenNganh?: string;

		quyetDinhId?: string;
		quyetDinh?: QuyetDinh.IRecord;
		trangThai: ETrangThaiSinhVienDot;

		ghiChu?: string;
		lyDo?: string; // Lý do không duyệt
		dinhKemUrl?: string[] | null;
	}

	export type TDuyetQuyetDinhChuyenTruong = {
		quyetDinh: QuyetDinh.IRecord;
		ids: string[];
	};

	export interface IChuyenNganh {
		_id: string;
		sinhVienSsoIdCu: string;
		sinhVienCu?: IRecord;
		tenLopHanhChinhMoi: string;
		lopHanhChinhMoi?: LopHanhChinh.IRecord;
		trangThai: ETrangThaiChuyenNganh;

		ghiChu?: string;
		tenLopHanhChinhCu: string;
		lopHanhChinhCu?: LopHanhChinh.IRecord;

		// sinhVienSsoIdMoi?: string;
		// sinhVienMoi?: IRecord;
		idQuyetDinh?: string;
		quyetDinh?: QuyetDinh.IRecord;

		maNguoiDuyet?: string;
		idNguoiDuyet?: string;
		tenNguoiDuyet?: string;
		thoiGianDuyet?: string;
	}
}
