declare module DotCapNhatHoSo {
	export interface IRecord {
		_id: string;
		tenDot: string;
		kichHoat: boolean;
		thoiGianBatDau: string;
		thoiGianKetThuc: string;
		trangThai: string;
		createdAt: string;
		updatedAt: string;
	}
	export interface IThongTinSinhVien {
		ten: string;
		cccd: null;
		_id: string;
		ssoId: string;
		soDienThoai: null;
		email: string;
    lopHanhChinh: string;
		lopHanhChinhList: {
			siSo: 0;
			_id: string;
			ma: string;
			ten: string;
			maNganh: string;
			nhanSuSsoId: null;
			siSoToiDa: 166;
			doiTuong: string;
			createdAt: string;
			updatedAt: string;
			maKhoaNganh: string;
			idDotNhapHoc: null;
			maKhoaSinhVien: string;
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
			dmNganhId: null;
			ma: string;
			ten: string;
			tenTiengAnh: null;
			canCuId: null;
			maDonVi: string;
			createdAt: string;
			updatedAt: string;
			maDmNganh: string;
			maTrinhDo: string;
			maNganhGoc: null;
			maCanCuPhapLy: null;
		};
		khoaSinhVien: {
			_id: string;
			ma: string;
			ten: string;
			namHocBatDau: 2023;
			createdAt: string;
			updatedAt: string;
			namHocId: null;
			maHinhThucDaoTao: string;
			maTrinhDoDaoTao: string;
		};
		kqhtTichLuyList: [];
		trinhDoDaoTao: {
			_id: string;
			dmTrinhDoId: null;
			maDmTrinhDo: string;
			ma: string;
			ten: string;
			canCuId: null;
			createdAt: string;
			updatedAt: string;
		};
		hinhThucDaoTao: {
			_id: string;
			danhMucHTDTId: null;
			maDmHinhThuc: string;
			ma: string;
			ten: string;
			createdAt: string;
			updatedAt: string;
			canCuId: null;
		};
	}
}
