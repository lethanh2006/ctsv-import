import { ip3 } from '@/utils/ip';
import axios from '@/utils/axios';

export async function duyetQuyetDinh(type: 'quyet-dinh-thoi-hoc' | 'quyet-dinh-bao-luu', payLoad: any) {
	return axios.put(`${ip3}/${type}/duyet`, payLoad);
}

export async function khongDuyetQuyetDinh(
	type: 'quyet-dinh-thoi-hoc' | 'quyet-dinh-bao-luu',
	id: string,
	payLoad: any,
) {
	return axios.put(`${ip3}/${type}/${id}/khong-duyet`, payLoad);
}

export async function postManySinhVienQuyetDinh(type: 'quyet-dinh-thoi-hoc' | 'quyet-dinh-bao-luu', payLoad: any) {
	return axios.post(`${ip3}/${type}/quyet-dinh`, payLoad);
}

export async function thongKeSinhVienBaoLuu() {
	return axios.get(`${ip3}/quyet-dinh-bao-luu/thong-ke-trang-thai`);
}

export async function xuLySinhVienBaoLuu(idBaoLuu: string, type: 'ket-thuc' | 'buoc-thoi-hoc') {
	return axios.put(`${ip3}/quyet-dinh-bao-luu/${idBaoLuu}/${type}`);
}
