import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function getQuyTrinhUser(loaiQuyTrinh: string, payload: { page: number; limit: number; condition: any }) {
	return axios.get(`${ip3}/quy-trinh-dong/chuyen-vien/page/${loaiQuyTrinh}`, {
		params: { ...payload },
	});
}
export async function getQuyTrinhChuyenVien(loaiXuLyDon: string, currentRoles: string) {
	return axios.get(`${ip3}/quy-trinh-dong/chuyen-vien/many/${loaiXuLyDon}`, {
		params: {
			condition: { phanHe: currentRoles },
		},
	});
}

export const getAllQuyTrinhChiuTrachNhiem = (payload?: { condition?: any; filters?: string[] }) => {
	return axios.get(`${ip3}/quy-trinh-dong/chiu-trach-nhiem/many`, { params: payload });
};
export async function getQuyTrinhLinhVuc() {
	return axios.get(`${ip3}/quy-trinh-dong/linh-vuc`);
}

export async function checkRuleXuLyDon(dataBoPhanXuLy: any) {
  return axios.post(`${ip3}/don-quy-trinh-dong/user/validate/access/bo-phan-xu-ly`, { ...dataBoPhanXuLy });
}


export const activeQuyTrinhDong = (idQuyTrinh: string) => {
	return axios.put(`${ip3}/quy-trinh-dong/${idQuyTrinh}/switch-active`);
};

export const getDanhSachCanBoXuLy = () => axios.get(`${ip3}/quy-trinh-dong/phan-cong-xu-ly/many`);
