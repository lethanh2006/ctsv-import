import axios from '@/utils/axios';
import { ipCCT } from '@/utils/ip';

export async function putApproveActivity(idActivity: string, payLoad: any) {
	return axios.put(`${ipCCT}/activity-outcome/approve/${idActivity}`, payLoad);
}

export async function putApproveActivityMany(payLoad: any) {
	return axios.put(`${ipCCT}/activity-outcome/approve-many`, payLoad);
}

export async function getAnalyticsStaff() {
	return axios.get(`${ipCCT}/activity-outcome/analytics/staff`);
}

export async function getAnalyticsApprovers() {
	return axios.get(`${ipCCT}/activity-outcome/analytics/overview`);
}

export async function thongKeSoLuongActivityOutCome(filters?: any[]) {
	return axios.get(`${ipCCT}/activity-outcome/approval-task-list/page`, {
		params: { page: 1, limit: 10, filters: filters },
	});
}

export async function thongKeThoiGianDuyet() {
	return axios.get(`${ipCCT}/activity-outcome/statistics/approval-turnaround`);
}

export async function thongKeTiLeHoanThanh() {
	return axios.get(`${ipCCT}/activity-outcome/statistics/activity-completion-rate`);
}

export async function thongKePhanBoLevel() {
	return axios.get(`${ipCCT}/activity-outcome/statistics/by-level`);
}

export async function thongKeTiLePhanBoVali() {
	return axios.get(`${ipCCT}/activity-outcome/statistics/by-validation`);
}

export async function thongKeHeatmap() {
	return axios.get(`${ipCCT}/activity-outcome/statistics/by-attributes`);
}

export async function thongKePhanBoHoatDong() {
	return axios.get(`${ipCCT}/activity-outcome/statistics/by-activity-type`);
}

export async function thongKePhanBoVaiTro() {
	return axios.get(`${ipCCT}/activity-outcome/statistics/by-roles`);
}

export async function thongKeSinhVien() {
	return axios.get(`${ipCCT}/activity-outcome/statistics/records-per-student`);
}

export async function thongKeTopHoatDong() {
	return axios.get(`${ipCCT}/activity-outcome/statistics/top-activities`);
}

export async function exportMyCCT(ssoId: string) {
	return axios.get(`${ipCCT}/my-cct/export-pdf/${ssoId}`, {
		responseType: 'arraybuffer',
	});
}
