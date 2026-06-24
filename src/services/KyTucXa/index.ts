import axios from '@/utils/axios';
import { ipCsvc } from '@/utils/ip';

export async function thongKePhongKTX(condition?: any) {
	return axios.get(`${ipCsvc}/thong-ke-ktx/phong`, { params: { condition: condition } });
}
