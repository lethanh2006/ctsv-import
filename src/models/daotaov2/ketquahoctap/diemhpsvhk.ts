import useInitModel from '@/hooks/useInitModel';
import {
	getSinhVienHocPhanHocKy,
	thongKeDiemPLOSinhVien,
	toggleSkipDiemHpSvHk,
} from '@/services/DaoTaoV2/DanhMucHeThong/ChuongTrinhDaoTao';
import { ChuongTrinhDaoTao } from '@/services/DaoTaoV2/DanhMucHeThong/ChuongTrinhDaoTao/typings';
import { getSinhVienHocPhanNamHoc } from '@/services/DaoTaoV2/HocKy/LopHocPhan';
import type { LopHocPhan } from '@/services/DaoTaoV2/HocKy/LopHocPhan/typing';
import { ipDaoTao } from '@/utils/ip';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<LopHocPhan.IDiemHpSvHk>('diem-hp-sv-hk', undefined, undefined, ipDaoTao);
	const { setLoading, setDanhSach, formSubmiting, setFormSubmiting } = objInit;
	const [thongKePLO, setThongKePLO] = useState<ChuongTrinhDaoTao.TThongKePloSinhVien>();

	const getByHocPhanNamHocModel = async (
		ssoId: string,
		params: { maHocPhan?: string; namHocId?: string; maKhoaNganh?: string },
	): Promise<LopHocPhan.IDiemHpSvHk[]> => {
		setLoading(true);
		try {
			const response = await getSinhVienHocPhanNamHoc(ssoId, params);
			const data: LopHocPhan.IDiemHpSvHk[] = response?.data?.data ?? [];
			setDanhSach(data);

			return data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	const thongKeDiemPLOSinhVienModel = async (
		maKhoaNganh: string,
		ssoId: string,
	): Promise<ChuongTrinhDaoTao.TThongKePloSinhVien> => {
		setLoading(true);
		try {
			const response = await thongKeDiemPLOSinhVien(maKhoaNganh, ssoId);
			const data: ChuongTrinhDaoTao.TThongKePloSinhVien = response?.data?.data ?? [];
			setThongKePLO(data);
			return data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	const getByKhoaNganhModel = async (
		ssoId: string,
		maKhoaNganh: string,
		params: { namHocId?: string; maHocKy?: string },
	): Promise<LopHocPhan.IDiemHpSvHk[]> => {
		setLoading(true);
		try {
			const response = await getSinhVienHocPhanHocKy(ssoId, maKhoaNganh, params);
			const data: LopHocPhan.IDiemHpSvHk[] = response?.data?.data ?? [];
			setDanhSach(data);

			return data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	const toggleSkipModel = async (diemHpSvHkId: string): Promise<LopHocPhan.IDiemHpSvHk> => {
		if (formSubmiting) return Promise.reject('form submiting');
		setFormSubmiting(true);
		try {
			const res = await toggleSkipDiemHpSvHk(diemHpSvHkId);
			message.success('Cập nhật thành công');
			return res.data?.data;
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		...objInit,
		getByHocPhanNamHocModel,
		thongKePLO,
		thongKeDiemPLOSinhVienModel,
		getByKhoaNganhModel,
		toggleSkipModel,
	};
};
