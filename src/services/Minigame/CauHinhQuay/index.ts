import axios from "@/utils/axios";
import { ip3 } from "@/utils/ip";
import { MCauHinhQuay } from "./typing";

export async function getCauHinhQuay() {
	return axios.get(`${ip3}/vong-quay-may-man`);
}

export async function putCauHinhQuay(payload: MCauHinhQuay.IRecord) {
	return axios.put(`${ip3}/vong-quay-may-man/cau-hinh`, payload);
}

export async function capNhatPhanThuong(payload: MCauHinhQuay.ICapNhatPhanThuong[]) {
	return axios.post(`${ip3}/vong-quay-may-man/cap-nhat-phan-thuong`, payload);
}