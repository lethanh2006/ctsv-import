import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import type { ELoaiTinhTrangDon } from '@/services/QuyTrinhDong/constant';

const url = 'don-quy-trinh-dong';

export const getDonByUserId = (
	userId: string,
	payload?: {
		condition?: any;
	},
) => axios.get(`${ip3}/${url}/${userId}/user`, { params: payload });
export const getKhaiBaoUser = (payload?: { page: number; limit: number; condition?: any }) =>
	axios.get(`${ip3}/${url}/user/page`, { params: payload });
export const userUpdateBuoc = (
	donQuyTrinhId: string,
	maBuoc: string,
	payload: {
		thongTinKhaiBao?: any;
		maBoPhanXuLy?: any;
	},
) =>
	axios.put(`${ip3}/${url}/user/update-buoc/don/${donQuyTrinhId}/buoc/${maBuoc}`, {
		...payload,
	});
export const createDonKhaiBaoUser = (quyTrinhId: string, dotQuyTrinhId: string) =>
	axios.post(`${ip3}/${url}/user/create/quy-trinh/${quyTrinhId}/dot-quy-trinh/${dotQuyTrinhId}`);
export async function getQuyTrinhChuyenVien(
	loaiXuLyDon: string,
	loaiTinhTrangDon: ELoaiTinhTrangDon,
	payload: { page: number; limit: number; condition: any },
) {
	const quyTrinhId = payload?.condition?.quyTrinhId;
	const maBuoc = payload?.condition?.maBuoc;
	const trangThaiTiepNhan = payload?.condition?.trangThaiTiepNhan;
	return axios.get(`${ip3}/${url}/chuyen-vien/page/loai-xu-ly-don/${loaiXuLyDon}/${loaiTinhTrangDon}`, {
		params: {
			...payload,
			quyTrinhId: quyTrinhId,
			maBuoc: maBuoc,
			trangThaiTiepNhan: trangThaiTiepNhan,
		},
	});
}
export async function chuyenVienTiepNhanDuyet(id: string, payload: any) {
	return axios.put(`${ip3}/${url}/chuyen-vien/tiep-nhan/don/${id}`, {
		...payload,
	});
}
export async function chuyenVienDieuPhoiDon(id: string, payload: any) {
	return axios.put(`${ip3}/${url}/chuyen-vien/dieu-phoi/don/${id}`, {
		...payload,
	});
}
export async function chuyenVienTiepNhanImport(payload: any) {
	return axios.put(`${ip3}/${url}/chuyen-vien/tiep-nhan/import`, {
		...payload,
	});
}

export const exportMauDonTheoBuoc = (id: string, maBuoc: string) => {
	return axios.get(`${ip3}/${url}/${id}/export/khai-bao/${maBuoc}`, { responseType: 'arraybuffer' });
};

export const exportMauTraKetQuaTheoBuoc = (id: string, maBuoc: string) => {
	return axios.get(`${ip3}/${url}/${id}/export/tiep-nhan/${maBuoc}`, { responseType: 'arraybuffer' });
};

export const traKetQua = (idDon: string) => axios.put(`${ip3}/${url}/${idDon}/tra-ket-qua`);
