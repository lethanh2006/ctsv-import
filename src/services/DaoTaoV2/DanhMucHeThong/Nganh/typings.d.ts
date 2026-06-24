import type { ToChucNhanSu } from '@/services/ToChucNhanSu/typing';

declare module NganhDaoTao {
	export interface IRecordBo {
		_id: string;
		ma: string;
		ten: string;
		maDmNhomNganh: string;
		dmNhomNganh?: NhomNganhDaoTao.IRecordBo;
		maDmTrinhDo: string;
		dmTrinhDo?: TrinhDoDaoTao.IRecordBo;
		createdAt?: string;
		updatedAt?: string;
	}

	export interface IRecordCoSo {
		_id: string;
		ma: string;
		ten: string;
		tenTiengAnh: string;
		tenVietTat: string;
		maTrinhDo: string;
		trinhDo?: TrinhDoDaoTao.IRecordCoSo;
		maDmNganh: string;
		dmNganh?: NganhDaoTao.IRecordBo;
		maCanCuPhapLy?: string;
		canCu?: VanBanQuyDinh.IRecord;
		maNganhGoc?: string | null;
		nganhGoc?: IRecordCoSo;
		loai?: ELoaiNganhChuyenNganh;
		active?: boolean;
		maDonVi?: string;
		donVi?: ToChucNhanSu.IDonVi;

		maCoSoDaoTao?: string;
		coSoDaoTao?: CoSoDaoTao.IRecord;
		trangThaiDaoTao?: ETrangThaiDaoTaoNganh;
		coQuanBanHanh?: string;
		soQuyetDinhMoNganh?: string;
		ngayBanHanhMoNganh?: string;
		soQuyetDinhDoiTen?: string;
		ngayBanHanhDoiTen?: string;
		nguoiKy?: string;
		namBatDauDaoTao?: number;
		namTuyenSinh?: string;
		quyetDinhTuChu?: EQuyetDinhTuChu;
		tuChuMoNganh?: EThuChuMoNganh;
		keHoachDaoTao?: string;
		nganhDaoTaoLienKet?: boolean;
		hìnhThucChuyenNgu?: boolean;
		uuTienDaoTao?: boolean;
		namBatDauThucHien?: string;
		soQuyetDinhDaoTaoTuXa?: string;
		ngayQuyetDinhDaoTaoTuXa?: string;
		namBatDauDaoTaoTuXa?: number;
		fileMinhChungDaoTaoTuXa?: string | null;
		fileMinhChungMoNganh?: string | null;
		fileMinhChungDoiTen?: string | null;
		createdAt?: string;
		updatedAt?: string;

		sinhVienSsoId?: string;
		sinhVien?: SinhVien.IRecord;

		idPhieuDkCtdt?: string;
		phieuDkCtdt?: DangKyChuyenNganhPhu.ISinhVienDangKy;
	}
}
