declare module KhoaNganh {
	export interface IRecord {
		_id: string;
		ma: string;
		ten: string;
		maChuongTrinhDaoTao: string;
		chuongTrinh?: ChuongTrinhDaoTao.IRecord;
		maKhoaSinhVien: string;
		khoaSinhVien: KhoaSinhVien.IRecord;
		maNganh: string;
		nganh: NganhDaoTao.IRecordCoSo;
		namBatDau?: number;
		namKetThuc?: number;

		maCSDT: string;
		csdt?: CoSoDaoTao.IRecord;
		maTinhChatCt: string;
		tinhChatCt?: TinhChatChuongTrinh.IRecord;

		createdAt?: string;
		updatedAt?: string;

		// Fake query
		maTrinhDo?: string;
		maHinhThuc?: string;
	}

	export type TKhoaNganhSv = {
		khoaNganhChinh: IRecord;
		khoaNganhPhu?: IRecord;
	};
}
