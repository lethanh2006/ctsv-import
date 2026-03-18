import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import { type ESuKienType } from './constant';
import { type SuKienV2 } from './typings';

const url = 'su-kien/user';

export async function getSuKienTrongKhoang(payload: { fromDate: string; toDate: string; loaiSuKien: ESuKienType }) {
	return axios.get(`${ip3}/${url}/from/${payload.fromDate}/to/${payload.toDate}`, {
		params: { types: [payload.loaiSuKien] },
	});
}
export async function getQRDangKy(idSuKien: string) {
	return axios.get(`${ip3}/su-kien/${idSuKien}/qr-dang-ky`);
}
export async function getQRThamGia(idSuKien: string) {
	return axios.get(`${ip3}/su-kien/${idSuKien}/qr-tham-gia`);
}

export async function getThongKeSuKien(
	payload: { nam: any; loaiSuKien?: ESuKienType } | { idSuKien: string; loaiSuKien?: ESuKienType },
) {
	interface ResponseSuccess {
		data: SuKienV2.ThongKeTheoNam | SuKienV2.ThongKeTheoSuKien;
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
			diaDiem: string;
		};
	}
	return axios.get<ResponseSuccess>(`${ip3}/su-kien/public/${id}/thong-tin-su-kien`);
}

export async function getThongKeSinhVien(idSuKien: string) {
	return axios.get(`${ip3}/su-kien/thong-ke/${idSuKien}`);
}

export async function exportDanhSachSinhVien(condition?: any) {
	return axios.get(`${ip3}/su-kien/export-danh-sach`, {
		responseType: 'arraybuffer',
		params: { condition: { ...condition } },
	});
}

export async function xemKhaoSat(idSuKien: string, loai?: string, ssoId?: string) {
	return axios.get(`${ip3}/cau-tra-loi-khao-sat/khao-sat/${idSuKien}/${loai}/${ssoId}`);
}

export async function thongKeKhaoSat(idKhaoSat: string, idSuKien: string, loai?: string) {
	return axios.get(`${ip3}/khao-sat/${idKhaoSat}/thong-ke`, {
		params: {
			idSuKien: idSuKien,
			loai: loai,
		},
	});
}
