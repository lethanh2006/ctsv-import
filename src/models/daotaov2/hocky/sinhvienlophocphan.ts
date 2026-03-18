import useInitModel from '@/hooks/useInitModel';

import {
	duyetDiemKTHocPhan,
	duyetDiemLopHocPhan,
	getLopHpSvBySinhVien,
	getSinhVienLopHocPhan,
	huyDuyetDiemLopHocPhan,
	putDiemLopHocPhan,
	putDiemThi,
} from '@/services/DaoTaoV2/HocKy/LopHocPhan';
import { type LopHocPhan } from '@/services/DaoTaoV2/HocKy/LopHocPhan/typing';
import { ipDaoTao } from '@/utils/ip';
import { message } from 'antd';

export default () => {
	const objInit = useInitModel<LopHocPhan.IRecordSinhVienLopHP>('lop-hp-sv', undefined, undefined, ipDaoTao);
	const { formSubmiting, setFormSubmiting, setLoading, setDanhSach } = objInit;

	const duyetDiemLopHocPhanModel = async (type: 'chuyen-vien' | 'quan-ly', idLopHocPhan: string): Promise<any> => {
		if (formSubmiting) return Promise.reject('Form submitting');
		setFormSubmiting(true);

		try {
			const res = await duyetDiemLopHocPhan(type, idLopHocPhan);
			message.success('Duyệt điểm thành công');

			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const huyDuyetDiemLopHocPhanModel = async (idLopHocPhan: string): Promise<any> => {
		if (formSubmiting) return Promise.reject('Form submitting');
		setFormSubmiting(true);

		try {
			const res = await huyDuyetDiemLopHocPhan(idLopHocPhan);
			message.success('Thao tác thành công');

			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const putDiemLopHocPhanModel = async (
		payload: {
			list: { lopHpSvId: string; update: LopHocPhan.IDiemThanhPhan }[];
		},
		isGiangVien?: boolean,
	): Promise<any> => {
		if (formSubmiting) return Promise.reject('Form submitting');
		setFormSubmiting(true);

		try {
			const res = await putDiemLopHocPhan(payload, isGiangVien);
			message.success('Điểm thành phần được cập nhật thành công!');

			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const duyetDiemKTHocPhanModel = async (
		type: 'chuyen-vien' | 'quan-ly',
		maHocPhan: string,
		maHocKy: string,
	): Promise<any> => {
		if (formSubmiting) return Promise.reject('Form submitting');
		setFormSubmiting(true);

		try {
			const res = await duyetDiemKTHocPhan(type, maHocPhan, maHocKy);
			message.success('Duyệt điểm thành công');

			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const putDiemThiModel = async (payload: {
		list: { lopHpSvId: string; diem?: number | null }[];
		loaiNhapDiem: string;
	}): Promise<any> => {
		if (formSubmiting) return Promise.reject('Form submitting');
		setFormSubmiting(true);

		try {
			const res = await putDiemThi(payload);
			message.success('Điểm KTHP được cập nhật thành công!');

			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const getByHocPhanNamHocModel = async (
		ssoId: string,
		params: { maHocPhan?: string; namHocId?: string },
	): Promise<LopHocPhan.IRecordSinhVienLopHP[]> => {
		setLoading(true);
		try {
			const response = await getSinhVienLopHocPhan(ssoId, params);
			const data: LopHocPhan.IRecordSinhVienLopHP[] = response?.data?.data ?? [];
			setDanhSach(data);

			return data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	const getLopHpSvBySinhVienModel = async (ssoId: string): Promise<LopHocPhan.IRecordSinhVienLopHP[]> => {
		setLoading(true);
		try {
			const response = await getLopHpSvBySinhVien(ssoId);
			const data: LopHocPhan.IRecordSinhVienLopHP[] = response?.data?.data?.danhSachLopHocPhan ?? [];

			return data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	return {
		...objInit,
		duyetDiemLopHocPhanModel,
		huyDuyetDiemLopHocPhanModel,
		putDiemLopHocPhanModel,
		duyetDiemKTHocPhanModel,
		putDiemThiModel,
		getByHocPhanNamHocModel,
		getLopHpSvBySinhVienModel,
	};
};
