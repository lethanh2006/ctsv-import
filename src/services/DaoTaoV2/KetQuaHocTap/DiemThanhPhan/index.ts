import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function getImportDiemLopHpTemplate(lopHocPhanId: string) {
	return axios.get(`${ip3}/lop-hp-sv/diem-thanh-phan/import-template/lop-hoc-phan/${lopHocPhanId}`, {
		responseType: 'arraybuffer',
	});
}
