import { ip3 } from '@/utils/ip';
import axios from '@/utils/axios';

export async function khoiTaoCanhBaoSinhVien(type: 'canh-bao-ket-qua-hoc-tap' | 'thoi-hoc', hocKyId: string) {
	return axios.post(`${ip3}/${type}/hoc-ky/${hocKyId}/khoi-tao`);
}

export async function tinhLaiCanhBaoSinhVien(type: 'canh-bao-ket-qua-hoc-tap' | 'thoi-hoc', canhBaoId: string) {
	return axios.put(`${ip3}/${type}/${canhBaoId}/tinh-lai`);
}

export async function duyetAllCanhBao(type: 'canh-bao-ket-qua-hoc-tap' | 'thoi-hoc', maHocKy: string, payload: any) {
	return axios.put(`${ip3}/${type}/hoc-ky/${maHocKy}/duyet-all`, payload);
}

export async function chotDanhSachCanhBao(type: 'canh-bao-ket-qua-hoc-tap' | 'thoi-hoc', maHocKy: string) {
	return axios.put(`${ip3}/${type}/hoc-ky/${maHocKy}/chot`);
}

export async function thongkeSinhVienCanhBao(type: 'canh-bao-ket-qua-hoc-tap' | 'thoi-hoc', maHocKy: string) {
	return axios.get(`${ip3}/${type}/hoc-ky/${maHocKy}/thong-ke`);
}

export async function guiThongBaoHocVu(type: 'canh-bao-ket-qua-hoc-tap' | 'thoi-hoc', maHocKy: string) {
	return axios.post(`${ip3}/${type}/hoc-ky/${maHocKy}/gui-thong-bao`);
}
