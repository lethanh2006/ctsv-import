import useInitModel from '@/hooks/useInitModel';
import { getIdBieuMauDaTraLoi, initBieuMauTracNghiem, traLoiBieuMau } from '@/services/DiemRenLuyen/BieuMau';
import { ELoaiBieuMau } from '@/services/DiemRenLuyen/BieuMau/constants';
import { type BieuMau } from '@/services/DiemRenLuyen/BieuMau/typing';
import {
	getCauTraLoiBieuMau,
	getDiemMinhChung,
	updateTrangThaiPhieuDiem,
} from '@/services/DiemRenLuyen/PhieuDiemRenLuyen';
import type { ETrangThaiDanhGia } from '@/services/DiemRenLuyen/PhieuDiemRenLuyen/constants';
import {
	CTSV_DANH_GIA_PREFIX,
	ENguoiTraLoiDrl,
	ETrangThaiPhieuDiemRL,
} from '@/services/DiemRenLuyen/PhieuDiemRenLuyen/constants';
import type { FormInstance } from 'antd';
import { message } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';

export interface FormDanhGiaValues {
	hoVaTen: string;
	ngaySinh: string;
	chucDanh: string;
	donVi: string;
	hangChuc: string;
	bac: number;
	heSoLuong: number;
	yKienDonVi?: string;
	ketQuaKetLuan?: string;
	ketLuanLanhDao?: string;
	// [`tuDanhGia.${string}`]: number;
	// [`donViDanhGia.${string}`]: number;
}

