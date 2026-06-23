import axios from '@/utils/axios';
import { ip3, ipDaoTao } from '@/utils/ip';
import type { ChuongTrinhDaoTao } from './typings';

export async function postCloneKhoiHpCt(khoiHpCtOld: string, payload: ChuongTrinhDaoTao.IKhoiHocPhanCTDT) {
	return axios.post(`${ip3}/khoi-hp-ct/${khoiHpCtOld}/clone`, payload);
}

export async function postChungChiCTDTMany(payload: ChuongTrinhDaoTao.IChungChiCTDT) {
	return axios.post(`${ip3}/chung-chi-ctdt/many`, payload);
}

export async function postCongBoCTDT(
	chuongTrinhDaoTaoId: string,
	type: 'cong-bo' | 'bo-cong-bo' | 'cho-cong-bo' | 'bo-cho-cong-bo',
) {
	return axios.post(`${ip3}/chuong-trinh-dao-tao/${chuongTrinhDaoTaoId}/${type}`);
}

export async function postDotRaSoatChuongTrinh(dotRaSoatId: string, listMaCtdt: string[]) {
	return axios.post(`${ip3}/ra-soat-ctdt/dot/${dotRaSoatId}/ra-soat/add`, { listMaCtdt });
}

export async function postDuyetChuongTrinh(idChuongTrinh: string) {
	return axios.post(`${ip3}/ra-soat-ctdt/dot/chuong-trinh/${idChuongTrinh}/duyet`);
}

export async function getSoSanhChuongTrinhRaSoat(maChuongTrinh: string) {
	return axios.get(`${ip3}/ra-soat-ctdt/thao-tac/so-sanh/chuong-trinh/${maChuongTrinh}`);
}

export async function thongKeDiemPLOSinhVien(maKhoaNganh: string, ssoId: string) {
	return axios.get(`${ipDaoTao}/diem-hp-sv-hk/thong-ke-diem-pi/khoa-nganh/${maKhoaNganh}/sinh-vien/${ssoId}`);
}

export async function getHocTapHienTaiKhoaNganh(ssoId: string, maKhoaNganh: string) {
	return axios.get(`${ipDaoTao}/chuong-trinh-dao-tao/nguoi-hoc/${ssoId}/khoa-nganh/${maKhoaNganh}/hien-tai`);
}

export async function getTienTrinhKhungSinhVien(
	sinhVienSsoId: string,
	maKhoaNganh: string,
	personal: boolean,
	isDaChonPathway?: boolean,
	isDaChonChuyenNganh?: boolean,
) {
	return axios.get(
		`${ipDaoTao}/chuong-trinh-dao-tao/tien-trinh-khung/sinh-vien/${sinhVienSsoId}/khoa-nganh/${maKhoaNganh}`,
		{ params: { personal, isDaChonPathway, isDaChonChuyenNganh } },
	);
}

export async function getSinhVienHocPhanHocKy(ssoId: string, maKhoaNganh: string, params: any) {
	return axios.get(`${ipDaoTao}/diem-hp-sv-hk/sinh-vien/${ssoId}/khoa-nganh/${maKhoaNganh}/all`, { params });
}

export async function toggleSkipDiemHpSvHk(id: string) {
	return axios.post(`${ipDaoTao}/diem-hp-sv-hk/${id}/skip/toggle`);
}
