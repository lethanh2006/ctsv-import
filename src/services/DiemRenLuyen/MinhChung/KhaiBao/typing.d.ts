declare module KhaiBaoDRL {
	export interface IRecord {
		_id: string;
		ssoId: string;
		hoTen: string;
		maSinhVien: string;
    diemQuyDoi: number;
		lopHanhChinh: string;
		nguoiKhaiBao: {
			ssoId: string;
			ten: string;
			ma: string;
			email: string;
		};
		cauHinhMinhChungId: string;
    dotChamDiemId: string;
		thongTinKhaiBao: any;
    trangThai: string;
		createdAt: string;
		updatedAt: string;
		__v: number;
	}
}
