import { type HocKy } from '@/services/HocKy/HocKy/typing';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import type { NamHoc } from './typings';

// export async function getNguonThu(payload: { page: number; limit: number }) {
//   return axios.get(`${ip3}/nguon-thu/page?page=${payload.page}&limit=${payload.limit}`);
// }

export async function postNamHocFull(payload: { namHocDto: NamHoc.IRecord; hocKyDtoList: HocKy.IRecord[] }) {
	return axios.post(`${ip3}/nam-hoc/full`, payload);
}

// export async function tatKichHoatNguonThu(id: string) {
//   return axios.put(`${ip3}/nguon-thu/${id}/inactivate`);
// }

export async function chotKeHoachNamHoc(namHocId: string, payLoad: any) {
	return axios.put(`${ip3}/nam-hoc/${namHocId}/chot`, payLoad);
}
