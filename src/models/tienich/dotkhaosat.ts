import { EOperatorType } from '@/components/Table/constant';
import useInitModel from '@/hooks/useInitModel';
import { type BieuMau } from '@/services/TienIch/BieuMau/typings';
import {
	dotKhaoSatThongKeTongHop,
	getDotKhaoSatThongKe,
	kichHoatDotKhaoSat,
	thongKeDanhGiaGiangVien,
} from '@/services/TienIch/DotKhaoSat';
import { type DotKhaoSat } from '@/services/TienIch/DotKhaoSat/typing';
import { ELoaiDot } from '@/services/TienIch/constant';
import { ipSlink } from '@/utils/ip';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<DotKhaoSat.IRecord>('dot-khao-sat', undefined, undefined, ipSlink);
	const { getModel, setLoading } = objInit;
	const [thongKe, setThongKe] = useState<BieuMau.ThongKe>();

	const [visibleViewThongKe, setVisibleViewThongKe] = useState<boolean>(false);
	const [recordViewThongKe, setRecordViewThongKe] = useState<DotKhaoSat.IDanhSachChiTiet>();
	const [dataThongKe, setDataThongKe] = useState<DotKhaoSat.IThongKe>();
	const [dataThongKeGiangVien, setDataThongKeGiangVien] = useState<DotKhaoSat.IThongKeGiangVien[]>([]);
	const [recordThongKeGiangVien, setRecordThongKeGiangVien] = useState<DotKhaoSat.IThongKeGiangVien>();

	const getDotMeModel = () =>
		getModel(
			{ kichHoat: true },
			[
				{
					active: true,
					field: 'loai',
					operator: EOperatorType.EQUAL,
					values: [ELoaiDot.BIEU_MAU],
				},
			],
			{ thoiGianKetThuc: -1 },
			undefined,
			undefined,
			'my/page',
			undefined,
		);

	const kichHoatBieuMauModel = async (payload: { id: string; data: { kichHoat: boolean } }, getData?: () => void) => {
		await kichHoatDotKhaoSat(payload);
		message.success('Xử lý thành công');
		if (getData) {
			getData();
		} else {
			getModel();
		}
	};
	const getDataThongKe = async (isDonVi?: boolean) => {
		try {
			const res = await dotKhaoSatThongKeTongHop(isDonVi);
			if (res) {
				setDataThongKe(res?.data?.data);
			}
		} catch (e) {
			console.log(e);
		}
	};
	const getBieuMauThongKeModel = async (id: string) => {
		setLoading(true);
		try {
			const response = await getDotKhaoSatThongKe({ id });
			setThongKe(response?.data?.data ?? {});

			return response.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	const thongKeDanhGiaGiangVienModel = async (idDot: string): Promise<any> => {
		setLoading(true);

		try {
			const res = await thongKeDanhGiaGiangVien(idDot);
			setDataThongKeGiangVien(res.data?.data);
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoading(false);
		}
	};

	return {
		...objInit,
		dataThongKeGiangVien,
		thongKe,
		setThongKe,
		getDataThongKe,
		kichHoatBieuMauModel,
		dataThongKe,
		setDataThongKe,
		getBieuMauThongKeModel,
		recordViewThongKe,
		visibleViewThongKe,
		setVisibleViewThongKe,
		setRecordViewThongKe,
		thongKeDanhGiaGiangVienModel,
		recordThongKeGiangVien,
		setRecordThongKeGiangVien,
		getDotMeModel,
	};
};