export default () => {
	const objInit = useInitModel<BieuMau.Record>('khao-sat', undefined, {
		loai: ELoaiBieuMau.KHAO_SAT,
	});
	const { initialState } = useModel('@@initialState');
	const { record: recordDotDanhGia } = useModel('diemrenluyen.dot');

	const { record } = objInit;
	const { setLoading, condition, setVisibleForm, getModel, formSubmiting, setFormSubmiting } = objInit;
	const [listIdBieuMauDaTraLoi, setListIdBieuMauDaTraLoi] = useState<string[]>([]);

	const [isLoadingFormValuesTuDanhGiaVaDonViDanhGia, setIsLoadingFormValuesTuDanhGiaVaDonViDanhGia] = useState(true);
	const [formValuesTuDanhGiaVaDonViDanhGia, setFormValuesTuDanhGiaVaDonViDanhGia] = useState<
		| {
				cauTraLoiTuDanhGia: BieuMau.CauTraLoiBieuMau | undefined;
				cauTraLoiCVHTDanhGia: BieuMau.CauTraLoiBieuMau | undefined;
				cauTraLoiCTSVDanhGia: BieuMau.CauTraLoiBieuMau | undefined;
				cauTraLoiBCSDanhGia: BieuMau.CauTraLoiBieuMau | undefined;
				// thongTinNhanSu: ThongTinNhanSu.IRecord;
				trangThai: ETrangThaiDanhGia;
				yKienDonVi?: string;
				ketQuaKetLuan?: string;
				ketLuanLanhDao?: string;
				_id: string;
				trangThaiNopCoVan: string;
				trangThaiNopSV: string;
				trangThaiPhongCTSV: string;
				trangThaiNopBCS: string;
		  }
		| undefined
	>(undefined);
	const [dataDiemMinhChung, setDataDiemMinhChung] = useState<BieuMau.TraLoiRecord[]>([]);

	const [dangGuiNgay, setDangGuiNgay] = useState(false);
	const getBieuMauUserModel = async (loaiParam?: ELoaiBieuMau) =>
		getModel({ loai: loaiParam }, undefined, undefined, undefined, undefined, 'my/pageable');

	const getIdBieuMauDaTraLoiModel = async () => {
		setLoading(true);
		const response = await getIdBieuMauDaTraLoi(condition?.loai);
		setListIdBieuMauDaTraLoi(response?.data?.data ?? []);
		setLoading(false);
	};

	const initBieuMauTracNghiemModel = async (idDot: string, idKhaoSat: string) => {
		setLoading(true);
		await initBieuMauTracNghiem({ idKhaoSat, idDot });
		setLoading(false);
	};

	const traLoiBieuMauModel = async (
		payload: {
			idKhaoSat: string;
			danhSachTraLoi: BieuMau.TraLoiRecord[];
			idDot: string;
			nguoiTraLoi: ENguoiTraLoiDrl;
			ssoId?: string;
			guiNgay: boolean;
			yKienDonVi?: string;
			ketQuaKetLuan?: string;
			ketLuanLanhDao?: string;
			trangThaiNopSV?: string;
			trangThaiNopCoVan?: string;
			trangThaiPhongCTSV?: string;
			idDotChamDiemRenLuyen?: string;
		},
		messageSuccess = 'Gửi câu trả lời thành công',
	): Promise<any> => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			const res = await traLoiBieuMau(payload);
			message.success(messageSuccess);
			// getIdBieuMauDaTraLoiModel();

			setVisibleForm(false);
			return res.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setFormSubmiting(false);
		}
	};

	const traLoiBieuMauTuDanhGiaDrl = async (
		form: FormInstance<FormDanhGiaValues>,
		guiNgay: boolean,
		ssoIdSinhVien?: string,
		nguoiTraLoi?: ENguoiTraLoiDrl,
	) => {
		const formValues = form.getFieldsValue();
		if (record) {
			setDangGuiNgay(guiNgay);
			if (nguoiTraLoi === ENguoiTraLoiDrl.CTSV) {
				await traLoiBieuMauModel(
					{
						guiNgay,
						nguoiTraLoi: ENguoiTraLoiDrl.CTSV,
						trangThaiPhongCTSV: guiNgay ? ETrangThaiPhieuDiemRL.DA_GUI : ETrangThaiPhieuDiemRL.LUU,
						ssoId: initialState?.currentUser?.ssoId,
						idKhaoSat: record?._id ?? '',
						danhSachTraLoi: Object.keys(formValues)
							.filter((key) => key.startsWith(CTSV_DANH_GIA_PREFIX))
							.map((fieldKey_) => {
								const fieldKey = fieldKey_ as keyof typeof formValues;
								return {
									idCauHoi: fieldKey.replace(CTSV_DANH_GIA_PREFIX, ''),
									traLoiText: formValues[fieldKey]?.toString(),
								};
							}),
						idDotChamDiemRenLuyen: recordDotDanhGia?._id ?? '',
						idDot: recordDotDanhGia?._id ?? '',
					},
					guiNgay ? 'Gửi đánh giá thành công' : 'Lưu đánh giá thành công',
				);
				await updateTrangThaiPhieuDiem(formValuesTuDanhGiaVaDonViDanhGia?._id ?? '', {
					trangThaiPhongCTSV: guiNgay ? ETrangThaiPhieuDiemRL.DA_GUI : ETrangThaiPhieuDiemRL.LUU,
					idDotChamDiemRenLuyen: recordDotDanhGia?._id ?? '',
				});
			}
			setDangGuiNgay(false);
		}
	};

	const handleGetFormValuesTuDanhGiaVaDonViDanhGia = async (idDot: string, nguoiTraLoi: string, ssoId?: string) => {
		setIsLoadingFormValuesTuDanhGiaVaDonViDanhGia(true);
		try {
			const response = await getCauTraLoiBieuMau({ idDot, nguoiTraLoi, ssoId: ssoId });
			const cauTraLoiCuaSinhVien = response.data.data?.diemCham?.find(
				(item) => item.nguoiTraLoi === ENguoiTraLoiDrl.SINH_VIEN,
			);
			const cauTraLoiCuaCVHT = response.data.data?.diemCham?.find(
				(item) => item.nguoiTraLoi === ENguoiTraLoiDrl.CO_VAN_HOC_TAP,
			);
			const cauTraLoiCuaCTSV = response.data.data?.diemCham?.find((item) => item.nguoiTraLoi === ENguoiTraLoiDrl.CTSV);
			const cauTraLoiCuaBcs = response.data.data?.diemCham?.find((item) => item.nguoiTraLoi === ENguoiTraLoiDrl.BCS);
			setFormValuesTuDanhGiaVaDonViDanhGia({
				cauTraLoiCTSVDanhGia: cauTraLoiCuaCTSV ?? cauTraLoiCuaBcs ?? cauTraLoiCuaSinhVien,
				cauTraLoiBCSDanhGia: cauTraLoiCuaBcs ?? cauTraLoiCuaCVHT ?? cauTraLoiCuaSinhVien,
				cauTraLoiCVHTDanhGia: cauTraLoiCuaCVHT ?? cauTraLoiCuaSinhVien,
				cauTraLoiTuDanhGia: cauTraLoiCuaSinhVien,
				// thongTinNhanSu: response.data.data.thongTinNhanSu,
				trangThai: response.data.data?.trangThai,
				ketLuanLanhDao: response.data.data?.ketLuanLanhDao,
				yKienDonVi: response.data.data?.yKienDonVi,
				ketQuaKetLuan: response.data.data?.ketQuaKetLuan,
				_id: response?.data?.data?._id,
				trangThaiNopCoVan: response.data.data?.trangThaiNopCoVan,
				trangThaiNopSV: response.data.data?.trangThaiNopSV,
				trangThaiPhongCTSV: response.data.data?.trangThaiPhongCTSV,
				trangThaiNopBCS: response.data.data?.trangThaiNopBCS,
			});
		} finally {
			setIsLoadingFormValuesTuDanhGiaVaDonViDanhGia(false);
		}
	};

	const handleGetDiemMinhChungDRL = async (idDot: string, ssoId: string) => {
		try {
			const res = await getDiemMinhChung(idDot, ssoId);
			if (res) {
				setDataDiemMinhChung(res?.data?.data);
			}
		} catch (e) {
			console.log(e);
		}
	};

	return {
		...objInit,
		getBieuMauUserModel,
		getIdBieuMauDaTraLoiModel,
		listIdBieuMauDaTraLoi,
		setListIdBieuMauDaTraLoi,
		initBieuMauTracNghiemModel,
		traLoiBieuMauModel,

		formValuesTuDanhGiaVaDonViDanhGia,
		dangGuiNgay,
		setDangGuiNgay,
		traLoiBieuMauTuDanhGiaDrl,
		handleGetFormValuesTuDanhGiaVaDonViDanhGia,
		isLoadingFormValuesTuDanhGiaVaDonViDanhGia,
		handleGetDiemMinhChungDRL,
		dataDiemMinhChung,
	};
};
