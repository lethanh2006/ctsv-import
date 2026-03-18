import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import type { ChuongTrinhDaoTao } from './typings';

export async function postCloneKhoiHpCt(khoiHpCtOld: string, payload: ChuongTrinhDaoTao.IKhoiHocPhanCTDT) {
	return axios.post(`${ip3}/khoi-hp-ct/${khoiHpCtOld}/clone`, payload);
}

export async function postChungChiCTDTMany(payload: ChuongTrinhDaoTao.IChungChiCTDT) {
	return axios.post(`${ip3}/chung-chi-ctdt/many`, payload);
}

export async function postCongBoCTDT(
	chuongTrinhDaoTaoId: string,
	type: 'cong-bo' | 'bo-cong-bo' | 'cho-cong-bo' | 'bo-cho-cong-bo',
) {
	return axios.post(`${ip3}/chuong-trinh-dao-tao/${chuongTrinhDaoTaoId}/${type}`);
}

export async function postDotRaSoatChuongTrinh(dotRaSoatId: string, listMaCtdt: string[]) {
	return axios.post(`${ip3}/ra-soat-ctdt/dot/${dotRaSoatId}/ra-soat/add`, { listMaCtdt });
}

export async function postDuyetChuongTrinh(idChuongTrinh: string) {
	return axios.post(`${ip3}/ra-soat-ctdt/dot/chuong-trinh/${idChuongTrinh}/duyet`);
}

export async function getSoSanhChuongTrinhRaSoat(maChuongTrinh: string) {
	return axios.get(`${ip3}/ra-soat-ctdt/thao-tac/so-sanh/chuong-trinh/${maChuongTrinh}`);
}
