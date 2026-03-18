import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function getByKey(key: string) {
	return axios.get(`${ip3}/setting/one`, { params: { condition: { key: key } } });
}
export async function update(id: string, payload: { key: string; value: any }) {
	return axios.put(`${ip3}/setting/${id}`, payload);
}
export async function createSetting(payload: { key: string; value: any }) {
	return axios.post(`${ip3}/setting`, payload);
}
