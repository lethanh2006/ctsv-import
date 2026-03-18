import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function getAllLoaiChuDe() {
  return axios.get(`${ip3}/common-topic/type/all`);
}
