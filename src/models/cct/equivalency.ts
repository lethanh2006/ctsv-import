import useInitModel from '@/hooks/useInitModel';
import { postManyEquivalency } from '@/services/CCT/Activity';
import { Activity } from '@/services/CCT/Activity/typing';
import { ipCCT } from '@/utils/ip';
import { message } from 'antd';

export default () => {
	const objInit = useInitModel<Activity.IEquivalency>(
		'co-curricular-activity-equivalency',
		undefined,
		undefined,
		ipCCT,
	);
	const { setFormSubmiting } = objInit;

	const postManyEquivalencyModel = async (
		activityId: string,
		payload: { listCoCurricularActivityEquivalency: Activity.IEquivalency[] },
		getData?: () => void,
		messageText?: string,
	): Promise<Activity.IEquivalency> => {
		setFormSubmiting(true);
		try {
			const res = await postManyEquivalency(activityId, payload);
			message.success(messageText ?? 'Lưu thành công');

			if (getData) getData();

			return res.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		...objInit,
		postManyEquivalencyModel,
	};
};
