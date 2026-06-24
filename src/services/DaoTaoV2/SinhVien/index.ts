import axios from '@/utils/axios';
import { ipDaoTao } from '@/utils/ip';

export const getThongKeDanTocSinhVien = (maHocKy: string) => {
	return axios.get(`${ipDaoTao}/sinh-vien/thong-ke/dan-toc/hoc-ky/${maHocKy}`);
};
export const getThongKeHoKhauSinhVien = (maHocKy: string) => {
	return axios.get(`${ipDaoTao}/sinh-vien/thong-ke/ho-khau/hoc-ky/${maHocKy}`);
};
export const getThongKeCoVanHocTap = (maHocKy: string) => {
	return axios.get(`${ipDaoTao}/lop-hanh-chinh/tong-hop/co-van/hoc-ky/${maHocKy}`);
};
export const getThongKeTonGiaoSinhVien = (maHocKy: string) => {
	return axios.get(`${ipDaoTao}/sinh-vien/thong-ke/ton-giao/hoc-ky/${maHocKy}`);
};
export const getThongKeNganhSinhVien = (maHocKy: string) => {
	return axios.get(`${ipDaoTao}/sinh-vien/thong-ke/nganh/hoc-ky/${maHocKy}`);
};

export async function getHocTapHienTai(sinhVienSsoId: string) {
	return axios.get(`${ipDaoTao}/sinh-vien/${sinhVienSsoId}/thong-tin-hoc-tap-hien-tai`);
}

export async function exportLyLich(sinhVienSsoId: string) {
	return axios.get(`${ipDaoTao}/sinh-vien/${sinhVienSsoId}/export-ly-lich`, {
		responseType: 'arraybuffer',
	});
}

export async function getTienTrinhSinhVien(sinhVienSsoId: string) {
	return axios.get(`${ipDaoTao}/chung-chi-sv/chung-chi-chuan-dau-ra/tien-trinh/${sinhVienSsoId}`);
}

export async function getTrangThaiNoNghiaVu(dotXetTotNghiepId: string, sinhVienSsoId: string) {
	return axios.get(`${ipDaoTao}/chuan-tot-nghiep/sinh-vien/${sinhVienSsoId}/dot/${dotXetTotNghiepId}`);
}

export async function getThongKeTrangThaiSv() {
	return axios.get(`${ipDaoTao}/sinh-vien/thong-ke/trang-thai`);
}

export async function getKhoaNganhSinhVien(sinhVienSsoId: string) {
	return axios.get(`${ipDaoTao}/sinh-vien/chuyen-vien/sinh-vien/${sinhVienSsoId}/khoa-nganh`);
}

export async function exportKQHTHocKy(ssoId: string, params?: { condition?: any }) {
	return axios.get(`${ipDaoTao}/diem-hp-sv-hk/chuyen-vien/sinh-vien/${ssoId}/kqht-hoc-ky/export`, {
		responseType: 'arraybuffer',
		params,
	});
}

export async function exportPhuLucVanBang(ssoId: string, params?: { condition?: any }) {
	return axios.get(`${ipDaoTao}/diem-hoc-phan/chuyen-vien/sinh-vien/${ssoId}/phu-luc-van-bang/export`, {
		responseType: 'arraybuffer',
		params,
	});
}

export async function exportKetQuaHocTap(ssoId: string, params?: { condition?: any }) {
	return axios.get(`${ipDaoTao}/diem-hoc-phan/chuyen-vien/sinh-vien/${ssoId}/ket-qua-hoc-tap/export`, {
		responseType: 'arraybuffer',
		params,
	});
}

export async function handleLockHoSo(hoSoId: string) {
	return axios.put(`${ipDaoTao}/sinh-vien/khoa/${hoSoId}`);
}

export async function handleUnLockHoSo(hoSoId: string) {
	return axios.put(`${ipDaoTao}/sinh-vien/mo-khoa/${hoSoId}`);
}

export const uploadAnhTheSinhVien = (payload: { file: string | Blob }) => {
	const form = new FormData();
	form.append('file', payload?.file);
	return axios.put(`${ipDaoTao}/sinh-vien/pfp/zip`, form);
};

export async function exportSoLuongSinhVienLhc(params?: any) {
	return axios.get(`${ipDaoTao}/sinh-vien/thong-ke/so-luong-sinh-vien-lhc/export`, {
		responseType: 'arraybuffer',
		params,
	});
}

export async function exportTheSinhVien(
	body?: { listSsoIds?: string[] },
	params?: { condition?: any; filters?: any[] },
) {
	return axios.post(`${ipDaoTao}/sinh-vien/mau-the-sinh-vien/export`, body || {}, {
		responseType: 'arraybuffer',
		params,
	});
}
