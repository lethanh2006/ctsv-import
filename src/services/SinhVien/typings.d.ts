import { type ChuongTrinhDaoTao } from '../DanhMucHeThong/ChuongTrinhDaoTao/typings';
import { type ELoaiDiemChu } from '../KetQuaHocTap/constant';
import { type LopHanhChinh } from '../NamHoc/LopHanhChinh/typings';
import type {
	ELoaiNoiSinh,
	EGioiTinh,
	EHinhThucTuyenDung,
	ENoiNgoaiTru,
	EViTriViecLam,
	ETrangThaiThanhVienGiaDinh,
} from './constant';

declare module SinhVien {
	export interface IRecord {
		_id: string;
		ssoId: string;
		trangThaiHoc?: string;
		anhDaiDienUrl?: string | null;
		ma: string;
		ten: string;
		firstName: string;
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

		// tenGiamHo: string;
		// ngaySinhGiamHo: string;
		// ngheNghiepGiamHo: string;
		// soDienThoaiGiamHo: string;
		// emailGiamHo: string;
		// noiCongTacGiamHo: string;
		// nguyenQuanGiamHo: string;
		// diaChiGiamHo: string;
		// tenChuHo: string;

		trangThaiCha: ETrangThaiThanhVienGiaDinh;
		tenCha: string;
		namSinhCha: number;
		soDienThoaiCha: string;
		ngheNghiepCha: string;
		emailCha: string;
		noiCongTacCha: string;
		nguyenQuanCha: string;
		diaChiCha: string;

		trangThaiMe: ETrangThaiThanhVienGiaDinh;
		tenMe: string;
		namSinhMe: number;
		soDienThoaiMe: string;
		ngheNghiepMe: string;
		emailMe: string;
		noiCongTacMe: string;
		nguyenQuanMe: string;
		diaChiMe: string;

		tenVoChong: string;
		ngheNghiepVoChong: string;
		diaChiVoChong: string;
		soDienThoaiVoChong: string;
		emailVoChong: string;
		thongTinAnhChiEm: string;
		// thongTinCacCon: string;

		maKhoaSinhVien: string;
		khoaSinhVien?: KhoaSinhVien.IRecord;
		maKhoaNganh?: string;
		khoaNganh?: KhoaNganh.IRecord;
		lopHanhChinhList?: LopHanhChinh.IRecord[];
		maNganh: string;
		maTrinhDo: string;
		maHinhThuc: string;
		chuongTrinhId: string;

		// Thông tin tuyển sinh
		doiTuongDauVao: string;
		diemTrungTuyen: number;
		soQuyetDinhTrungTuyen: string;
		ngayKyQuyetDinhTrungTuyen: string;
		ngayNhapHoc: string;
	}

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

	export interface ICongNoSinhVien {
		_id: string;
		sinhVienSsoId: string;
		sinhVien?: IRecord;
		dichVu: string;
		soTienPhaiNop: number;
		soTienDaNop: number;
	}

	export interface IDiemHocPhanSv extends Omit<LopHocPhan.IDiemTongKet, 'diemKthp'> {
		_id: string;
		sinhVienSsoId: string;
		sinhVien?: IRecord;
		maHocPhan: string;
		hocPhan?: HocPhan.IRecord;
		maKhoaNganh: string;

		soLanHoc: number;
		trangThaiThi: ETrangThaiThi;
		soThuTuKyKeHoach: number;
		maHocKyKeHoach: string;
		trangThai: ETrangThaiDiemHocPhanSv;
		maSvHp: string;
		lopHpSvList?: LopHocPhan.IRecordSinhVienLopHP[];
	}
}
