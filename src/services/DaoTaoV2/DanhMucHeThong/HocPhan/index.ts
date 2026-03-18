import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function activeHocPhan(id: string) {
	return axios.put(`${ip3}/hoc-phan/${id}/active`);
}

export async function activeDeCuongHp(id: string) {
	return axios.put(`${ip3}/de-cuong-hp/${id}/active`);
}

export async function getThongKeNhuCau(maHocKy: string) {
	return axios.get(`${ip3}/de-cuong-hp-hk/thong-ke/nhu-cau/hoc-ky/${maHocKy}`);
}

export async function getHocLieuThuVien(filter: {
	conditions: { FieldCode: string; Keyword: string }[];
	Page: string;
	Limit: string;
}) {
	return axios.post(`${ip3}/hoc-lieu-de-cuong/thu-vien/search`, { filter });
}
