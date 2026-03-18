import { ip3 } from '@/utils/ip';
import axios from '@/utils/axios';

export const thongKe = async (payload: { condition?: any; filters?: any[] }) =>
	axios.get(`${ip3}/hoat-dong-ctsv/thong-ke/so-luong`, { params: payload });

export const thongKeChung = async (payload: { condition?: any; filters?: any[] }) =>
	axios.get(`${ip3}/hoat-dong-ctsv/thong-ke/chung`, { params: payload });

export const thongKeChungV2 = async (payload: { condition?: any; filters?: any[] }) =>
	axios.get(`${ip3}/hoat-dong-ctsv/thong-ke/chung/v2`, { params: payload });

export const importDanhSachSinhVien = async (idSuKien: string, file: any) => {
	const form = new FormData();
	form.append('file', file);
	return axios.post(`${ip3}/sv-hd-ctsv/import/sv/hoat-dong-ctsv/${idSuKien}`, form);
};
export const importDanhSachSinhVienThamGia = async (idSuKien: string, trangThai: string, file: any) => {
	const form = new FormData();
	form.append('file', file);
	return axios.put(`${ip3}/sv-hd-ctsv/import/sv/hoat-dong-ctsv/${idSuKien}/trang-thai/${trangThai}`, form);
};

export const thongKeSinhVienHoatDong = (payload: { condition?: any; filters?: any }) =>
	axios.get(`${ip3}/sv-hd-ctsv/thong-ke/hoat-dong`, { params: payload });
export const thongKeSinhVienHoatDongCap2 = (payload: { condition?: any; filters?: any }) =>
	axios.get(`${ip3}/sv-hd-ctsv/thong-ke/hoat-dong/cap-2`, { params: payload });
export const thongKeSinhVienHoatDongChiTiet = (payload: { condition?: any; filters?: any }) =>
	axios.get(`${ip3}/sv-hd-ctsv/thong-ke/hoat-dong/chi-tiet`, { params: payload });
