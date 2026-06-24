import axios from '@/utils/axios';
import { ipDaoTao } from '@/utils/ip';

export const exportSinhVienXetHocBong = (maHocKy: string) => {
	return axios.post(`${ipDaoTao}/kqht-hoc-ky/thong-ke/sinh-vien-kqht-hoc-bong/export/${maHocKy}`, undefined, {
		responseType: 'arraybuffer',
	});
};

export const tinhDiemSinhVien = (ssoId: string) => {
	return axios.post(`${ipDaoTao}/calculate-diem/sinh-vien/${ssoId}`);
};
