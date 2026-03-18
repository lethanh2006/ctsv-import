declare module DotChamDiemRenLuyen {
	export interface IRecord {
		_id: string;
		tenDot: string;
		kyHoc: string;
		idBieuMau: string;
		thoiGianTiepNhanMinhChung: {
			thoiGianBatDau: string;
			thoiGianKetThuc: string;
			_id: string;
		};
		thoiGianSVChamDiem: {
			thoiGianBatDau: string;
			thoiGianKetThuc: string;
			_id: string;
		};
		thoiGianCoVanChamDiem: {
			thoiGianBatDau: string;
			thoiGianKetThuc: string;
			_id: string;
		};
		thoiGianKhieuNai: {
			thoiGianBatDau: string;
			thoiGianKetThuc: string;
			_id: string;
		};
		thoiGianKhoaChamDiem: {
			thoiGianBatDau: string;
			thoiGianKetThuc: string;
			_id: string;
		};
		thoiGianBCSChamDiem: {
			thoiGianBatDau: string;
			thoiGianKetThuc: string;
			_id: string;
		};
		thoiGianPhongCTSVChamDiem: {
			thoiGianBatDau: string;
			thoiGianKetThuc: string;
			_id: string;
		};
		createdAt: string;
		updatedAt: string;
		__v: number;
		[k: string]: any;
	}
	export interface IPhanQuyen {
		isKhoa: true;
		isPhongCTSV: false;
		donVi: {
			_id: string;
			ten: string;
			maDonVi: string;
			donViChaId: string;
			loaiPhongBanId: string;
			loaiHinhDonVi: string;
			laDonViThucTe: string;
			soQuyetDinhThanhLap: string;
			tenVietTat: string;
			ngayRaQuyetDinh: string;
			diaChiDonVi: string;
			sdtDonVi: string;
			isBanGiamDoc: boolean;
			emailDonVi: string;
			loaiTrucThuoc: string;
			urlFileUpload: string;
			moTa: string;
			chucDanhKiemNhiem: string;
			hienThi: boolean;
			loaiTuChuTaiChinh: string;
			createdAt: string;
			updatedAt: string;
			loaiPhongBan: {
				ten: string;
				ma: string;
			};
			donViCha: null;
			danhSachDonViCon: [];
			danhSachDonViViTri: {
				_id: string;
				tenChucVu: string;
				loai: string;
				soLuong: number;
				capChucVu: string;
				donViId: string;
				chucVuId: string;
				chucVu: {
					ma: string;
					ten: string;
				};
				donVi: {
					maDonVi: string;
					ten: string;
				};
			}[];

			danhSachNhanSuDonViChinh: {
				_id: string;
				maCanBo: string;
				hoDem: string;
				ten: string;
				trangThai: string;
				loaiHoSo: string;
				cccdCMND: string;
				trangThaiChinhSua: string;
				loaiCanBoGiangVien: string;
				ssoId: string;
				donViChinh: {
					maDonVi: string;
					ten: string;
					_id: string;
				};
				donViViTri: {
					capChucVu: string;
					tenChucVu: string;
					_id: string;
				};
			}[];
		};
		nhanSu: ToChucNhanSu.INhanSu;
	}
	export interface DoiTuongChamDiem {
		thoiGian: any;
		loaiDoiTuongChamDiem: ELoaiDoiTuongChamDiem;
		thoiGianBatDauCham: string;
		thoiGianKetThucCham: string;
	}

	export interface IRecordVWA {
		_id: string;
		maHocKy: string;
		danhSachDoiTuongChamDiem: DoiTuongChamDiem[];
		mauDrlId: string;
		mauDrl: MauDiemRenLuyen.IRecord;
		thoiGianBatDau: string;
		thoiGianKetThuc: string;
	}
}
