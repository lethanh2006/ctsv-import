import useInitModel from '@/hooks/useInitModel';
import { EStatusMyCCT } from '@/services/CCT/constant';
import { getAnalyticsMyCCT, putApproveMyCCT } from '@/services/CCT/MyCCT';
import { ipCCT } from '@/utils/ip';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<MyCCT.IRecord>('my-cct', undefined, undefined, ipCCT);
	const { formSubmiting, setFormSubmiting } = objInit;
	const [visibleXuLy, setVisibleXuLy] = useState<boolean>(false);

	const putApproveMyCCTModel = async (
		idActivity: string,
		payLoad: {
			status: EStatusMyCCT;
			revisionNote: string;
		},
		getData?: () => void,
		messageText?: string,
	): Promise<MyCCT.IRecord> => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			const res = await putApproveMyCCT(idActivity, payLoad);
			message.success(messageText ?? 'Lưu thành công');

			if (getData) getData();
			return res.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setFormSubmiting(false);
		}
	};

	const getAnalyticsMyCCTModel = async (condition?: any): Promise<MyCCT.IAnalyticsMyCCT> => {
		try {
			const res = await getAnalyticsMyCCT(condition);
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
		}
	};

	return {
		...objInit,
		visibleXuLy,
		setVisibleXuLy,
		putApproveMyCCTModel,
		getAnalyticsMyCCTModel,
	};
};
