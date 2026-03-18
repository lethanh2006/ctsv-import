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
		maTrinhDo: string;
		trinhDo?: TrinhDoDaoTao.IRecordCoSo;
		maDmNganh: string;
		dmNganh?: NganhDaoTao.IRecordBo;
		maCanCuPhapLy?: string;
		canCu?: VanBanQuyDinh.IRecord;
		maNganhGoc?: string | null;
		nganhGoc?: IRecordCoSo;
		parentId?: string | null;

		maDonVi?: string;
		donVi?: ToChucNhanSu.IDonVi;

		createdAt?: string;
		updatedAt?: string;
	}
}
