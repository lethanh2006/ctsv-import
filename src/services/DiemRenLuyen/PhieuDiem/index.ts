import { ip3 } from '@/utils/ip';
import axios from '@/utils/axios';
import type { ETrangThaiChamDiem } from '../constants';

export const thongKePhieuDiem = (maHocKy: string) => axios.get(`${ip3}/drl/phieu-drl/thong-ke/hoc-ky/${maHocKy}`);

export const doiTrangThaiPhieuDiem = (
	idDot: string,
	trangThaiCu: ETrangThaiChamDiem,
	trangThaiMoi: ETrangThaiChamDiem,
) => axios.put(`${ip3}/drl/phieu-drl/dot-drl/${idDot}/trang-thai/from/${trangThaiCu}/to/${trangThaiMoi}`);
