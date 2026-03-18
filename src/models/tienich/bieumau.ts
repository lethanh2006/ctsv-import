import useInitModel from '@/hooks/useInitModel';
import { traLoiBieuMau } from '@/services/TienIch/BieuMau';
import { type BieuMau } from '@/services/TienIch/BieuMau/typings';
import { ipSlink } from '@/utils/ip';
import { message } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<BieuMau.Record>(
		'khao-sat',
		undefined,
		undefined,
		// {
		// 	loai: ELoaiBieuMau.KHAO_SAT,
		// },
		ipSlink,
	);
	const [formCauHinhBieuMau] = useForm();
	const [isCopy, setIsCopy] = useState<boolean>(false);
	const { formSubmiting, setFormSubmiting } = objInit;

	const traLoiBieuMauModel = async (payload: {
		idKhaoSat: string;
		danhSachTraLoi: Partial<BieuMau.TraLoiRecord[]>;
		idDot: string;
	}): Promise<any> => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			const res = await traLoiBieuMau(payload);
			message.success('Gửi câu trả lời thành công');
			// getIdBieuMauDaTraLoiModel();

			// setVisibleForm(false);
			return res.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		...objInit,
		formCauHinhBieuMau,
		isCopy,
		setIsCopy,
		traLoiBieuMauModel,
	};
};
