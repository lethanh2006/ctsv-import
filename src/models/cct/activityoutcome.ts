import useInitModel from '@/hooks/useInitModel';
import { getAnalyticsApprovers, getAnalyticsStaff, putApproveActivity } from '@/services/CCT/ActivityOutcome';
import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import { EApprovalStatus } from '@/services/CCT/constant';
import { ipCCT } from '@/utils/ip';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<ActivityOutCome.IRecord>('activity-outcome', undefined, undefined, ipCCT);
	const { formSubmiting, setFormSubmiting } = objInit;
	const [loadingThongKe, setLoadingThongKe] = useState<boolean>(false);
	const [dataThongKe, setDataThongKe] = useState<ActivityOutCome.IAnalyticsStaff>();
	const [dataThongKeApprovers, setDataThongKeAppreovers] = useState<ActivityOutCome.IAnalyticsApprovers>();
	const [loadingThongKeApprovers, setLoadingThongKeApprovers] = useState<boolean>(false);

	const [visibleChangeStatus, setVisibleChangeStatus] = useState<boolean>(false);
	const [visibleXuLy, setVisibleXuLy] = useState<boolean>(false);
	const [visibleImpact, setVisibleImpact] = useState<boolean>(false);

	const putApproveActivityModel = async (
		idActivity: string,
		payLoad: {
			workflow: EApprovalStatus;
			activityRejectionNote?: string;
			revisionNote?: string;
			dueDate?: Date;
		},
		getData?: () => void,
		messageText?: string,
	): Promise<ActivityOutCome.IRecord> => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			const res = await putApproveActivity(idActivity, payLoad);
			message.success(messageText ?? 'Lưu thành công');

			if (getData) getData();
			return res.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setFormSubmiting(false);
		}
	};

	const getAnalyticsStaffModel = async (): Promise<ActivityOutCome.IAnalyticsStaff> => {
		setLoadingThongKe(true);
		try {
			const res = await getAnalyticsStaff();
			setDataThongKe(res.data?.data);
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoadingThongKe(false);
		}
	};

	const getAnalyticsApproversModel = async (): Promise<ActivityOutCome.IAnalyticsStaff> => {
		setLoadingThongKeApprovers(true);
		try {
			const res = await getAnalyticsApprovers();
			setDataThongKeAppreovers(res.data?.data);
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoadingThongKeApprovers(false);
		}
	};

	return {
		...objInit,
		dataThongKe,
		loadingThongKe,
		putApproveActivityModel,
		getAnalyticsStaffModel,
		dataThongKeApprovers,
		loadingThongKeApprovers,
		getAnalyticsApproversModel,
		visibleChangeStatus,
		setVisibleChangeStatus,
		visibleXuLy,
		setVisibleXuLy,
		visibleImpact,
		setVisibleImpact,
	};
};
