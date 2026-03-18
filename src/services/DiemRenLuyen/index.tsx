import type { ETrangThaiTiepNhanMinhChung } from '@/services/DiemRenLuyen/MinhChung/KhaiBao/constants';
import axios from '@/utils/axios';
import { ip3, ipNhanSu, ipSlink } from '@/utils/ip';
import type { ENguoiTraLoiDrl } from './PhieuDiemRenLuyen/constants';

export async function checkPhanQuyen() {
	return axios.get(`${ipNhanSu}/don-vi/check-don-vi-ctsv`);
}
export async function getThongKe(maHocKy: string, condition: any) {
	return axios.get(`${ipSlink}/phieu-diem-ren-luyen/thong-ke/hoc-ky/${maHocKy}`, {
		params: {
			condition,
		},
	});
}
export async function getThongKeTheoKhoaHoc(maHocKy: string, condition: any) {
	return axios.get(`${ipSlink}/phieu-diem-ren-luyen/thong-ke/hoc-ky/${maHocKy}/khoa-sinh-vien`, {
		params: { condition },
	});
}

export const exportPhieuDiem = (idDot: string, nguoiTraLoi: ENguoiTraLoiDrl, ssoId: string) =>
	axios.get(`${ip3}/phieu-diem-ren-luyen/${idDot}/${nguoiTraLoi}/export`, {
		responseType: 'arraybuffer',
		params: { ssoId: ssoId },
	});

export async function getDanhSachSinhVien() {
	return axios.get(`${ipSlink}/phieu-diem-ren-luyen/danh-sach-sv`);
}

export async function checkTrangThaiKhaiBaoMinhChung(
	idDot: string,
	lopHanhChinh: string,
	trangThai?: ETrangThaiTiepNhanMinhChung,
) {
	return axios.get(`${ip3}/khai-bao-minh-chung/check-trang-thai/${lopHanhChinh}/${idDot}`, {
		params: { trangThai: trangThai },
	});
}
export async function getTrangThaiKhaiBaoDrl(idDot: string, payload?: any) {
	return axios.post(`${ip3}/khai-bao-minh-chung/trang-thai-duyet-theo-list-lop/${idDot}`, { ...payload });
}
export async function duyetTheoLopHanhChinh(
	idDot: string,
	lopHanhChinh: string,
	trangThai?: ETrangThaiTiepNhanMinhChung,
) {
	return axios.put(`${ip3}/khai-bao-minh-chung/duyet-theo-lop-hanh-chinh/${lopHanhChinh}/${idDot}`, {
		trangThai: trangThai,
	});
}
