import axios from '@/utils/axios';
import { ipCCT } from '@/utils/ip';

export async function putApproveActivity(idActivity: string, payLoad: any) {
	return axios.put(`${ipCCT}/activity-outcome/approve/${idActivity}`, payLoad);
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
