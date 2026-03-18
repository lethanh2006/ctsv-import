import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import { type ESuKienType } from './constant';
import { type SuKien } from './typings';

const url = 'su-kien/user';

export async function getSuKienTrongKhoang(payload: { fromDate: string; toDate: string; loaiSuKien: ESuKienType }) {
	return axios.get(`${ip3}/${url}/from/${payload.fromDate}/to/${payload.toDate}`, {
		params: { types: [payload.loaiSuKien] },
	});
}

export async function getThongKeSuKien(
	payload: { nam: string; loaiSuKien: ESuKienType } | { idSuKien: string; loaiSuKien: ESuKienType },
) {
	interface ResponseSuccess {
		data: SuKien.ThongKeTheoNam | SuKien.ThongKeTheoSuKien;
		success: true;
	}
	return axios.get<ResponseSuccess>(`${ip3}/su-kien/thong-ke`, { params: payload });
}

export async function getThongTinSuKien(id: string) {
	interface ResponseSuccess {
		data: {
			_id: string;
			tenSuKien: string;
			maSuKien: string;
		};
	}
	return axios.get<ResponseSuccess>(`${ip3}/su-kien/public/${id}/thong-tin-su-kien`);
}
