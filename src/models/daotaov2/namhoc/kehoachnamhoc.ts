import useInitModel from '@/hooks/useInitModel';
import {
	getKeHoachNamHocHienTai,
	importKeHoachNamHoc,
	initKeHoachNamHoc,
	putKeHoachTheoTuan,
} from '@/services/DaoTaoV2/NamHoc/KeHoachNamHoc';
import type { KeHoachNamHoc } from '@/services/DaoTaoV2/NamHoc/KeHoachNamHoc/typings';
import { ipDaoTao } from '@/utils/ip';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<KeHoachNamHoc.IRecord>('ke-hoach-nam-hoc', undefined, undefined, ipDaoTao);
	const [recordKHTheoTuan, setRecordKHTheoTuan] = useState<KeHoachNamHoc.IKeHoachTheoTuan>();
	const { formSubmiting, setFormSubmiting, setVisibleForm, condition, getAllModel, setLoading } = objInit;

	const initKeHoachNamHocModel = async (namHocId: string): Promise<any> => {
		if (formSubmiting) return Promise.reject('form submiting');
		setFormSubmiting(true);

		try {
			const res = await initKeHoachNamHoc(namHocId);
			message.success('Đã khởi tạo thành công');
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const putKeHoachTheoTuanModel = async (payload: KeHoachNamHoc.IKeHoachTheoTuan): Promise<any> => {
		if (formSubmiting) return Promise.reject('form submiting');
		setFormSubmiting(true);

		try {
			const res = await putKeHoachTheoTuan(payload);
			message.success('Cập nhật thành công');
			setVisibleForm(false);
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const importKeHoachNamHocModel = async (payload: { namHocId: string; file: Blob }) => {
		if (formSubmiting) return;
		setFormSubmiting(true);

		try {
			const res = await importKeHoachNamHoc(payload);
			message.success('Import thành công');

			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const getDataModel = async (namHocId: string): Promise<KeHoachNamHoc.IRecord[]> => {
		if (condition?.phienBanId) return getAllModel(false, { thuTuTuan: 1 }, { namHocId });
		else {
			setLoading(true);
			try {
				const res = await getKeHoachNamHocHienTai(namHocId);
				return res.data?.data;
			} catch (er) {
				return Promise.reject(er);
			} finally {
				setLoading(false);
			}
		}
	};

	return {
		...objInit,
		recordKHTheoTuan,
		setRecordKHTheoTuan,
		initKeHoachNamHocModel,
		putKeHoachTheoTuanModel,
		importKeHoachNamHocModel,
		getDataModel,
	};
};
