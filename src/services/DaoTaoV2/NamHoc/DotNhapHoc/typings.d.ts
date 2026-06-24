declare module DotNhapHoc {
	export interface IRecord {
		_id: string;
		ten: string;
		soThuTu: number;
		khoasinhVienSsoId: string;
		khoaSinhVien?: KhoaSinhVien.IRecord;
		thoiGianBatDau?: string;
		thoiGianKetThuc?: string;
		createdAt?: string;
		updatedAt?: string;
	}

	export interface ISinhVienDotNhapHoc {
		_id: string;
		sinhVienSsoId: string;
		sinhVien: SinhVien.IRecord;
		idDotNhapHoc: string;
		dotNhapHoc: DotNhapHoc.IRecord;
		doiTuongDauVao: string;
		ketQuaTuyenSinh: string;
		quyetDinhId: string;
		quyetDinh: QuyetDinh.IRecord;
		ngayNhapHoc: Date;
	}
}
