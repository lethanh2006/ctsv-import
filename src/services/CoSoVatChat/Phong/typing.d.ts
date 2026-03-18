declare module PhongCSVC {
	export interface IRecord {
		_id: string;
		maToaNha: string;
		toaNha: ToaNha.IRecord;
		maKhuNha: string;
		khuNha: KhuNha.IRecord;
		tangThu: number;
		soPhong: string;
		ma: string;
		ten: string;
		maLoaiPhong: string;
		loaiPhong?: LoaiPhong.IRecord;
		idDonViSuDung: string;
		maDonViSuDung: string;
		tenDonViSuDung: string;
		sucChua: number;
		sucChuaHoc: number;
		sucChuaThi: number;
		thietBiCNC: boolean;
		danhSachTinhChatPhong: ITinhChatPhong[];
		danhSachTaiSan: TaiSan.IRecord[];
		tenVietTatTinhChatPhongCongNangChinh: string;

		dienTich: number;
		maHinhThucSoHuu: string;
		hinhThucSoHuu: HinhThucSoHuu.IRecord;
		tinhTrangCsvc: ETinhTrangCoSoVatChat;
		loaiDeAn: ELoaiDeAn;
		namDuaVaoSuDung: number;
		maLoaiCongTrinh: string;
		loaiCongTrinh: LoaiCongTrinh.IRecord;
		maMucDichSuDung: string;
		mucDichSuDung: MucDichSuDung.IRecord;
		doiTuongSuDung: string;
		vonBanDau: number;
		vonDauTu: number;
		trongTrinhTrongNha: boolean;
		soPhongCongVu: number;
		soPhongOCanBo: number;
	}
}
