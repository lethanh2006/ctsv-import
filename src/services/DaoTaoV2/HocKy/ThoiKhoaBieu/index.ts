import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import { type ThoiKhoaBieu } from './typing';

export async function importThoiKhoaBieu(payload: { file: Blob }) {
	const form = new FormData();
	form.append('file', payload.file);
	return axios.put(`${ip3}/thoi-khoa-bieu/import/custom-template`, form);
}

export async function importThoiKhoaBieu1(maHocKy: string, payload: { file: Blob }) {
	const form = new FormData();
	form.append('file', payload.file);
	return axios.put(`${ip3}/thoi-khoa-bieu/import/convert/hoc-ky/${maHocKy}`, form);
}

export async function putLichHocTuan(
	tenLopHocPhan: string,
	payload: {
		lichHocTuanList: ThoiKhoaBieu.ILichHocTuan[];
	},
) {
	return axios.put(`${ip3}/thoi-khoa-bieu/lop-hoc-phan/${tenLopHocPhan}/lich-hoc-tuan`, payload);
}

export async function putPhanCongGiangDay(payload: { updateList: ThoiKhoaBieu.TUpdatePhanCongGiangDay[] }) {
	return axios.put(`${ip3}/thoi-khoa-bieu/phan-cong-giang-day`, payload);
}

export async function putGiamSatGiangDay(thoiKhoaBieuId: string, payload: ThoiKhoaBieu.TUpdateGiamSat) {
	return axios.put(`${ip3}/thoi-khoa-bieu/${thoiKhoaBieuId}/chuyen-vien/giam-sat`, payload);
}

export async function exportThoiKhoaBieu(maHocKy: string, mode: 'KhoaSinhVien' | 'LopHanhChinh') {
	return axios.get(`${ip3}/thoi-khoa-bieu/hoc-ky/${maHocKy}/export?mode=${mode}`, {
		responseType: 'arraybuffer',
	});
}
