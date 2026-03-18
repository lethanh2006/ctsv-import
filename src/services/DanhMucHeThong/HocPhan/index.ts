import { ip3 } from '@/utils/ip';
import axios from '@/utils/axios';

// export async function getNguonThu(payload: { page: number; limit: number }) {
//   return axios.get(`${ip3}/nguon-thu/page?page=${payload.page}&limit=${payload.limit}`);
// }

// export async function kichHoatNguonThu(id: string) {
//   return axios.put(`${ip3}/nguon-thu/${id}/activate`);
// }

export async function activeHocPhan(id: string) {
  return axios.put(`${ip3}/hoc-phan/${id}/active`);
}

export async function activeDeCuongHp(id: string) {
  return axios.put(`${ip3}/de-cuong-hp/${id}/active`);
}
