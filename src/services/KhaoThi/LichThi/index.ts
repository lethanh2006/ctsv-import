import axios from '@/utils/axios';
import { ipKhaoThi } from '@/utils/ip';

export const initLichThi = (
	idKyThi: string,
	payload: {
		maHocPhanList: string[];
		sinhLaiPhach?: string;
	},
) => axios.put(`${ipKhaoThi}/lich-thi/ma-phach/init/ky-thi-v2/${idKyThi}`, undefined, { params: payload });
