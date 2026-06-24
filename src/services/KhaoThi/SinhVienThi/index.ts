import axios from '@/utils/axios';
import { ipKhaoThi } from '@/utils/ip';

export async function getDiemThiHocKySinhVien(ssoId: string, maHocKy: string, maHocPhan: string) {
	return axios.get(`${ipKhaoThi}/sinh-vien-thi/diem-thi/sv/${ssoId}/hoc-ky/${maHocKy}/hoc-phan/${maHocPhan}`);
}
