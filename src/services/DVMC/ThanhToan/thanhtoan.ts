import axios from '@/utils/axios';
import { ipTaiChinh } from '@/utils/ip';
import { buildFormData } from '@/utils/utils';
import type { ThanhToan } from './typings';

const url = 'chi-tiet-thu';

export async function getProductByCode(code: string) {
  return axios.get(`${ipTaiChinh}/${url}/thanh-toan/product/${code}`);
}

export async function getInvoiceByIdentityCode(identityCode: string) {
  return axios.get(`${ipTaiChinh}/${url}/ma-hoa-don/${identityCode}`);
}

export async function getMyInvoice(payload: { page: number; limit: number; condition?: any }) {
  return axios.get(`${ipTaiChinh}/${url}/thanh-toan/invoice/my`, { params: payload });
}

export async function getInvoice(payload: { page: number; limit: number; condition?: any }) {
  return axios.get(`${ipTaiChinh}/${url}/thanh-toan/invoice`, { params: payload });
}

export async function postInvoice(payload: ThanhToan.PostInvoice) {
  return axios.post(`${ipTaiChinh}/${url}/thanh-toan/invoice`, payload);
}

export async function importInvoice(payload: {
  file: any;
  loaiThanhToan: string;
  mocThoiGian: string;
}) {
  const formData = buildFormData(payload);
  return axios.post(`${ipTaiChinh}/${url}/thanh-toan/invoice/import`, formData);
}

export async function importInvoicePaid(payload: {
  file: any;
  loaiThanhToan: string;
  mocThoiGian: string;
}) {
  const formData = buildFormData(payload);
  return axios.post(`${ipTaiChinh}/${url}/thanh-toan/invoice/import-paid`, formData);
}

export async function payInvoiceByIdentityCode(payload: {
  maChiTietThu: string;
  amountPaid: number;
  transactionDate: string;
}) {
  return axios.put(`${ipTaiChinh}/${url}/thanh-toan`, payload);
}

export async function editInvoiceByIdentityCode(
  identityCode: string,
  payload: {
    amountPaid: number;
    transactionDate?: string;
  },
) {
  return axios.put(`${ipTaiChinh}/${url}/thanh-toan/invoice/${identityCode}/edit`, payload);
}

export async function refundInvoiceByIdentityCode(
  identityCode: string,
  payload: {
    amountPaid: number;
    transactionDate: string;
  },
) {
  return axios.put(`${ipTaiChinh}/${url}/thanh-toan/invoice/${identityCode}/refund`, payload);
}

export async function getLinkThanhToanByIdentityCode(identityCode: string) {
  return axios.post(`${ipTaiChinh}/${url}/thanh-toan/init/vnpt-pay/${identityCode}`);
}

export async function thongKeMyInvoice(payload: { condition: any }) {
  return axios.get(`${ipTaiChinh}/${url}/thanh-toan/invoice/my/thong-ke`, { params: payload });
}
