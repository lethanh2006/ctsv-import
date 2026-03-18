import useInitModel from '@/hooks/useInitModel';
import { getAnalyticsActivity } from '@/services/CCT/Activity';
import { Activity } from '@/services/CCT/Activity/typing';
import { ipCCT } from '@/utils/ip';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<Activity.IRecord>('activities', undefined, undefined, ipCCT);
	const [loadingThongKe, setLoadingThongKe] = useState<boolean>(false);
	const [dataThongKe, setDataThongKe] = useState<Activity.IAnalyticsActivity>();

	const getAnalyticsActivityModel = async (condition?: any): Promise<Activity.IAnalyticsActivity> => {
		setLoadingThongKe(true);
		try {
			const res = await getAnalyticsActivity(condition);
			setDataThongKe(res.data?.data);
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoadingThongKe(false);
		}
	};

	return {
		...objInit,
		loadingThongKe,
		dataThongKe,
		getAnalyticsActivityModel,
	};
};
