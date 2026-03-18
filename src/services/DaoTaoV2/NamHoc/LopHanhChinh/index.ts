import { ip3 } from '@/utils/ip';
import axios from '@/utils/axios';

export async function postManySinhVienLopHanhChinh(payload: { lopHanhChinhId: string; sinhVienSsoIds: string[] }) {
	return axios.post(`${ip3}/lop-hc-sv/many`, payload);
}

// export async function tatKichHoatNguonThu(id: string) {
//   return axios.put(`${ip3}/nguon-thu/${id}/inactivate`);
// }
