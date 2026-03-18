import axios from '@/utils/axios';
import { ipSlink } from '@/utils/ip';

export async function thongKeSinhVienTheChat(params?: { condition?: any; filters?: any[] }) {
	return axios.get(`${ipSlink}/ket-qua-the-chat/thong-ke`, { params });
}

export async function thongKeSinhVienTheChatDanhGia(dotId: string, params?: { condition?: any; filters?: any[] }) {
	return axios.get(`${ipSlink}/ket-qua-the-chat/thong-ke-dot-danh-gia/${dotId}`, { params });
}
