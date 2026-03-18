import { ip3 } from '@/utils/ip';
import axios from '@/utils/axios';

export async function postSinhVienQuyDoi(idDotQuyDoi: string, payload: any) {
	return axios.post(`${ip3}/quy-doi-diem-sinh-vien/dot/${idDotQuyDoi}`, payload);
}

export async function raQuyetDinhQuyDoiDiem(idDotQuyDoi: string, payload: any) {
	return axios.put(`${ip3}/quy-doi-diem-sinh-vien/dot/${idDotQuyDoi}/ra-quyet-dinh`, payload);
}

export async function khongCongNhanQuyDoi(idQuyDoi: string, payload: any) {
	return axios.put(`${ip3}/quy-doi-diem-sinh-vien/${idQuyDoi}/khong-cong-nhan`, payload);
}

export async function congNhanKetQuaQuyDoi(idQuyDoi: string, payload: any) {
	return axios.put(`${ip3}/quy-doi-diem-sinh-vien/${idQuyDoi}/cong-nhan-ket-qua`, payload);
}

export async function thongKeSinhVienQuyDoiDiem(idQuyDoi: string) {
	return axios.get(`${ip3}/quy-doi-diem-sinh-vien/thong-ke-trang-thai/dot/${idQuyDoi}`);
}
