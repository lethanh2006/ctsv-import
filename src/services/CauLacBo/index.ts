import axios from '@/utils/axios';
import type { ETrangThaiHoatDong } from './constant';
import { ip3 } from '@/utils/ip';

export const updateTrangThaiHoatDongCLB = (
	idHoatDong: string,
	payload: {
		ghiChu: string;
		minhChung: string;
		trangThai: ETrangThaiHoatDong;
	},
) => axios.put(`${ip3}/ke-hoach-hoat-dong-clb/${idHoatDong}/trang-thai`, payload);

export const thongKeChung = () => {
	return axios.get(`${ip3}/cau-lac-bo/thong-ke-chung`);
};

export const thongKeTongHop = (maHocKy: string) => axios.get(`${ip3}/cau-lac-bo/thong-ke/tong-hop/hoc-ky/${maHocKy}`);
