import useInitModel from '@/hooks/useInitModel';
import { khoiTaoNhuCauHocPhan } from '@/services/DaoTaoV2/HocKy/SinhVienHocPhan';
import type { SinhVienHpHk } from '@/services/DaoTaoV2/HocKy/SinhVienHocPhan/typing';
import { ipDaoTao } from '@/utils/ip';
import { message } from 'antd';

export default () => {
	const objInit = useInitModel<SinhVienHpHk.IRecord>('sv-hp-hk', undefined, undefined, ipDaoTao);
	const { formSubmiting, setFormSubmiting } = objInit;

	const khoiTaoNhuCauHocPhanModel = async (payload: Pick<SinhVienHpHk.IRecord, 'maHocKy'>): Promise<any> => {
		if (formSubmiting) Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			const res = await khoiTaoNhuCauHocPhan(payload);
			message.success('Khởi tạo thành công');

			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		...objInit,
		khoiTaoNhuCauHocPhanModel,
	};
};
