import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function kichHoatDotKhaoSat(payload: { id: string; data: { kichHoat: boolean } }) {
	return axios.post(`${ip3}/dot-khao-sat/${payload.id}/kich-hoat`, payload.data);
}

export async function getDotKhaoSatThongKe(payload: { id: string }) {
	return axios.get(`${ip3}/dot-khao-sat/${payload.id}/thong-ke`);
}
export async function dotKhaoSatThongKeTongHop(isDonVi?: boolean) {
	return axios.get(isDonVi ? `${ip3}/dot-khao-sat/don-vi/thong-ke` : `${ip3}/dot-khao-sat/thong-ke`);
}
export async function danhSachChiTietDotKhaoSat(id: string, condition?: any) {
	return axios.get(`${ip3}/dot-khao-sat/${id}/tong-hop/page`, { params: { condition: condition } });
}
export async function danhSachChiTietDotKhaoSatChiTiet(id: string, condition?: any) {
	return axios.get(`${ip3}/dot-khao-sat/${id}/chua-thuc-hien`, { params: { condition: condition } });
}
export async function exportKetQuaKhaoSat(payload: { idKhaoSat: string }) {
	return axios.get(`${ip3}/dot-khao-sat/${payload.idKhaoSat}/tong-hop`, {
		responseType: 'arraybuffer',
	});
}

export async function exportKetQuaKhaoSatSuKien(payload: { idKhaoSat: string; idSuKien: string }) {
	return axios.get(`${ip3}/dot-khao-sat/${payload.idSuKien}/tong-hop/${payload.idKhaoSat}`, {
		responseType: 'arraybuffer',
	});
}
export async function exportBieuMauKhaoSat(id: string) {
	return axios.get(`${ip3}/khao-sat/${id}/export`, {
		responseType: 'arraybuffer',
	});
}
export async function ketThucKhaoSat(id: string) {
	return axios.put(`${ip3}/dot-khao-sat/${id}/ket-thuc`);
}
export async function thongKeDanhGiaGiangVien(idDot: string) {
	return axios.get(`${ip3}/danh-gia-giang-vien/dot/${idDot}/thong-ke`);
}
export async function guiThongBaoThucHienKhaoSat(idDot: string) {
	return axios.post(`${ip3}/dot-khao-sat/${idDot}/send-notif`);
}
