import { ip3 } from '@/utils/ip';
import axios from '@/utils/axios';

const url = 'phan-hoi';

export async function traLoiPhanHoi(payload: { id: string; data: any }) {
  return axios.put(`${ip3}/${url}/${payload.id}/tra-loi`, payload.data);
}

export const traLoiPhanHoiDvmc = (idDonDVMC: string, payload: { noiDungTraLoiPhanHoi: string }) => {
  return axios.put(`${ip3}/${url}/don-dvmc/${idDonDVMC}/tra-loi`, payload);
};

export async function getPhanHoiFromOther(payload: {
  page: number;
  limit: number;
  daTraLoi?: boolean;
}) {
  return axios.get(`${ip3}/${url}/from-other/pageable`, { params: payload });
}
