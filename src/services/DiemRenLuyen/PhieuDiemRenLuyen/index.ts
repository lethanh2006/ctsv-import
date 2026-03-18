import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import type { BieuMau } from '../BieuMau/typing';
import type { ETrangThaiDanhGia, ETrangThaiKhieuNai } from './constants';

export async function getCauTraLoiBieuMau({
	idDot,
	ssoId,
	nguoiTraLoi,
}: {
	idDot: string;
	nguoiTraLoi: string;
	ssoId?: string;
}) {
	interface ResponseSuccess {
		success: true;
		data: {
			diemCham: BieuMau.CauTraLoiBieuMau[];
			// thongTinNhanSu: ThongTinNhanSu.IRecord;
			trangThai: ETrangThaiDanhGia;
			yKienDonVi?: string;
			ketQuaKetLuan?: string;
			ketLuanLanhDao?: string;
			_id: string;
			trangThaiNopCoVan: string;
			trangThaiNopSV: string;
			trangThaiPhongCTSV: string;
			trangThaiNopBCS: string;
		};
	}
	return axios.get<ResponseSuccess>(`${ip3}/phieu-diem-ren-luyen/${idDot}/${nguoiTraLoi}`, {
		params: { ssoId: ssoId },
	});
}

export async function getDiemMinhChung(idDot: string, ssoId: string) {
	return axios.get(`${ip3}/phieu-diem-ren-luyen/diem-minh-chung/${idDot}/${ssoId}`);
}

export async function updateTrangThaiPhieuDiem(id: string, payload: any) {
	return axios.put(`${ip3}/phieu-diem-ren-luyen/${id}`, { ...payload });
}

export const getPhieuTongHop = (idDotChamDiem: string, tenLopHc: string) => {
	return axios.get(
		`${ip3}/phieu-diem-ren-luyen/dot-cham-diem/${idDotChamDiem}/tong-hop-phieu-diem/lop-hanh-chinh/${tenLopHc}`,
	);
};

export const exportPhieuTongHop = (idDotChamDiem: string, tenLopHc: string) => {
	return axios.get(
		`${ip3}/phieu-diem-ren-luyen/dot-cham-diem/${idDotChamDiem}/export-phieu-diem/lop-hanh-chinh/${tenLopHc}`,
		{
			responseType: 'arraybuffer',
		},
	);
};

export const exportDonKhieuNai = (idPhieuDiem: string) => {
	return axios.get(`${ip3}/phieu-diem-ren-luyen/export/don-khieu-nai/${idPhieuDiem}`, {
		responseType: 'arraybuffer',
	});
};

export const xuLyKhieuNai = (
	idPhieuDiem: string,
	payload: {
		diemChamSv?: any;
		diemChamBCS?: any;
		diemChamCV?: any;
		traLoiNoiDungKhieuNai?: string;
		trangThaiXuLyKhieuNai: ETrangThaiKhieuNai;
	},
) => axios.post(`${ip3}/phieu-diem-ren-luyen/xu-ly-khieu-nai/${idPhieuDiem}`, payload);

export const exportThongKe = (idDotChamDiem: string, lopHanhChinh?: string) => {
	return axios.get(`${ip3}/phieu-diem-ren-luyen/export/danh-sach-ket-qua/${idDotChamDiem}`, {
		responseType: 'arraybuffer',
		params: {
			lopHanhChinh,
		},
	});
};
