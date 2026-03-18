import type { SinhVien } from '../SinhVien/typings';

declare module LopHanhChinh {
	export interface IRecord {
		siSo: number;
		_id: string;
		ma: string;
		ten: string;
		maNganh: string;
		nhanSuSsoId: string;
		siSoToiDa: string;
		doiTuong: string;
		createdAt: string;
		updatedAt: string;
		maKhoaNganh: string;
		idDotNhapHoc: string;
		maKhoaSinhVien: string;
		lopHcSvKyList: SinhVien.ISinhVienHocKy[];
		khoaSinhVien: {
			_id: string;
			ma: string;
			ten: string;
			namHocBatDau: number;
			createdAt: string;
			updatedAt: string;
			namHocId: string;
			maHinhThucDaoTao: string;
			maTrinhDoDaoTao: string;
		};
		sinhVienList: {
			ma: string;
			trangThaiHoc: string;
			ten: string;
			ssoId: string;
			LopHcSvModel: {
				_id: string;
				createdAt: string;
				updatedAt: string;
				lopHanhChinhId: string;
				sinhVienSsoId: string;
			};
		}[];

		nganh: {
			tenVietTat: string;
			_id: string;
			dmNganhId: string;
			ma: string;
			ten: string;
			tenTiengAnh: string;
			canCuId: string;
			maDonVi: string;
			createdAt: string;
			updatedAt: string;
			maTrinhDo: string;
			maNganhGoc: string;
			maCanCuPhapLy: string;
			dmNganh: {
				_id: string;
				dmNhomNganhId: string;
				dmTrinhDoId: string;
				ma: string;
				ten: string;
				createdAt: string;
				updatedAt: string;
				maDmNhomNganh: string;
				maDmTrinhDo: string;
			};
		};
	}
}
