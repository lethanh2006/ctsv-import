import type { ELoaiBoLoc } from '@/services/CheDoSinhVien/constant';
import type { QuyTrinh } from '../typings';
import type { ELoaiBieuDoThongKe, ELoaiFilterThongKe, ELoaiThongKeQuyTrinhDong } from './constant';

declare module ThongKeQuyTrinhDong {
	export interface FilterThongKe {
		tenThongKe: string;
		loaiFilterThongKe: ELoaiFilterThongKe;
		truongThongTinThongKe: string;
		loai: ELoaiBoLoc;
		danhSachGiaTri: string;
		maModule: string;
		maDanhMuc: string;
	}
	export interface IRecord {
		_id: string;
		quyTrinhId: string;
		quyTrinhDong: QuyTrinh.IRecord;
		ten: string;
		ma: string;
		loaiThongKe: ELoaiThongKeQuyTrinhDong;
		fileId: string;
		loaiBieuDoThongKe: ELoaiBieuDoThongKe;
		aggregationArray: string;
		danhSachFilterThongKe: FilterThongKe[];
	}
}
