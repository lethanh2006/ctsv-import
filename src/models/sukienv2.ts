import useInitModel from '@/hooks/useInitModel';
import { locationPathMappingToESuKienType } from '@/services/SuKien/constant';
import { getQRDangKy, getQRThamGia, getThongKeSuKien, getThongTinSuKien, thongKeKhaoSat } from '@/services/SuKienV2';
import type { SuKienV2 } from '@/services/SuKienV2/typings';
import type { BieuMau } from '@/services/TienIch/BieuMau/typings';
import dayjs from 'dayjs';
import { last } from 'lodash';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<SuKienV2.IRecord>('su-kien/admin');

	const { getModel, handleView, setRecord, setVisibleForm, setEdit } = objInit;

	const [thongKeTheoNamData, setThongKeTheoNamData] = useState<SuKienV2.ThongKeTheoNam | undefined>(undefined);
	const [isLoadingThongKeTheoNam, setIsLoadingThongKeTheoNam] = useState(false);

	const [thongKeTheoSuKienData, setThongKeTheoSuKienData] = useState<SuKienV2.ThongKeTheoSuKien | undefined>(undefined);
	const [isLoadingThongKeTheoSuKien, setIsLoadingThongKeTheoSuKien] = useState(false);

	const [isLoadingThongTinSuKien, setIsLoadingThongTinSuKien] = useState(true);
	const [thongTinSuKien, setThongTinSuKien] = useState<SuKienV2.ThongTinSukien | undefined>(undefined);
	const [maQRSuKien, setMaQRSuKien] = useState<SuKienV2.IRecordMaQR>();

	const [isVisibleFormDetail, setIsVisibleFormDetail] = useState(false);

	const [isVisibleThongKe, setIsVisibleThongKe] = useState(false);

	const [editKinhPhi, setEditKinhPhi] = useState(false);
	const [recordKinhPhi, setRecordKinhPhi] = useState<SuKienV2.IKinhPhiDuTru>();
	const [dataKinhPhi, setDataKinhPhi] = useState<SuKienV2.IKinhPhiDuTru[]>([]);

	const [dataThongKeKhaoSat, setDataThongKeKhaoSat] = useState<BieuMau.ThongKe>();

	const getSuKienType = () => {
		const suKienType = last(window.location.pathname.split('/')) ?? '';
		return locationPathMappingToESuKienType[suKienType];
	};

	const getThongKeSuKienTheoNam = async () => {
		setThongKeTheoNamData(undefined);
		setIsLoadingThongKeTheoNam(true);
		try {
			// const response = await getThongKeSuKien({ nam: '2023', loaiSuKien: getSuKienType() });
			const response = await getThongKeSuKien({ nam: dayjs().year() });
			setThongKeTheoNamData(response.data?.data as SuKienV2.ThongKeTheoNam);
		} finally {
			setIsLoadingThongKeTheoNam(false);
		}
	};

	const getThongKeSuKienSuKien = async (id: SuKienV2.IRecord['_id']) => {
		setThongKeTheoSuKienData(undefined);
		setIsLoadingThongKeTheoSuKien(true);
		try {
			// const response = await getThongKeSuKien({ idSuKien: id, loaiSuKien: getSuKienType() });
			const response = await getThongKeSuKien({ idSuKien: id });
			setThongKeTheoSuKienData(response.data?.data as SuKienV2.ThongKeTheoSuKien);
		} finally {
			setIsLoadingThongKeTheoSuKien(false);
		}
	};

	const getModel_: typeof getModel = (
		paramCondition,
		filterParams,
		sortParam,
		paramPage,
		paramLimit,
		_path,
		otherQuery,
		isSetDanhSach,
		_isAbsolutePath,
	) => {
		getThongKeSuKienTheoNam();
		return getModel(
			// { ...paramCondition, loaiSuKien: getSuKienType() },
			{ ...paramCondition },
			filterParams,
			sortParam,
			paramPage,
			paramLimit,
			'su-kien/page',
			otherQuery,
			isSetDanhSach,
			true,
		);
	};

	const handleGetThongTinSuKien = async (id: string) => {
		setIsLoadingThongTinSuKien(true);
		try {
			const response = await getThongTinSuKien(id);
			setThongTinSuKien(response.data?.data);
		} finally {
			setIsLoadingThongTinSuKien(false);
		}
	};

	const handleGetQRSuKien = async (id: string, type: string) => {
		setIsLoadingThongTinSuKien(true);
		try {
			const response = await (type === 'Đăng ký' ? getQRDangKy(id) : getQRThamGia(id));
			setMaQRSuKien(response.data?.data);
		} finally {
			setIsLoadingThongTinSuKien(false);
		}
	};

	const handleView_: typeof handleView = (rec) => {
		setEdit(false);
		setIsVisibleFormDetail(true);
		setVisibleForm(false);
		setRecord(rec);
	};

	const handleViewThongKe: typeof handleView = (rec) => {
		setRecord(rec);
		setEdit(false);
		setIsVisibleThongKe(true);
		setVisibleForm(false);
		if (rec?._id) {
			getThongKeSuKienSuKien(rec?._id);
		}
	};

	const handleGetThongKeKhaoSat = async (idKhaoSat: string, idSuKien: string, loai: string) => {
		try {
			const res = await thongKeKhaoSat(idKhaoSat, idSuKien, loai);
			if (res) {
				setDataThongKeKhaoSat(res?.data?.data);
			}
		} catch (e) {
			console.log(e);
		}
	};

	return {
		...objInit,
		thongKeTheoNamData,
		isLoadingThongKeTheoNam,
		getModel: getModel_,
		getSuKienType,
		setIsVisibleFormDetail,
		isVisibleFormDetail,
		handleView: handleView_,
		getThongTinSuKien: handleGetThongTinSuKien,
		isLoadingThongTinSuKien,
		thongTinSuKien,
		handleViewThongKe,
		isVisibleThongKe,
		setIsVisibleThongKe,
		isLoadingThongKeTheoSuKien,
		thongKeTheoSuKienData,
		editKinhPhi,
		setEditKinhPhi,
		recordKinhPhi,
		setRecordKinhPhi,
		dataKinhPhi,
		setDataKinhPhi,
		handleGetQRSuKien,
		maQRSuKien,
		handleGetThongKeKhaoSat,
		dataThongKeKhaoSat,
	};
};
