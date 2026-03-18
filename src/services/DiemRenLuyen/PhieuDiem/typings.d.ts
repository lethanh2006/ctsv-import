import type { QuyTrinh } from '@/services/QuyTrinhDong/typings';
import type { DotDiemRenLuyen } from '../Dot/typings';
import type { ELoaiDoiTuongChamDiem, ETrangThaiChamDiem, EXepLoai } from '../constants';
import type { NganhDaoTao } from '@/services/DaoTaoV2/DanhMucHeThong/Nganh/typings';

declare module PhieuDiemRenLuyen {
	export interface ChamDiem {
		loaiDoiTuongChamDiem: ELoaiDoiTuongChamDiem;
		thongTinNguoiCham: QuyTrinh.IThanhVienXuLy;
		thongTinCham: any;
	}

	export interface IRecord {
		_id: string;
		dotDrlId: string;
		dotDrl: DotDiemRenLuyen.IRecord;
		thongTinNguoiTao: QuyTrinh.IThanhVienXuLy;
		maLopHanhChinh: string;
		maDonVi: string;
		danhSachChamDiem: ChamDiem[];
		trangThai: ETrangThaiChamDiem;
		diemSo: number;
		diemTrungBinh: number;
		xepLoai: EXepLoai;
		nganh: NganhDaoTao.IRecordCoSo;
		donVi: {
			ten: string;
			donViCha: { ten: string };
		};
		'thongTinNguoiTao.ten': string;
		'thongTinNguoiTao.ma': string;
		'thongTinNguoiTao.donVi': string;
		'thongTinNguoiTao.ssoId': string;
	}
}
