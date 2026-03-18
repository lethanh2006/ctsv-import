import useInitModel from '@/hooks/useInitModel';
import { guiThongBaoPhanCongGiangDay } from '@/services/DaoTaoV2/HocKy/HocKy';
import { type HocKy } from '@/services/DaoTaoV2/HocKy/HocKy/typing';
import { ipDaoTao } from '@/utils/ip';
import { message } from 'antd';

export default () => {
	const objInit = useInitModel<HocKy.IRecord>('hoc-ky', undefined, undefined, ipDaoTao, { soThuTu: 1 });

	const { formSubmiting, setFormSubmiting } = objInit;

	const guiThongBaoPhanCongGiangDayModel = async (
		maHocKy: string,
		payLoad: Partial<HocKy.IRecord>,
	): Promise<HocKy.IRecord> => {
		if (formSubmiting) return Promise.reject('Form submitting');
		setFormSubmiting(true);

		try {
			const res = await guiThongBaoPhanCongGiangDay(maHocKy, payLoad);
			message.success('Lưu thành công');
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		...objInit,
		guiThongBaoPhanCongGiangDayModel,
	};
};
