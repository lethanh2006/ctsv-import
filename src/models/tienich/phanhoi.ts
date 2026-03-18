import useInitModel from '@/hooks/useInitModel';
import { getPhanHoiFromOther, traLoiPhanHoi } from '@/services/TienIch/PhanHoi';
import { type PhanHoi } from '@/services/TienIch/PhanHoi/typing';
import { EVaiTroBieuMau } from '@/services/TienIch/constant';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<PhanHoi.IRecord>('phan-hoi', undefined, undefined, undefined, {
		createdAt: -1,
	});
	const { formSubmiting, setFormSubmiting, setVisibleForm, getModel, setDanhSach, setTotal, page, limit, setLoading } =
		objInit;
	const [vaiTro, setVaiTro] = useState<EVaiTroBieuMau>(EVaiTroBieuMau.SINH_VIEN);

	const traLoiPhanHoiModel = async (payload: {
		id: string;
		data: { noiDungTraLoiPhanHoi: string; maChuyenVien: string; noiDungPhanHoi: string };
	}) => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);

		try {
			const res = await traLoiPhanHoi(payload);
			message.success('Trả lời thành công');
			setVisibleForm(false);
			getModel();
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const getPhanHoiFromOtherModel = async () => {
		setLoading(true);
		const response = await getPhanHoiFromOther({
			page,
			limit,
		});
		setDanhSach(response?.data?.data?.result ?? []);
		setTotal(response?.data?.data?.total ?? 0);
		setLoading(false);
	};

	return {
		...objInit,
		traLoiPhanHoiModel,
		getPhanHoiFromOtherModel,
		vaiTro,
		setVaiTro,
	};
};
