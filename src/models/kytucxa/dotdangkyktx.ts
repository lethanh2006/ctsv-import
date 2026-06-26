import useInitModel from '@/hooks/useInitModel';
import { thongKeDotTongQuanKTX, thongKeDotChiTietKTX } from '@/services/KyTucXa';
import type { DotDangKyKTX } from '@/services/KyTucXa/DotDangKy/typing';
import axios from '@/utils/axios';
import { ipCsvc } from '@/utils/ip';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<DotDangKyKTX.IRecord>('dot-dang-ky-ky-tuc-xa', undefined, undefined, ipCsvc);

	const [loadingTongQuan, setLoadingTongQuan] = useState<boolean>(false);
	const [dataTongQuan, setDataTongQuan] = useState<DotDangKyKTX.IThongKeDotTongQuan>();

	const [loadingChiTiet, setLoadingChiTiet] = useState<boolean>(false);
	const [dataChiTiet, setDataChiTiet] = useState<DotDangKyKTX.IThongKeDotChiTiet>();

	const thongKeDotTongQuanKTXModel = async (condition?: any): Promise<DotDangKyKTX.IThongKeDotTongQuan> => {
		setLoadingTongQuan(true);
		try {
			const res = await thongKeDotTongQuanKTX(condition);
			setDataTongQuan(res.data?.data);
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoadingTongQuan(false);
		}
	};

	const thongKeDotChiTietKTXModel = async (condition?: any): Promise<any> => {
		setLoadingChiTiet(true);
		try {
			const res = await thongKeDotChiTietKTX(condition);
			setDataChiTiet(res.data?.data);
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoadingChiTiet(false);
		}
	};

	const postSinhVienDangKy = (
		dotId: string,
		danhSachMaSinhVien: { maSinhVien: string; hoTen: string; khoaSinhVien: string }[],
		headers?: any,
	) => {
		const payloadList = (danhSachMaSinhVien || []).map((item) => ({
			maSinhVien: item.maSinhVien,
			hoTen: item.hoTen || '',
			khoaSinhVien: item.khoaSinhVien || '',
		}));
		return axios.post(
			`${ipCsvc}/dot-dang-ky-ky-tuc-xa/${dotId}/sinh-vien-dang-ky`,
			{ danhSachMaSinhVien: payloadList },
			{ headers },
		);
	};
	const getSinhVienDangKy = (dotId: string, headers?: any) => {
		return axios.get(`${ipCsvc}/dot-dang-ky-ky-tuc-xa/${dotId}/sinh-vien-dang-ky`, { headers });
	};
	const deleteSinhVienDangKy = (dotId: string, id: string, headers?: any) => {
		return axios.delete(`${ipCsvc}/dot-dang-ky-ky-tuc-xa/${dotId}/sinh-vien-dang-ky/${id}`, { headers });
	};

	const postPhatHanhKTX = (dotId: string, headers?: any) => {
		return axios.post(`${ipCsvc}/dot-dang-ky-ky-tuc-xa/${dotId}/phat-hanh`, { headers });
	}
	return {
		...objInit,
		postSinhVienDangKy,
		getSinhVienDangKy,
		deleteSinhVienDangKy,
		postPhatHanhKTX,
		thongKeDotTongQuanKTXModel,
		thongKeDotChiTietKTXModel,
		loadingTongQuan,
		dataTongQuan,
		loadingChiTiet,
		dataChiTiet
	};
};
