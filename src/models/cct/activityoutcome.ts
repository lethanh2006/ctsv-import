import useInitModel from '@/hooks/useInitModel';
import {
	getAnalyticsApprovers,
	getAnalyticsStaff,
	putApproveActivity,
	thongKeHeatmap,
	thongKePhanBoHoatDong,
	thongKePhanBoLevel,
	thongKePhanBoVaiTro,
	thongKeSinhVien,
	thongKeThoiGianDuyet,
	thongKeTiLeHoanThanh,
	thongKeTiLePhanBoVali,
	thongKeTopHoatDong,
} from '@/services/CCT/ActivityOutcome';
import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import { EApprovalStatus } from '@/services/CCT/constant';
import { ipCCT } from '@/utils/ip';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<ActivityOutCome.IRecord>('activity-outcome', undefined, undefined, ipCCT);
	const { formSubmiting, setFormSubmiting } = objInit;
	const [loadingThongKe, setLoadingThongKe] = useState<boolean>(false);
	const [dataThongKe, setDataThongKe] = useState<ActivityOutCome.IAnalyticsStaff>();
	const [dataThongKeApprovers, setDataThongKeAppreovers] = useState<ActivityOutCome.IAnalyticsApprovers>();
	const [loadingThongKeApprovers, setLoadingThongKeApprovers] = useState<boolean>(false);

	const [visibleChangeStatus, setVisibleChangeStatus] = useState<boolean>(false);
	const [visibleXuLy, setVisibleXuLy] = useState<boolean>(false);
	const [visibleImpact, setVisibleImpact] = useState<boolean>(false);

	const [loadingThoiGianDuyet, setLoadingThoiGianDuyet] = useState<boolean>(false);
	const [dataThongKeThoiGianDuyet, setDataThongKeThoiGianDuyet] = useState<ActivityOutCome.IThongKeThoiGianDuyet>();

	const [loadingTiLeHoanThanh, setLoadingTiLeHoanThanh] = useState<boolean>(false);
	const [dataThongKeTiLeHoanThanh, setDataThongKeTiLeHoanThanh] = useState<ActivityOutCome.IThongKeTiLeHoanThanh>();

	const [loadingPhanBoLevel, setLoadingPhanBoLevel] = useState<boolean>(false);
	const [dataThongKePhanBoLevel, setDataThongKePhanBoLevel] = useState<ActivityOutCome.IThongKePhanBoLevel[]>([]);

	const [loadingPhanBoVali, setLoadingPhanBoVali] = useState<boolean>(false);
	const [dataThongKePhanBoVali, setDataThongKePhanBoVali] = useState<ActivityOutCome.IThongKePhanBoVali[]>([]);

	const [loadingHeatmap, setLoadingHeatmap] = useState<boolean>(false);
	const [dataThongKeHeatmap, setDataThongKeHeatmap] = useState<ActivityOutCome.IThongKeHeatmap[]>([]);

	const [loadingPhanBoHoatDong, setLoadingPhanBoHoatDong] = useState<boolean>(false);
	const [dataThongKePhanBoHoatDong, setDataThongKePhanBoHoatDong] = useState<ActivityOutCome.IThongKePhanBoHoatDong[]>(
		[],
	);

	const [loadingPhanBoVaiTro, setLoadingPhanBoVaiTro] = useState<boolean>(false);
	const [dataThongKePhanBoVaiTro, setDataThongKePhanBoVaiTro] = useState<ActivityOutCome.IThongKePhanBoVaiTro[]>([]);

	const [loadingSinhVien, setLoadingSinhVien] = useState<boolean>(false);
	const [dataThongKeSinhVien, setDataThongKeSinhVien] = useState<ActivityOutCome.IThongKeSinhVien>();

	const [loadingTopHoatDong, setLoadingTopHoatDong] = useState<boolean>(false);
	const [dataThongKeTopHoatDong, setDataThongKeTopHoatDong] = useState<ActivityOutCome.IThongKeTopHoatDong[]>([]);

	const putApproveActivityModel = async (
		idActivity: string,
		payLoad: {
			workflow: EApprovalStatus;
			activityRejectionNote?: string;
			revisionNote?: string;
			dueDate?: Date;
		},
		getData?: () => void,
		messageText?: string,
	): Promise<ActivityOutCome.IRecord> => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			const res = await putApproveActivity(idActivity, payLoad);
			message.success(messageText ?? 'Lưu thành công');

			if (getData) getData();
			return res.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setFormSubmiting(false);
		}
	};

	const getAnalyticsStaffModel = async (): Promise<ActivityOutCome.IAnalyticsStaff> => {
		setLoadingThongKe(true);
		try {
			const res = await getAnalyticsStaff();
			setDataThongKe(res.data?.data);
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoadingThongKe(false);
		}
	};

	const getAnalyticsApproversModel = async (): Promise<ActivityOutCome.IAnalyticsStaff> => {
		setLoadingThongKeApprovers(true);
		try {
			const res = await getAnalyticsApprovers();
			setDataThongKeAppreovers(res.data?.data);
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoadingThongKeApprovers(false);
		}
	};

	const thongKeThoiGianDuyetModel = async (): Promise<ActivityOutCome.IThongKeThoiGianDuyet> => {
		setLoadingThoiGianDuyet(true);
		try {
			const res = await thongKeThoiGianDuyet();
			setDataThongKeThoiGianDuyet(res.data?.data);
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoadingThoiGianDuyet(false);
		}
	};

	const thongKeTiLeHoanThanhModel = async (): Promise<ActivityOutCome.IThongKeTiLeHoanThanh> => {
		setLoadingTiLeHoanThanh(true);
		try {
			const res = await thongKeTiLeHoanThanh();
			setDataThongKeTiLeHoanThanh(res.data?.data);
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoadingTiLeHoanThanh(false);
		}
	};

	const thongKePhanBoLevelModel = async (): Promise<ActivityOutCome.IThongKePhanBoLevel> => {
		setLoadingPhanBoLevel(true);
		try {
			const res = await thongKePhanBoLevel();
			setDataThongKePhanBoLevel(res.data?.data?.levels);
			return res.data?.data?.levels;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoadingPhanBoLevel(false);
		}
	};

	const thongKeTiLePhanBoValiModel = async (): Promise<ActivityOutCome.IThongKePhanBoVali> => {
		setLoadingPhanBoVali(true);
		try {
			const res = await thongKeTiLePhanBoVali();
			setDataThongKePhanBoVali(res.data?.data?.validations);
			return res.data?.data?.validations;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoadingPhanBoVali(false);
		}
	};

	const thongKeHeatmapModel = async (): Promise<ActivityOutCome.IThongKeHeatmap> => {
		setLoadingHeatmap(true);
		try {
			const res = await thongKeHeatmap();
			setDataThongKeHeatmap(res.data?.data?.attributes);
			return res.data?.data?.attributes;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoadingHeatmap(false);
		}
	};

	const thongKePhanBoHoatDongModel = async (): Promise<ActivityOutCome.IThongKePhanBoHoatDong> => {
		setLoadingPhanBoHoatDong(true);
		try {
			const res = await thongKePhanBoHoatDong();
			setDataThongKePhanBoHoatDong(res.data?.data?.activityTypes);
			return res.data?.data?.activityTypes;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoadingPhanBoHoatDong(false);
		}
	};

	const thongKePhanBoVaiTroModel = async (): Promise<ActivityOutCome.IThongKePhanBoVaiTro> => {
		setLoadingPhanBoVaiTro(true);
		try {
			const res = await thongKePhanBoVaiTro();
			setDataThongKePhanBoVaiTro(res.data?.data?.roles);
			return res.data?.data?.roles;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoadingPhanBoVaiTro(false);
		}
	};

	const thongKeSinhVienModel = async (): Promise<ActivityOutCome.IThongKeSinhVien> => {
		setLoadingSinhVien(true);
		try {
			const res = await thongKeSinhVien();
			setDataThongKeSinhVien(res.data?.data);
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoadingSinhVien(false);
		}
	};

	const thongKeTopHoatDongModel = async (): Promise<ActivityOutCome.IThongKeTopHoatDong> => {
		setLoadingTopHoatDong(true);
		try {
			const res = await thongKeTopHoatDong();
			setDataThongKeTopHoatDong(res.data?.data?.topActivities);
			return res.data?.data?.topActivities;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoadingTopHoatDong(false);
		}
	};

	return {
		...objInit,
		dataThongKe,
		loadingThongKe,
		putApproveActivityModel,
		getAnalyticsStaffModel,
		dataThongKeApprovers,
		loadingThongKeApprovers,
		getAnalyticsApproversModel,
		visibleChangeStatus,
		setVisibleChangeStatus,
		visibleXuLy,
		setVisibleXuLy,
		visibleImpact,
		setVisibleImpact,

		loadingThoiGianDuyet,
		dataThongKeThoiGianDuyet,
		thongKeThoiGianDuyetModel,

		loadingTiLeHoanThanh,
		dataThongKeTiLeHoanThanh,
		thongKeTiLeHoanThanhModel,

		loadingPhanBoLevel,
		dataThongKePhanBoLevel,
		thongKePhanBoLevelModel,

		loadingPhanBoVali,
		dataThongKePhanBoVali,
		thongKeTiLePhanBoValiModel,

		loadingHeatmap,
		dataThongKeHeatmap,
		thongKeHeatmapModel,

		loadingPhanBoHoatDong,
		dataThongKePhanBoHoatDong,
		thongKePhanBoHoatDongModel,

		loadingPhanBoVaiTro,
		dataThongKePhanBoVaiTro,
		thongKePhanBoVaiTroModel,

		loadingSinhVien,
		dataThongKeSinhVien,
		thongKeSinhVienModel,

		loadingTopHoatDong,
		dataThongKeTopHoatDong,
		thongKeTopHoatDongModel,
	};
};
