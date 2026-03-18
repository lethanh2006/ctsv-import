import useInitModel from '@/hooks/useInitModel';
import { type HocKy } from '@/services/DaoTaoV2/HocKy/HocKy/typing';
import { postKhoiTaoNamHoc } from '@/services/DaoTaoV2/NamHoc/KeHoachNamHoc';
import type { KeHoachNamHoc } from '@/services/DaoTaoV2/NamHoc/KeHoachNamHoc/typings';
import { chotKeHoachNamHoc, postNamHocFull } from '@/services/DaoTaoV2/NamHoc/NamHoc';
import type { NamHoc } from '@/services/DaoTaoV2/NamHoc/NamHoc/typings';
import { ipDaoTao } from '@/utils/ip';
import { chuanHoaObject } from '@/utils/utils';
import { message } from 'antd';

export default () => {
	const objInit = useInitModel<NamHoc.IRecord>('nam-hoc', undefined, undefined, ipDaoTao, { ma: -1 });
	const { formSubmiting, setFormSubmiting, getModel, setVisibleForm, setLoading } = objInit;

	const postFullModel = async (
		payload: { namHocDto: NamHoc.IRecord; hocKyDtoList: HocKy.IRecord[] },
		getData?: any,
		closeModal?: boolean,
	): Promise<NamHoc.IRecord> => {
		if (formSubmiting) Promise.reject('form submiting');
		setFormSubmiting(true);
		try {
			const res = await postNamHocFull(chuanHoaObject(payload));
			message.success('Thêm mới thành công');
			if (getData) getData();
			else getModel();
			if (closeModal !== false) setVisibleForm(false);

			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const khoiTaoNamHocModel = async (payload: {
		namHoc: Partial<NamHoc.IRecord>;
		danhSachKyHoc: Partial<HocKy.IRecord>[];
		danhSachKeHoachNamHoc: Partial<KeHoachNamHoc.IRecord>[];
	}): Promise<any> => {
		if (formSubmiting) Promise.reject('form submiting');
		setFormSubmiting(true);
		try {
			const res = await postKhoiTaoNamHoc(chuanHoaObject(payload));
			message.success('Khởi tạo thành công');

			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const chotKeHoachNamHocModel = async (
		namHocId: string,
		payLoad: Partial<NamHoc.IRecord>,
	): Promise<NamHoc.IRecord> => {
		setLoading(true);
		try {
			const res = await chotKeHoachNamHoc(namHocId, payLoad);
			message.success('Chốt thành công');
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoading(false);
		}
	};

	return {
		...objInit,
		postFullModel,
		khoiTaoNamHocModel,
		chotKeHoachNamHocModel,
	};
};
