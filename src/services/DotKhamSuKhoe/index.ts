import { ip3 } from '@/utils/ip';
import axios from '@/utils/axios';

export async function postManyKhoaNganh(dotKhamSucKhoeId: string, payLoad: any) {
	return axios.post(`${ip3}/dot-kham-suc-khoe-khoa-nganh/dot-kham-suc-khoe/${dotKhamSucKhoeId}/many`, payLoad);
}

export async function thongKeSucKhoeSinhVien(dotKhamSucKhoeId: string) {
	return axios.get(`${ip3}/tinh-trang-suc-khoe-sinh-vien/dot-kham-suc-khoe/${dotKhamSucKhoeId}/thong-ke`);
}
