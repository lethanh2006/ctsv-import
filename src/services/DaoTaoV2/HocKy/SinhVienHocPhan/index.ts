import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import type { SinhVienHpHk } from './typing';

export async function khoiTaoNhuCauHocPhan(payload: Pick<SinhVienHpHk.IRecord, 'maHocKy'>) {
	return axios.post(`${ip3}/sv-hp-hk/ra-soat/khoi-tao`, payload);
}
