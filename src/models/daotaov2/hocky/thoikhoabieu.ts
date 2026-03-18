import useInitModel from '@/hooks/useInitModel';
import {
	exportThoiKhoaBieu,
	importThoiKhoaBieu,
	importThoiKhoaBieu1,
	putGiamSatGiangDay,
	putLichHocTuan,
	putPhanCongGiangDay,
} from '@/services/DaoTaoV2/HocKy/ThoiKhoaBieu';
import { type ThoiKhoaBieu } from '@/services/DaoTaoV2/HocKy/ThoiKhoaBieu/typing';
import { ipDaoTao } from '@/utils/ip';
import { message } from 'antd';
import fileDownload from 'js-file-download';

export default () => {
	const objInit = useInitModel<ThoiKhoaBieu.IRecord>('thoi-khoa-bieu', undefined, undefined, ipDaoTao);
	const { formSubmiting, setFormSubmiting, setVisibleForm, setLoading } = objInit;

	const importThoiKhoaBieuModel = async (payload: { file: Blob }): Promise<ThoiKhoaBieu.IImportResponse> => {
		if (formSubmiting) return Promise.reject('Form submitting');
		setFormSubmiting(true);

		try {
			const res = await importThoiKhoaBieu(payload);

			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	// Import của Tùng
	const importThoiKhoaBieuModel1 = async (
		maHocKy: string,
		payload: {
			file: Blob;
		},
	): Promise<ThoiKhoaBieu.IImportResponse> => {
		if (formSubmiting) return Promise.reject('Form submitting');
		setFormSubmiting(true);

		try {
			const res = await importThoiKhoaBieu1(maHocKy, payload);

			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const putLichHocTuanModel = async (
		tenLopHocPhan: string,
		payload: {
			lichHocTuanList: ThoiKhoaBieu.ILichHocTuan[];
		},
	): Promise<any> => {
		if (formSubmiting) return Promise.reject('Form submitting');
		setFormSubmiting(true);

		try {
			const res = await putLichHocTuan(tenLopHocPhan, payload);
			message.success('Sinh thời khóa biểu thành công');

			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const phanCongGiangDayModel = async (payload: {
		updateList: ThoiKhoaBieu.TUpdatePhanCongGiangDay[];
	}): Promise<any> => {
		if (formSubmiting) return Promise.reject('Form submitting');
		setFormSubmiting(true);

		try {
			const res = await putPhanCongGiangDay(payload);
			message.success('Lưu thành công');

			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const giamSatGiangDayModel = async (
		thoiKhoaBieuId: string,
		payload: ThoiKhoaBieu.TUpdateGiamSat,
		getData: () => void,
	): Promise<ThoiKhoaBieu.IRecord> => {
		if (formSubmiting) return Promise.reject('Form submitting');
		setFormSubmiting(true);

		try {
			const res = await putGiamSatGiangDay(thoiKhoaBieuId, payload);
			message.success('Lưu thành công');
			getData();
			setVisibleForm(false);

			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const exportThoiKhoaBieuModel = async (maHocKy: string, mode: 'KhoaSinhVien' | 'LopHanhChinh') => {
		setLoading(true);

		try {
			const res = await exportThoiKhoaBieu(maHocKy, mode);
			fileDownload(res.data, `Thời khóa biểu ${maHocKy}.docx`);
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoading(false);
		}
	};

	return {
		...objInit,
		importThoiKhoaBieuModel,
		importThoiKhoaBieuModel1,
		putLichHocTuanModel,
		phanCongGiangDayModel,
		giamSatGiangDayModel,
		exportThoiKhoaBieuModel,
	};
};
