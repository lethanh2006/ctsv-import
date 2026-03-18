import useInitModel from '@/hooks/useInitModel';
import { postManyKhoaNganh } from '@/services/DotKhamSuKhoe';
import type { DotKhamSucKhoe } from '@/services/DotKhamSuKhoe/typing';
import { message } from 'antd';

export default () => {
	const objInit = useInitModel<DotKhamSucKhoe.IDotKhamKhoaNganh>('dot-kham-suc-khoe-khoa-nganh');
	const { formSubmiting, setFormSubmiting, setVisibleForm } = objInit;

	const postManyKhoaNganhModel = async (
		dotKhamSucKhoeId: string,
		payLoad: {
			danhSachKhoaNganh: DotKhamSucKhoe.IDotKhamKhoaNganh[];
		},
	): Promise<DotKhamSucKhoe.IDotKhamKhoaNganh> => {
		if (formSubmiting) return Promise.reject('form submiting');
		setFormSubmiting(true);

		try {
			const res = await postManyKhoaNganh(dotKhamSucKhoeId, payLoad);
			message.success('Thêm mới thành công');
			setVisibleForm(false);
			return res.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		...objInit,
		postManyKhoaNganhModel,
	};
};
