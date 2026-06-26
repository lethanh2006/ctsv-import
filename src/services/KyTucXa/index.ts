import axios from '@/utils/axios';
import { ETrangThaiDanhMucChung } from '../DanhMuc/constants';
import { ipCsvc } from '@/utils/ip';

export async function thongKePhongKTX(condition?: any) {
	return axios.get(`${ipCsvc}/thong-ke-ktx/phong`, { params: { condition: condition } });
}

export async function kichHoatDanhMucChung(
  id: string,
  mode: ETrangThaiDanhMucChung
) {
  return axios.put(`${ipCsvc}/danh-muc-chung/active`, {
    ids: [id],
    mode,
  });
}