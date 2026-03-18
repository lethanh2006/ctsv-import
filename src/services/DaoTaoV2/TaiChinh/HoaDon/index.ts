import axios from '@/utils/axios';
import { ipTaiChinh } from '@/utils/ip';

export async function getThongKeCongNoSinhVien(sinhVienSsoId: string) {
	return axios.get(`${ipTaiChinh}/bill-item/thong-ke/user/${sinhVienSsoId}`);
}
