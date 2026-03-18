import axios from '@/utils/axios';
import { ip3, ipDaoTao } from '@/utils/ip';

export async function getDanhSachChuaKhaiBao(idDot: string) {
	return axios.get(`${ipDaoTao}/dot-cap-nhat-ho-so/chua-dang-ky/many/${idDot}`);
}
export async function getDanhSachChuaKhaiBaoPage(
	idDot: string,
	page: number,
	limit: number,
	condition?: any,
	filter?: any,
) {
	return axios.get(`${ipDaoTao}/dot-cap-nhat-ho-so/chua-dang-ky/page/${idDot}`, {
		params: { page: page, limit: limit, condition: { ...condition }, filters: filter },
	});
}
export async function getDanhSachDaKhaiBao(idDot: string) {
	return axios.get(`${ipDaoTao}/dot-cap-nhat-ho-so/da-dang-ky/many/${idDot}`);
}
export async function getDanhSachDaKhaiBaoPage(
	idDot: string,
	page: number,
	limit: number,
	condition?: any,
	filter?: any,
) {
	return axios.get(`${ipDaoTao}/dot-cap-nhat-ho-so/da-dang-ky/page/${idDot}`, {
		params: { page: page, limit: limit, condition: { ...condition }, filters: filter },
	});
}

export const exportDanhSachKhaiBao = (
	mode: 'chua-dang-ky' | 'da-dang-ky',
	idDot: string,
	condition?: any,
	filters?: any[],
) => {
	return axios.get(`${ipDaoTao}/dot-cap-nhat-ho-so/${mode}/export/${idDot}`, {
		params: {
			condition,
			filters,
		},
		responseType: 'arraybuffer',
	});
};
