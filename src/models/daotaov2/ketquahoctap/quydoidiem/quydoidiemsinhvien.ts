import useInitModel from '@/hooks/useInitModel';
import {
	congNhanKetQuaQuyDoi,
	khongCongNhanQuyDoi,
	postSinhVienQuyDoi,
	raQuyetDinhQuyDoiDiem,
	thongKeSinhVienQuyDoiDiem,
} from '@/services/DaoTaoV2/KetQuaHocTap/DotQuyDoiDiem';
import type { DotQuyDoiDiem } from '@/services/DaoTaoV2/KetQuaHocTap/DotQuyDoiDiem/typing';
import { ipDaoTao } from '@/utils/ip';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<DotQuyDoiDiem.IQuyDoiDiemSinhVien>(
		'quy-doi-diem-sinh-vien',
		undefined,
		undefined,
		ipDaoTao,
	);
	const [thongKe, setThongKe] = useState<DotQuyDoiDiem.IThongKeSVQuyDoiDiem>();
	const { formSubmiting, setFormSubmiting } = objInit;

	const raQuyetDinhQuyDoiDiemModel = async (
		idDotQuyDoi: string,
		payLoad: DotQuyDoiDiem.TRaQuyetDinhQuyDoiDiem,
	): Promise<DotQuyDoiDiem.TRaQuyetDinhQuyDoiDiem> => {
		if (formSubmiting) return Promise.reject('form submiting');
		setFormSubmiting(true);

		try {
			const res = await raQuyetDinhQuyDoiDiem(idDotQuyDoi, payLoad);
			message.success('Ra quyết định thành công');
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const khongCongNhanQuyDoiModel = async (
		idQuyDoi: string,
		payLoad: DotQuyDoiDiem.IQuyDoiDiemSinhVien,
	): Promise<DotQuyDoiDiem.IQuyDoiDiemSinhVien> => {
		if (formSubmiting) return Promise.reject('form submiting');
		setFormSubmiting(true);

		try {
			const res = await khongCongNhanQuyDoi(idQuyDoi, payLoad);
			message.success('Lưu thành công');
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const postSinhVienQuyDoiModel = async (idDotQuyDoi: string, payLoad: any): Promise<any> => {
		if (formSubmiting) return Promise.reject('form submiting');
		setFormSubmiting(true);

		try {
			const res = await postSinhVienQuyDoi(idDotQuyDoi, payLoad);
			message.success('Thêm thành công');
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const congNhanKetQuaQuyDoiModel = async (
		idQuyDoi: string,
		payLoad: DotQuyDoiDiem.IQuyDoiDiemSinhVien,
	): Promise<DotQuyDoiDiem.IQuyDoiDiemSinhVien> => {
		if (formSubmiting) return Promise.reject('form submiting');
		setFormSubmiting(true);

		try {
			const res = await congNhanKetQuaQuyDoi(idQuyDoi, payLoad);
			message.success('Lưu thành công');
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const thongKeSinhVienQuyDoiDiemModel = async (idQuyDoi: string): Promise<DotQuyDoiDiem.IThongKeSVQuyDoiDiem> => {
		try {
			const res = await thongKeSinhVienQuyDoiDiem(idQuyDoi);
			setThongKe(res.data?.data);
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
		}
	};

	return {
		...objInit,
		raQuyetDinhQuyDoiDiemModel,
		khongCongNhanQuyDoiModel,
		postSinhVienQuyDoiModel,
		congNhanKetQuaQuyDoiModel,
		thongKeSinhVienQuyDoiDiemModel,
		thongKe,
	};
};
