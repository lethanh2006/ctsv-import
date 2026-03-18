import type { HocKy } from '@/services/HocKy/HocKy/typing';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import type { KeHoachNamHoc } from './typings';

export async function initKeHoachNamHoc(namHocId: string) {
	return axios.post(`${ip3}/ke-hoach-nam-hoc/init/nam-hoc/${namHocId}`);
}

export async function putKeHoachTheoTuan(payload: KeHoachNamHoc.IKeHoachTheoTuan) {
	return axios.put(`${ip3}/ke-hoach-nam-hoc/tuan`, payload);
}

export async function getMauImportKeHoachNamHoc(namHocId: string) {
	return axios.get(`${ip3}/ke-hoach-nam-hoc/import-template/nam-hoc/${namHocId}`, {
		responseType: 'arraybuffer',
	});
}

export async function importKeHoachNamHoc(payload: { namHocId: string; file: Blob }) {
	const form = new FormData();
	form.append('file', payload.file);
	return axios.post(`${ip3}/ke-hoach-nam-hoc/import/insert/nam-hoc/${payload.namHocId}`, form);
}

export async function exportKeHoachNamHoc(namHocId: string) {
	return axios.get(`${ip3}/ke-hoach-nam-hoc/export/nam-hoc/${namHocId}`, {
		responseType: 'arraybuffer',
	});
}

export async function getKeHoachNamHocHienTai(namHocId: string) {
	return axios.get(`${ip3}/ke-hoach-nam-hoc/many/nam-hoc/${namHocId}`);
}

export async function postKhoiTaoNamHoc(payload: {
	namHoc: Partial<NamHoc.IRecord>;
	danhSachKyHoc: Partial<HocKy.IRecord>[];
	danhSachKeHoachNamHoc: Partial<KeHoachNamHoc.IRecord>[];
}) {
	return axios.post(`${ip3}/ke-hoach-nam-hoc/create/nam-hoc/`, payload);
}

export async function duyetYKienKeHoachNamHoc(yKienId: string, payLoad: any) {
	return axios.put(`${ip3}/y-kien-khnh/${yKienId}/duyet`, payLoad);
}
