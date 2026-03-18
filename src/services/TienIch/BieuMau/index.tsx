import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import type { BieuMau } from './typings';

export async function traLoiBieuMau(payload: {
	idKhaoSat: string;
	danhSachTraLoi: Partial<BieuMau.TraLoiRecord[]>;
	idDot: string;
}) {
	return axios.post(`${ip3}/cau-tra-loi-khao-sat/public`, payload);
}

export async function getBieuMauPublic(idDot: string) {
	return axios.get(`${ip3}/cau-tra-loi-khao-sat/public/dot/${idDot}`);
}
