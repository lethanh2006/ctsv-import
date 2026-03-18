import { ip3 } from '@/utils/ip';
import axios from '@/utils/axios';

export async function getTheoLinhVuc(params: { page: number; limit: number; sort: any }) {
  return axios.get(`${ip3}/dm-nhom-nganh/group/dm-linh-vuc`, { params });
}

// export async function kichHoatNguonThu(id: string) {
//   return axios.put(`${ip3}/nguon-thu/${id}/activate`);
// }

// export async function tatKichHoatNguonThu(id: string) {
//   return axios.put(`${ip3}/nguon-thu/${id}/inactivate`);
// }
