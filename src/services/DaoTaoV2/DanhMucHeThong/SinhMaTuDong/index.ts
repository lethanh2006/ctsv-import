import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import type { ENguonSinhMa } from './constant';

export async function getSinhMa(payload: { data: Record<string, any>; nguon: ENguonSinhMa }) {
	return axios.post(`${ip3}/quy-tac-ma/sinh-ma`, { ...payload, silent: true });
}
