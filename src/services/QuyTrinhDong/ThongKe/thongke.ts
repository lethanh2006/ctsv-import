import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export const thongKeDon = (
	loaiXuLyDon: string,
	payload?: { quyTrinhId?: string; startDate?: string; endDate?: string },
) => axios.get(`${ip3}/thong-ke-quy-trinh-dong/so-luong-don/${loaiXuLyDon}`, { params: { ...payload } });

export const thongKeDonQuaHan = (loaiXuLyDon: string, loaiThongKeQuaHan: string) =>
	axios.get(`${ip3}/thong-ke-quy-trinh-dong/so-luong-don/qua-han/${loaiXuLyDon}/${loaiThongKeQuaHan}`);

export const chiTietDonQuaHan = (loaiXuLyDon: string, quyTrinhId: string) =>
	axios.get(`${ip3}/thong-ke-quy-trinh-dong/so-luong-don/qua-han/${loaiXuLyDon}/quy-trinh/${quyTrinhId}`);

export const getDataThongKeJson = (idThongKe: string, payload: { filters: any }) => {
	return axios.get(`${ip3}/thong-ke-quy-trinh-dong/${idThongKe}/execute/raw`, { params: payload });
};

export const getDataThongKeExcel = (payload?: { thongKeQuyTrinhDongIds?: string[]; start?: string; end?: string }) => {
	return axios.post(`${ip3}/thong-ke-quy-trinh-dong/execute/excel`, payload, { responseType: 'arraybuffer' });
};

export const thongKeDonTheoBuoc = (idQuyTrinh: string) =>
	axios.get(`${ip3}/thong-ke-quy-trinh-dong/general/quy-trinh/${idQuyTrinh}`);

export const getCountDonChuaXuLy = () => axios.get(`${ip3}/thong-ke-quy-trinh-dong/count/don-chua-xu-ly`);

export const thongKeLuotGiaiQuyetDon = (maHocKy: string) =>
	axios.get(`${ip3}/thong-ke-quy-trinh-dong/thong-ke-luot-giai-quyet-sv/hoc-ky/${maHocKy}/raw`);
export const exportThongKeLuotGiaiQuyetDon = (maHocKy: string) =>
	axios.get(`${ip3}/thong-ke-quy-trinh-dong/thong-ke-luot-giai-quyet-sv/hoc-ky/${maHocKy}`, {
		responseType: 'arraybuffer',
	});
