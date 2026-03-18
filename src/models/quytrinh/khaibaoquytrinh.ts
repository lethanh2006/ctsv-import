import useInitModel from '@/hooks/useInitModel';
import {
	exportMauDonTheoBuoc,
	exportMauTraKetQuaTheoBuoc,
	traKetQua,
} from '@/services/QuyTrinhDong/KhaiBaoQuyTrinh/khaibaoquytrinh';
import type { KhaiBaoQuyTrinh } from '@/services/QuyTrinhDong/KhaiBaoQuyTrinh/typings';
import { ELoaiTinhTrangDon } from '@/services/QuyTrinhDong/constant';
import type { QuyTrinh } from '@/services/QuyTrinhDong/typings';
import { message } from 'antd';
import fileDownload from 'js-file-download';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<KhaiBaoQuyTrinh.IRecord>('don-quy-trinh-dong');
	const { setLoading, getModel } = objInit;
	const [current, setCurrent] = useState<KhaiBaoQuyTrinh.IBuocXuLy>();
	const [currentFormKhaiBao, setCurrentFormKhaiBao] = useState<KhaiBaoQuyTrinh.IDanhSachForm>();
	const [recordFormKhaiBao, setRecordFormKhaiBao] = useState<any>();
	const [visibleFormQuyTrinh, setVisibleFormQuyTrinh] = useState<boolean>(false);
	const [editFormKhaiBao, setEditFormKhaiBao] = useState<boolean>(false);
	const [visibleFormKhaiBaoQuyTrinh, setVisibleFormKhaiBaoQuyTrinh] = useState<boolean>(false);
	const [dataQuyTrinh, setDataQuyTrinh] = useState<KhaiBaoQuyTrinh.IRecord>();
	const [loaiTinhTrangDon, setLoaiTinhTrangDon] = useState<ELoaiTinhTrangDon>(ELoaiTinhTrangDon.TAT_CA);
	const [maBuoc, setMaBuoc] = useState<string>();
	const [selectedIdsMauTiepNhan, setSelectedIdsMauTiepNhan] = useState<string[]>([]);

	//lay id quy trinh selected trong dieu phoi va xu ly don quy trinh
	const [quyTrinhSelect, setQuyTrinhSelect] = useState<QuyTrinh.IRecord>();
	const getDataKhaiBaoUser = async () => getModel(undefined, undefined, undefined, undefined, undefined, 'user/page');
	const getQuyTrinhChuyenVienModel = async (
		loaiXuLyDon: string,
		otherQuery?: any,
	): Promise<KhaiBaoQuyTrinh.IRecord[]> => {
		try {
			setLoading(true);
			let dataDanhSach: KhaiBaoQuyTrinh.IRecord[] = [];
			await getModel(
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				`chuyen-vien/page/loai-xu-ly-don/${loaiXuLyDon}/${
					[ELoaiTinhTrangDon.CAN_XU_LY, ELoaiTinhTrangDon.TAT_CA].includes(loaiTinhTrangDon)
						? loaiTinhTrangDon
						: ELoaiTinhTrangDon.TAT_CA
				}`,
				otherQuery,
			).then((data) => {
				dataDanhSach = data;
			});
			return dataDanhSach;
		} catch (e) {
			console.log(e);
			return [];
		} finally {
			setLoading(false);
		}
	};

	const exportMauDonTheoBuocModel = async (idDon: string, maBuocParam: string, tenDon: string) => {
		try {
			setLoading(true);
			const res = await exportMauDonTheoBuoc(idDon, maBuocParam);
			fileDownload(res.data, `${tenDon}.doc`);
			setLoading(false);
		} catch (err) {
			setLoading(false);
		}
	};

	const exportMauTraKetQuaTheoBuocModel = async (idDon: string, maBuocParam: string, tenDon: string) => {
		try {
			setLoading(true);
			const res = await exportMauTraKetQuaTheoBuoc(idDon, maBuocParam);
			fileDownload(res.data, `${tenDon}.doc`);
			setLoading(false);
		} catch (err) {
			setLoading(false);
		}
	};

	const traKetQuaModel = async (idDon: string, getData: any) => {
		setLoading(true);
		await traKetQua(idDon);
		message.success('Xử lý thành công');
		getData();
	};

	return {
		...objInit,
		current,
		setCurrent,
		dataQuyTrinh,
		setDataQuyTrinh,
		visibleFormQuyTrinh,
		setVisibleFormQuyTrinh,
		visibleFormKhaiBaoQuyTrinh,
		setVisibleFormKhaiBaoQuyTrinh,
		currentFormKhaiBao,
		setCurrentFormKhaiBao,
		getQuyTrinhChuyenVienModel,
		recordFormKhaiBao,
		setRecordFormKhaiBao,
		setEditFormKhaiBao,
		editFormKhaiBao,
		getDataKhaiBaoUser,
		loaiTinhTrangDon,
		setLoaiTinhTrangDon,
		exportMauDonTheoBuocModel,
		exportMauTraKetQuaTheoBuocModel,
		traKetQuaModel,
		quyTrinhSelect,
		setQuyTrinhSelect,
		maBuoc,
		setMaBuoc,
		setSelectedIdsMauTiepNhan,
		selectedIdsMauTiepNhan,
	};
};
