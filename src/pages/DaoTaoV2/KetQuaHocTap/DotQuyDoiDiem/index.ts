import { ipDaoTao } from '@/utils/ip';
import axios from '@/utils/axios';

export async function postSinhVienQuyDoi(idDotQuyDoi: string, payload: any) {
	return axios.post(`${ipDaoTao}/quy-doi-diem-sinh-vien/dot/${idDotQuyDoi}`, payload);
}

export async function raQuyetDinhQuyDoiDiem(idDotQuyDoi: string, payload: any) {
	return axios.put(`${ipDaoTao}/quy-doi-diem-sinh-vien/dot/${idDotQuyDoi}/ra-quyet-dinh`, payload);
}

export async function khongCongNhanQuyDoi(idQuyDoi: string) {
	return axios.put(`${ipDaoTao}/quy-doi-diem-sinh-vien/${idQuyDoi}/khong-cong-nhan`);
}

export async function congNhanKetQuaQuyDoi(idQuyDoi: string, payload: any) {
	return axios.put(`${ipDaoTao}/quy-doi-diem-sinh-vien/${idQuyDoi}/cong-nhan-ket-qua`, payload);
}

export async function thongKeSinhVienQuyDoiDiem(idQuyDoi: string) {
	return axios.get(`${ipDaoTao}/quy-doi-diem-sinh-vien/thong-ke-trang-thai/dot/${idQuyDoi}`);
}

export async function selectTruongHocDebounce(params: { condition?: any; key?: any; filter?: any[] }) {
	return axios.get(`${ipDaoTao}/quy-doi-diem-sinh-vien/distinct/minh-chung-cong-nhan`, { params });
}

export async function xinYKienHoiDong(idQuyDoi: string) {
	return axios.put(`${ipDaoTao}/quy-doi-diem-sinh-vien/${idQuyDoi}/xin-y-kien-hoi-dong`);
}
