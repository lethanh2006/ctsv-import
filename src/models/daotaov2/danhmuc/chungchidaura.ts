import useInitModel from '@/hooks/useInitModel';
import { postChungChiCTDTMany } from '@/services/DaoTaoV2/DanhMucHeThong/ChuongTrinhDaoTao';
import type { ChuongTrinhDaoTao } from '@/services/DaoTaoV2/DanhMucHeThong/ChuongTrinhDaoTao/typings';
import { ipDaoTao } from '@/utils/ip';
import { message } from 'antd';

export default () => {
	const objInit = useInitModel<ChuongTrinhDaoTao.IChungChiCTDT>('chung-chi-ctdt', undefined, undefined, ipDaoTao);
	const { formSubmiting, setFormSubmiting, getModel, setVisibleForm } = objInit;

	const postChungChiCTDTManyModel = async (
		payload: ChuongTrinhDaoTao.IChungChiCTDT,
		getData?: () => void,
	): Promise<ChuongTrinhDaoTao.IKhoiHocPhanCTDT> => {
		if (formSubmiting) Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			const res = await postChungChiCTDTMany(payload);
			message.success('Thêm mới thành công');

			if (getData) getData();
			else getModel();
			setVisibleForm(false);

			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		...objInit,
		postChungChiCTDTManyModel,
	};
};
