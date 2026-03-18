import { ip3 } from '@/utils/ip';
import axios from '@/utils/axios';

export async function kichHoatTrangThai(dotKhaiBaoId: string, type: 'kich-hoat ' | 'bo-kich-hoat') {
	return axios.put(`${ip3}/dot-khai-bao-noi-tru-ngoai-tru/${dotKhaiBaoId}/${type}`);
}

export async function thongKeNoiNgoaiTru(dotKhaiBaoId: string) {
	return axios.get(`${ip3}/khai-bao-noi-tru-ngoai-tru/dot-khai-bao/${dotKhaiBaoId}/thong-ke`);
}

export async function getNoiNgoaiTruSinhVien(ssoId: string) {
	return axios.put(`${ip3}/dot-khai-bao-noi-tru-ngoai-tru/sinh-vien/${ssoId}`);
}
