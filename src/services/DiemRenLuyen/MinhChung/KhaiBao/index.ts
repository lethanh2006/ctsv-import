import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import { buildFormData } from '@/utils/utils';

export const getTemplateImportMinhChung = (idCauHinh: string) =>
	axios.get(`${ip3}/khai-bao-minh-chung/import-template/cau-hinh/${idCauHinh}`, { responseType: 'arraybuffer' });

export const importMinhChung = (idDot: string, idCauHinh: string, payload: { file: any }) => {
	const formData = buildFormData(payload);
	return axios.post(`${ip3}/khai-bao-minh-chung/import/insert/dot/${idDot}/cau-hinh/${idCauHinh}`, formData);
};
