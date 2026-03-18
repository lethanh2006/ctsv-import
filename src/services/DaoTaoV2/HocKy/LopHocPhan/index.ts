import axios from '@/utils/axios';
import { ip3, ipDaoTao } from '@/utils/ip';
import { type LopHocPhan } from './typing';

export async function initLopHocPhan(payload: { hocKyId: string; config: LopHocPhan.TInitConfig[] }) {
	return axios.post(`${ipDaoTao}/lop-hoc-phan/init/config`, payload);
}

export async function initLopHocPhanTheoNhuCau(maHocKy: string) {
	return axios.post(`${ipDaoTao}/lop-hoc-phan/init/ma-hoc-ky/${maHocKy}`);
}

export const getImportTemplateTheoHocKy = (hocKyId: string) => {
	return axios.get(`${ipDaoTao}/lop-hoc-phan/import-tkb/hoc-ky/${hocKyId}`, {
		responseType: 'arraybuffer',
	});
};

export const getXuatDanhSachLopDuKien = (maHocKy: string) => {
	return axios.get(`${ipDaoTao}/mo-lop-du-kien/export/lop-hoc-phan-du-kien/hoc-ky/${maHocKy}`, {
		responseType: 'arraybuffer',
	});
};

export const getJSONLopDuKien = (maHocKy: string) => {
	return axios.get(`${ipDaoTao}/mo-lop-du-kien/json/lop-hoc-phan-du-kien/hoc-ky/${maHocKy}`);
};

export const duyetMoLopDuKien = (payload: any) => {
	return axios.post(`${ipDaoTao}/mo-lop-du-kien/duyet`, payload);
};

export async function getThongKeTrangThaiDiemLop(params: { condition?: any; filters?: any[] }) {
	return axios.get(`${ipDaoTao}/lop-hoc-phan/thong-ke/trang-thai-diem-lop`, { params });
}

export async function getMoodleLopHocPhan(lopHocPhanId: string) {
	return axios.get(`${ipDaoTao}/lop-hoc-phan/${lopHocPhanId}/moodle/course`);
}

export async function putTrangThaiDuyetGiangDayLHP(maHocKy: string, payload: any) {
	return axios.put(`${ipDaoTao}/lop-hoc-phan/hoc-ky/${maHocKy}/phan-cong-giang-day/duyet`, payload);
}

export async function getThongKeTrangThaiDuyetGiangDay(params: { condition?: any; filters?: any[] }) {
	return axios.get(`${ipDaoTao}/lop-hoc-phan/thong-ke/trang-thai-duyet-giang-day`, { params });
}

// SINH VIÊN Lớp tín chỉ

export async function duyetDiemLopHocPhan(type: 'chuyen-vien' | 'quan-ly', idLopHocPhan: string) {
	return axios.put(`${ipDaoTao}/lop-hp-sv/duyet-diem/${type}/lop-hoc-phan/${idLopHocPhan}`);
}

export async function huyDuyetDiemLopHocPhan(idLopHocPhan: string) {
	return axios.put(`${ipDaoTao}/lop-hp-sv/nop-diem/mo-khoa/lop-hoc-phan/${idLopHocPhan}`);
}

export async function duyetDiemKTHocPhan(type: 'chuyen-vien' | 'quan-ly', maHocPhan: string, maHocKy: string) {
	return axios.put(`${ipDaoTao}/lop-hp-sv/duyet-diem/${type}/hoc-phan/${maHocPhan}/hoc-ky/${maHocKy}`);
}

export async function putDiemLopHocPhan(payload: { list: any[] }, isGiangVien?: boolean) {
	return axios.put(`${ipDaoTao}/lop-hp-sv/many/${isGiangVien ? 'gv' : ''}`, payload);
}

export async function putDiemThi(payload: { list: any[]; loaiNhapDiem: string }) {
	return axios.put(`${ipDaoTao}/lop-hp-sv/diem-thi/many`, payload);
}

export async function getSinhVienLopHocPhan(ssoId: string, params: { maHocPhan?: string; namHocId?: string }) {
	return axios.get(`${ipDaoTao}/lop-hp-sv/sinh-vien/${ssoId}`, { params });
}

export async function exportBangDiemLopHocPhan(lopHocPhanId: string) {
	return axios.get(`${ipDaoTao}/lop-hp-sv/diem-thanh-phan/export/bang-diem/lop-hoc-phan/${lopHocPhanId}`, {
		responseType: 'arraybuffer',
	});
}

// Lớp tín chỉ - Lớp hành chính
export const postLopHpLopHc = (payload: LopHocPhan.ILopHpLopHc) => {
	return axios.post(`${ipDaoTao}/lop-hp-lop-hc`, payload);
};

export const deleteLopHpLopHc = (idLopHpLopHc: string) => {
	return axios.delete(`${ipDaoTao}/lop-hp-lop-hc/${idLopHpLopHc}`);
};

//Điểm học phần sinh viên

export async function getSinhVienHocPhanNamHoc(
	ssoId: string,
	params: { maHocPhan?: string; namHocId?: string; maKhoaNganh?: string },
) {
	return axios.get(`${ipDaoTao}/diem-hp-sv-hk/sinh-vien/${ssoId}`, { params });
}

export async function getLopHpSvBySinhVien(ssoId: string) {
	return axios.get(`${ipDaoTao}/sinh-vien/lich-hoc/${ssoId}`);
}
