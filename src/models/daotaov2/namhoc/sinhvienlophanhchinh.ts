import useInitModel from '@/hooks/useInitModel';
import { postManySinhVienLopHanhChinh } from '@/services/DaoTaoV2/NamHoc/LopHanhChinh';
import { type LopHanhChinh } from '@/services/DaoTaoV2/NamHoc/LopHanhChinh/typings';
import { ipDaoTao } from '@/utils/ip';
import { chuanHoaObject } from '@/utils/utils';
import { message } from 'antd';

export default () => {
	const objInit = useInitModel<LopHanhChinh.IRecordSinhVien>('lop-hc-sv', undefined, undefined, ipDaoTao);
	const { formSubmiting, setFormSubmiting, setVisibleForm } = objInit;

	const postManyModel = async (
		payload: { lopHanhChinhId: string; sinhVienSsoIds: string[] },
		getData: () => void,
		closeModal?: boolean,
		messageText?: string,
	): Promise<any> => {
		if (formSubmiting) Promise.reject('form submiting');
		setFormSubmiting(true);
		try {
			const res = await postManySinhVienLopHanhChinh(chuanHoaObject(payload));
			message.success(messageText ?? 'Thêm mới thành công');

			if (getData) getData();
			if (closeModal !== false) setVisibleForm(false);

			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		...objInit,
		postManyModel,
	};
};
