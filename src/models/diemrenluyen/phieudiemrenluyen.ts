import useInitModel from '@/hooks/useInitModel';
import {
	exportDonKhieuNai,
	exportPhieuTongHop,
	exportThongKe,
	getPhieuTongHop,
	xuLyKhieuNai,
} from '@/services/DiemRenLuyen/PhieuDiemRenLuyen';
import type { ETrangThaiKhieuNai } from '@/services/DiemRenLuyen/PhieuDiemRenLuyen/constants';
import type { PhieuDiemRenLuyen } from '@/services/DiemRenLuyen/PhieuDiemRenLuyen/typing';
import { ipSlink } from '@/utils/ip';
import { message } from 'antd';
import fileDownload from 'js-file-download';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<PhieuDiemRenLuyen.IRecord>('phieu-diem-ren-luyen', undefined, undefined, ipSlink);
	const [recPhieuTongHop, setRecPhieuTongHop] = useState<PhieuDiemRenLuyen.IPhieuTongHop>();
	const { setLoading } = objInit;

	const getPhieuTongHopModel = async (idDotChamDiem: string, tenLopHc: string) => {
		setLoading(true);
		const res = await getPhieuTongHop(idDotChamDiem, tenLopHc);
		setRecPhieuTongHop(res?.data?.data ?? {});
		setLoading(false);
	};

	const exportPhieuTongHopModel = async (idDotChamDiem: string, tenLopHc: string, tenDot: string) => {
		setLoading(true);
		const res = await exportPhieuTongHop(idDotChamDiem, tenLopHc);
		fileDownload(res.data, `PhieuTongHop_${tenLopHc}_${tenDot}.docx`);
		setLoading(false);
	};

	const exportDonKhieuNaiModel = async (idPhieuDiem: string) => {
		setLoading(true);
		const res = await exportDonKhieuNai(idPhieuDiem);
		fileDownload(res.data, 'DonKhieuNai.docx');
		setLoading(false);
	};

	const exportThongKeModel = async (idDotChamDiem: string, tenLopHc?: string) => {
		try {
			setLoading(true);
			const res = await exportThongKe(idDotChamDiem, tenLopHc);
			fileDownload(res.data, `KetQuaRenLuyen_${tenLopHc || 'TatCaLop'}.xlsx`);
			setLoading(false);
		} catch (err) {
			setLoading(false);
		}
	};

	const xuLyKhieuNaiModel = async (
		idPhieuDiem: string,
		payload: {
			diemChamSv?: any;
			diemChamBCS?: any;
			diemChamCV?: any;
			traLoiNoiDungKhieuNai?: string;
			trangThaiXuLyKhieuNai: ETrangThaiKhieuNai;
		},
		getData?: any,
	) => {
		setLoading(true);
		await xuLyKhieuNai(idPhieuDiem, payload);
		message.success('Lưu thành công');
		setLoading(false);
		if (getData) getData();
	};

	return {
		...objInit,
		recPhieuTongHop,
		setRecPhieuTongHop,
		getPhieuTongHopModel,
		exportPhieuTongHopModel,
		exportDonKhieuNaiModel,
		xuLyKhieuNaiModel,
		exportThongKeModel,
	};
};
