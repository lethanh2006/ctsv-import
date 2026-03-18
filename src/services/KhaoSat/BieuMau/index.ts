import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function kichHoatBieuMau(payload: { id: string; data: { kichHoat: boolean } }) {
  return axios.post(`${ip3}/khao-sat/${payload.id}/kich-hoat`, payload.data);
}
