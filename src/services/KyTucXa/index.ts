import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function duyetSinhVienKTX(idDot: string, payLoad: any) {
	return axios.put(`${ip3}/sinh-vien-dang-ky-ktx/dot-dang-ky/${idDot}/trang-thai`, payLoad);
}

export async function chotDotDangKyKTX(idDot: string) {
	return axios.post(`${ip3}/dot-dang-ky-ktx/${idDot}/khoi-tao/bill`);
}

export async function exportCanKetSinhVien(idSinhVienKTX: string) {
	return axios.get(`${ip3}/sinh-vien-dang-ky-ktx/${idSinhVienKTX}/don-cam-ket`, {
		responseType: 'arraybuffer',
	});
}

export async function closeBillSinhVienKtx(idSinhVienKTX: string) {
	return axios.post(`${ip3}/sinh-vien-dang-ky-ktx/${idSinhVienKTX}/bill/close`);
}
