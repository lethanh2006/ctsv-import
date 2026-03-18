import useInitModel from '@/hooks/useInitModel';
import {
	getMoodleLopHocPhan,
	getThongKeTrangThaiDiemLop,
	getThongKeTrangThaiDuyetGiangDay,
	initLopHocPhan,
	initLopHocPhanTheoNhuCau,
	putTrangThaiDuyetGiangDayLHP,
} from '@/services/DaoTaoV2/HocKy/LopHocPhan';
import { type LopHocPhan } from '@/services/DaoTaoV2/HocKy/LopHocPhan/typing';
import {
	ELoaiLopHocPhan,
	ETrangThaiLopHocPhan,
	type ETrangThaiDiemLop,
	type ETrangThaiDuyetGiangDay,
} from '@/services/DaoTaoV2/HocKy/constant';
import { ipDaoTao } from '@/utils/ip';
import { chuanHoaObject } from '@/utils/utils';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<LopHocPhan.IRecord>('lop-hoc-phan', undefined, undefined, ipDaoTao, { ten: 1 });
	const [thongKeTrangThaiDiemLop, setThongKeTrangThaiDiemLop] = useState<Record<ETrangThaiDiemLop, number>>();
	const [thongKeTrangThaiDuyetGiangDay, setThongKeTrangThaiDuyetGiangDay] =
		useState<Record<ETrangThaiDuyetGiangDay, number>>();
	const { formSubmiting, setFormSubmiting, setLoading, setVisibleForm, putService, danhSach } = objInit;
	const [danhSachXepLich, setDanhSachXepLich] = useState<LopHocPhan.IRecord[]>([]);

	const initLopHocPhanModel = async (payload: { hocKyId: string; config: LopHocPhan.TInitConfig[] }) => {
		if (formSubmiting) return;
		setFormSubmiting(true);

		try {
			const res = await initLopHocPhan(chuanHoaObject(payload));
			message.success('Khởi tạo thành công');

			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const initLopHocPhanTheoNhuCauModel = async (maHocKy: string) => {
		if (formSubmiting) return;
		setFormSubmiting(true);

		try {
			const res = await initLopHocPhanTheoNhuCau(maHocKy);
			message.success('Khởi tạo thành công');

			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const getThongKeTrangThaiDiemLopModel = async (condition: Partial<LopHocPhan.IRecord>): Promise<any> => {
		setLoading(true);

		try {
			const res = await getThongKeTrangThaiDiemLop({ condition });
			setThongKeTrangThaiDiemLop(res.data?.data);

			return res.data?.data;
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setLoading(false);
		}
	};

	const getMoodleLopHocPhanModel = async (lopHocPhanId: string): Promise<any> => {
		setLoading(true);

		try {
			const res = await getMoodleLopHocPhan(lopHocPhanId);

			return res.data?.data;
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setLoading(false);
		}
	};

	const getThongKeTrangThaiDuyetGiangDayModel = async (condition: Partial<LopHocPhan.IRecord>): Promise<any> => {
		setLoading(true);

		try {
			const res = await getThongKeTrangThaiDuyetGiangDay({ condition });
			setThongKeTrangThaiDuyetGiangDay(res.data?.data);

			return res.data?.data;
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Duyệt trạng thái phân công giảng dạy cho các lớp tín chỉ, theo học phần hoặc theo học kỳ
	 * @param maHocKy Mã học kỳ
	 * @param payload Trạng thái duyệt. Nếu có `lopHocPhanIds` thì duyệt theo `lopHocPhanIds` hoặc theo `maHocPhan` hoặc `Duyệt all`
	 * @returns
	 */
	const duyetGiangDayLopHocPhanModel = async (
		maHocKy: string,
		payload: { trangThaiDuyetGiangDay: ETrangThaiDuyetGiangDay; maHocPhan?: string; lopHocPhanIds?: string[] },
	): Promise<any> => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);

		try {
			const res = await putTrangThaiDuyetGiangDayLHP(maHocKy, payload);
			message.success('Duyệt thành công');
			setVisibleForm(false);

			getThongKeTrangThaiDuyetGiangDayModel({
				maHocKy,
				maHocPhan: payload.maHocPhan,
				loai: ELoaiLopHocPhan.CHINH,
				trangThaiLop: ETrangThaiLopHocPhan.MO,
			});
			return res.data?.data;
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setFormSubmiting(false);
		}
	};

	const updateCauHinh = async (lopHocPhanId: string, tuans: number[], tiet?: number) => {
		const lop = danhSach.find((item) => item._id === lopHocPhanId);
		if (lop?._id) {
			const soTiet = tiet ?? Math.round(45 / tuans.length);
			let cauHinh = (lop.cauHinhTkb ?? []).filter((ch) => ch.tuan && !tuans.includes(ch.tuan));
			if (soTiet) cauHinh = cauHinh.concat(tuans.map((tuan) => ({ soTiet, tuan })));
			return putService(lop._id, { cauHinhTkb: cauHinh });
		}
		return Promise.reject();
	};

	const updateCauHinhTKBModel = async (tuans: number[], lopHocPhanIds: string[], soTiet?: number): Promise<any> => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);

		try {
			const promises = lopHocPhanIds.map((item) => updateCauHinh(item, tuans, soTiet));
			const res = await Promise.allSettled(promises);
			message.success('Lưu thành công');

			return res;
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		...objInit,
		initLopHocPhanModel,
		initLopHocPhanTheoNhuCauModel,
		getThongKeTrangThaiDiemLopModel,
		thongKeTrangThaiDiemLop,
		getMoodleLopHocPhanModel,
		duyetGiangDayLopHocPhanModel,
		thongKeTrangThaiDuyetGiangDay,
		getThongKeTrangThaiDuyetGiangDayModel,
		updateCauHinhTKBModel,
		danhSachXepLich,
		setDanhSachXepLich,
	};
};
