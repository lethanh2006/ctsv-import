import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import { type HocKy } from './typing';

export async function duyetDeCuongHocKy(maHocKy: string) {
	return axios.put(`${ip3}/de-cuong-hp-hk/hoc-ky/${maHocKy}`);
}

export async function duyetDeCuongHocPhan(maHocKy: string, list: string[]) {
	return axios.put(`${ip3}/de-cuong-hp-hk/hoc-ky/${maHocKy}/hoc-phan`, { list });
}

export async function getDeCuongHPHKDaDuyet(maHocKy: string) {
	return axios.get(`${ip3}/de-cuong-hp-hk/hoc-phan/hoc-ky/${maHocKy}/da-duyet`);
}

export async function duyetDeCuongTuLopHocPhan(maHocKy: string) {
	return axios.put(`${ip3}/de-cuong-hp-hk/hoc-ky/${maHocKy}/lop-hp`);
}

// Validate trước khi POST
export async function postHocKyValidate(hocKy: HocKy.IRecord) {
	return axios.post(`${ip3}/hoc-ky/validate`, hocKy);
}

export async function putHocKyValidate(hocKy: HocKy.IRecord) {
	return axios.put(`${ip3}/hoc-ky/${hocKy._id}/validate`, hocKy);
}

export async function deleteHocKyValidate(hocKyId: string) {
	return axios.delete(`${ip3}/hoc-ky/${hocKyId}/validate`);
}

export async function guiThongBaoPhanCongGiangDay(maHocKy: string, payLoad: any) {
	return axios.put(`${ip3}/hoc-ky/${maHocKy}/phan-cong-giang-day`, payLoad);
}
