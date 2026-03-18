import useInitModel from '@/hooks/useInitModel';
import type { LoaiHinh } from '@/services/QuyTrinhDong/LoaiHinh/typing';
import { DoiTuong } from '@/services/QuyTrinhDong/constant';
import {
	activeQuyTrinhDong,
	getAllQuyTrinhChiuTrachNhiem,
	getDanhSachCanBoXuLy,
	getQuyTrinhChuyenVien,
} from '@/services/QuyTrinhDong/quytrinh';
import type { QuyTrinh } from '@/services/QuyTrinhDong/typings';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<QuyTrinh.IRecord>('quy-trinh-dong');
	const { getModel, setDanhSach, setLoading } = objInit;
	const [current, setCurrent] = useState<number>(0);
	const [dataSending, setDataSending] = useState<QuyTrinh.IRecord>();

	const [visibleDanhSachBuocXuLy, setVisibleDanhSachBuocXuLy] = useState<boolean>(false);
	const [visiblePreview, setVisiblePreview] = useState<boolean>(false);
	const [editCauHinh, setEditCauHinh] = useState<boolean>(false);

	const [visibleThemMoiCanBo, setVisibleThemMoiCanBo] = useState<boolean>(false);
	const [editCanBo, setEditCanBo] = useState<boolean>(false);
	const [recordCauHinh, setRecordCauHinh] = useState<LoaiHinh.TruongThongTin>();

	const [editCot, setEditCot] = useState<boolean>(false);
	const [recordCot, setRecordCot] = useState<LoaiHinh.Cot>();

	const [recordBuocXuLy, setRecordBuocXuLy] = useState<QuyTrinh.IBuocXuLy>();
	const [recordBoPhanXuLy, setRecordBoPhanXuLy] = useState<QuyTrinh.IBoPhanXuLy>();
	const [recordBoPhanChiuTrachNhiem, setRecordBoPhanChiuTrachNhiem] = useState<QuyTrinh.IBoPhanXuLy>();

	//mau don
	const [visibleDanhSachMauDon, setVisibleDanhSachMauDon] = useState<boolean>(false);
	const [recordMauDon, setRecordMauDon] = useState<QuyTrinh.IMauDon>();
	const [editMauDon, setEditMauDon] = useState<boolean>(false);

	const [editBuocXuLy, setEditBuocXuLy] = useState<boolean>(false);

	const [visibleDanhSachBoPhan, setVisibleDanhSachBoPhan] = useState<boolean>(false);
	const [editBoPhan, setEditBoPhan] = useState<boolean>(false);
	const [recordNhanSu, setRecordNhanSu] = useState<any>();
	const [visibleDanhSachCanBoXuLy, setVisibleDanhSachCanBoXuLy] = useState<boolean>(false);

	//Dot khai bao
	const [visibleDot, setVisibleDot] = useState<boolean>(false);

	const [recordQuyTrinhForm, setRecordQuyTrinhForm] = useState<any>();

	//mapping doi tuong
	const [dataMappingDoiTuong, setDataMappingDoiTuong] = useState<QuyTrinh.IDoiTuongMapping[]>([]);
	const [visibleMappingDoiTuong, setVisibleMappingDoiTuong] = useState<any>();
	const [editMappingDoiTuong, setEditMappingDoiTuong] = useState<boolean>(false);
	const [recordMappingDoiTuong, setRecordMappingDoiTuong] = useState<QuyTrinh.IDoiTuongMapping>();

	//config call back
	const [callbackBodyMapList, setCallbackBodyMapList] = useState<any[]>([]);
	const [visibleFormCallBack, setVisibleFormCallBack] = useState<boolean>(false);
	const [editFormCallBack, setEditFormCallBack] = useState<boolean>(false);
	const [recordFormCallBack, setRecordFormCallBack] = useState<any>();
	const [currentMauDonLienQuan, setCurrentMauDonLienQuan] = useState<QuyTrinh.IMauDon>();

	//cau hinh thong tin chung
	const [dataCauHinhThongTinChung, setDataCauHinhThongTinChung] = useState<QuyTrinh.IDanhSachCauHinhThongTinChung[]>(
		[],
	);
	const [visibleCauHinhThongTinChung, setVisibleCauHinhThongTinChung] = useState<any>();
	const [editCauHinhThongTinChung, setEditCauHinhThongTinChung] = useState<boolean>(false);
	const [recordCauHinhThongTinChung, setRecordCauHinhThongTinChung] =
		useState<QuyTrinh.IDanhSachCauHinhThongTinChung>();

	//bieu mau tiep nhan
	const [visibleDanhSachMauDonTiepNhan, setVisibleDanhSachMauDonTiepNhan] = useState<boolean>(false);
	const [recordMauDonTiepNhan, setRecordMauDonTiepNhan] = useState<QuyTrinh.IMauDon>();
	const [editMauDonTiepNhan, setEditMauDonTiepNhan] = useState<boolean>(false);

	//danh sach pham vi quy trinh
	const [visiblePhamViQuyTrinh, setVisiblePhamViQuyTrinh] = useState<boolean>(false);
	const [recordPhamViQuyTrinh, setRecordPhamViQuyTrinh] = useState<QuyTrinh.IDanhSachPhamViQuyTrinh>();
	const [editPhamViQuyTrinh, setEditPhamViQuyTrinh] = useState<boolean>(false);

	//bo phan xu ly
	const [dataBoPhanXuLyByBuoc, setDataBoPhanXuLyByBuoc] = useState<QuyTrinh.IBoPhanXuLyByBuoc[]>([]);

	const [type, setType] = useState<DoiTuong>(DoiTuong.SINH_VIEN);

	const [dataQuyTrinh, setDataQuyTrinh] = useState<QuyTrinh.IRecord[]>([]);
	const [danhSachCanBoXuLy, setDanhSachCanBoXuLy] = useState<QuyTrinh.CanBoXuLy[]>([]);

	const activeQuyTrinhDongModel = async (idQuyTrinh: string, getData: any) => {
		setLoading(true);
		await activeQuyTrinhDong(idQuyTrinh);
		message.success('Xử lý thành công');
		getData();
	};

	const getDanhSachCanBoXuLyModel = async () => {
		setLoading(true);
		const res = await getDanhSachCanBoXuLy();
		setDanhSachCanBoXuLy(res?.data?.data ?? []);
		setLoading(false);
	};

	const getDataByUser = async () => getModel(undefined, undefined, undefined, undefined, undefined, '/user/page');
	const getDataByChuyenVien = async (loaiXuLyDon: string, currentRoles: string) => {
		const res = await getQuyTrinhChuyenVien(loaiXuLyDon, currentRoles);
		if (res) {
			setDataQuyTrinh(res?.data?.data?.sort((a: { order: number }, b: { order: number }) => b.order - a.order));
		}
	};

	const getAllQuyTrinhChiuTrachNhiemModel = async (payload?: { condition?: any; filters?: string[] }) => {
		const res = await getAllQuyTrinhChiuTrachNhiem(payload);

		setDanhSach(res?.data?.data ?? []);
		// setRecord(
		// 	res?.data?.data?.filter((item: { phanHe: string | EPhanHe[] }) =>
		// 		item.phanHe.includes(EPhanHe.CONG_TAC_SINH_VIEN),
		// 	)?.[0],
		// );
	};

	return {
		...objInit,
		current,
		setCurrent,
		dataSending,
		setDataSending,
		visibleDanhSachMauDon,
		setVisibleDanhSachMauDon,
		visiblePreview,
		editCauHinh,
		recordCauHinh,
		setVisiblePreview,
		setEditCauHinh,
		setRecordCauHinh,
		editCot,
		recordCot,
		setEditCot,
		setRecordCot,
		recordMauDon,
		setRecordMauDon,
		visibleDanhSachBoPhan,
		visibleDanhSachBuocXuLy,
		setVisibleDanhSachBoPhan,
		setVisibleDanhSachBuocXuLy,
		recordBoPhanXuLy,
		setRecordBoPhanXuLy,
		visibleThemMoiCanBo,
		setVisibleThemMoiCanBo,
		recordNhanSu,
		setRecordNhanSu,
		editMauDon,
		setEditMauDon,
		editBoPhan,
		setEditBoPhan,
		editBuocXuLy,
		setEditBuocXuLy,
		editCanBo,
		setEditCanBo,
		recordBuocXuLy,
		setRecordBuocXuLy,
		visibleDanhSachCanBoXuLy,
		setVisibleDanhSachCanBoXuLy,
		visibleDot,
		setVisibleDot,
		recordQuyTrinhForm,
		setRecordQuyTrinhForm,
		recordBoPhanChiuTrachNhiem,
		setRecordBoPhanChiuTrachNhiem,
		getDataByUser,
		type,
		setType,
		callbackBodyMapList,
		setCallbackBodyMapList,
		visibleFormCallBack,
		setVisibleFormCallBack,
		editFormCallBack,
		setEditFormCallBack,
		recordFormCallBack,
		setRecordFormCallBack,
		currentMauDonLienQuan,
		setCurrentMauDonLienQuan,
		dataMappingDoiTuong,
		setDataMappingDoiTuong,
		visibleMappingDoiTuong,
		setVisibleMappingDoiTuong,
		recordMappingDoiTuong,
		setRecordMappingDoiTuong,
		editMappingDoiTuong,
		setEditMappingDoiTuong,
		getDataByChuyenVien,
		dataQuyTrinh,
		getAllQuyTrinhChiuTrachNhiemModel,
		dataCauHinhThongTinChung,
		editCauHinhThongTinChung,
		recordCauHinhThongTinChung,
		visibleCauHinhThongTinChung,
		setDataCauHinhThongTinChung,
		setVisibleCauHinhThongTinChung,
		setRecordCauHinhThongTinChung,
		setEditCauHinhThongTinChung,
		visibleDanhSachMauDonTiepNhan,
		setVisibleDanhSachMauDonTiepNhan,
		recordMauDonTiepNhan,
		setRecordMauDonTiepNhan,
		editMauDonTiepNhan,
		setEditMauDonTiepNhan,
		visiblePhamViQuyTrinh,
		editPhamViQuyTrinh,
		recordPhamViQuyTrinh,
		setEditPhamViQuyTrinh,
		setRecordPhamViQuyTrinh,
		setVisiblePhamViQuyTrinh,
		dataBoPhanXuLyByBuoc,
		setDataBoPhanXuLyByBuoc,
		getDanhSachCanBoXuLyModel,
		danhSachCanBoXuLy,
		setDanhSachCanBoXuLy,
		activeQuyTrinhDongModel,
	};
};
