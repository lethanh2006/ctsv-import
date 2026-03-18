import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import useCheckAccess from '@/hooks/useCheckAccess';
import {
	default as SelectNganh,
	default as SelectNganhCoSo,
} from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/Nganh/components/SelectNganh';
import SelectKhoaSinhVien from '@/pages/DaoTaoV2/SinhVien/KhoaSinhVien/SelectKhoaSinhVien';
import SelectDotDiemRenLuyen from '@/pages/DiemRenLuyen/Dot/Select';
import type { LopHanhChinh } from '@/services/DaoTaoV2/NamHoc/LopHanhChinh/typings';
import { getTrangThaiKhaiBaoDrl } from '@/services/DiemRenLuyen';
import type { ETrangThaiTiepNhanMinhChung } from '@/services/DiemRenLuyen/MinhChung/KhaiBao/constants';
import { MapTitleETrangThaiTiepNhanMinhChung } from '@/services/DiemRenLuyen/MinhChung/KhaiBao/constants';
import { Card, Space, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { history, useIntl, useModel } from 'umi';

const DanhSachLop = () => {
	const intl = useIntl();
	const { setRecord, getModel, page, limit, condition, danhSach } = useModel('daotaov2.lophanhchinh.lophanhchinh');
	const {
		getModel: getModelLopNhanSu,
		setRecord: setRecordLopNhanSu,
		page: pageLopNhanSu,
		limit: limitLopNhanSu,
		condition: conditionLopNhanSu,
		danhSach: danhSachLopNhanSu,
	} = useModel('daotaov2.lophanhchinh.lophanhchinhnhansu');
	const { record: recKhoa } = useModel('daotaov2.namhoc.khoasinhvien');
	const { record: recordDot, setRecord: setRecordDot, handleCheckPhanQuyen } = useModel('diemrenluyen.dot');
	const { record: recNganh, setRecord: setRecordNganh } = useModel('daotaov2.danhmuc.nganhdaotao');
	const { record: recKhoaSinhVien, setRecord: setRecKhoaSinhVien } = useModel('daotaov2.khoasinhvien.khoasinhvien');
	const isCVHT = useCheckAccess('ctsv|diem-ren-luyen|minh-chung|khai-bao-cvht');
	const { initialState } = useModel('@@initialState');
	const currentUser = initialState?.currentUser;
	const isAdmin = currentUser?.preferred_username === 'admin';
	const [dataTrangThai, setDataTrangThai] = useState<any>();
	const idDuyet = useCheckAccess('ctsv|diem-ren-luyen|minh-chung|khai-bao|duyet');
	const isKhoa = useCheckAccess('ctsv|diem-ren-luyen|minh-chung|khai-bao|duyet-tong');

	useEffect(() => {
		handleCheckPhanQuyen(idDuyet, isKhoa);
	}, []);

	// useEffect(() => {
	// 	if (isCVHT) {
	// 		getAllModelLopNhanSu(true, undefined);
	// 	} else {
	// 		getAllModel(true, undefined, { maNganh: recNganh?.ma });
	// 	}
	// }, [recNganh]);

	const getData = async () => {
		if (isCVHT && !isAdmin) {
			getModelLopNhanSu().then((res) => setRecordLopNhanSu(res?.[0]));
		} else {
			getModel({ maNganh: recNganh?.ma, maKhoaSinhVien: recKhoaSinhVien?.ma })?.then((res) => {
				setRecord(res?.[0]);
			});
		}
	};

	const onCell = (recordVal: LopHanhChinh.IRecord) => ({
		onClick: () => {
			history.push(`/diem-ren-luyen/minh-chung/danh-sach-khai-bao/${recordVal?._id}`);
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<LopHanhChinh.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'minhchung.danhsach.tenlop' }),
			dataIndex: 'ten',
			width: 120,
			filterType: 'string',
			align: 'center',
			sortable: true,
			onCell,
		},
		// {
		// 	title: 'Sĩ số',
		// 	dataIndex: 'siSo',
		// 	align: 'center',
		// 	width: 80,
		// 	filterType: 'number',
		// 	sortable: true,
		// 	onCell,
		// },
		{
			title: intl.formatMessage({ id: 'minhchung.danhsach.khoasv' }),
			width: 120,
			dataIndex: 'maKhoaSinhVien',
			render: (val, rec) => <a onClick={() => {}}>{rec?.khoaSinhVien?.ten}</a>,
			filterType: 'customselect',
			align: 'center',
			filterCustomSelect: <SelectKhoaSinhVien multiple selectMa />,
			hide: !!recKhoa?.ma,
		},
		{
			title: intl.formatMessage({ id: 'minhchung.danhsach.nganh' }),
			width: 180,
			dataIndex: 'maNganh',
			render: (val, rec) => `${rec?.nganh?.dmNganh?.ten ?? ''} - ${rec?.nganh?.ma ?? ''}`,
			filterType: 'customselect',
			align: 'center',
			filterCustomSelect: <SelectNganhCoSo multiple selectMa />,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'minhchung.danhsach.trangthaiduyet' }),
			width: 120,
			dataIndex: 'doiTuong',
			align: 'center',
			render: (val, rec) =>
				val && (
					<Tag color={dataTrangThai?.[rec?.ten] === 'Chờ xử lý' ? 'default' : 'green'}>
						{MapTitleETrangThaiTiepNhanMinhChung?.[dataTrangThai?.[rec?.ten] as ETrangThaiTiepNhanMinhChung] ??
							intl.formatMessage({ id: 'minhchung.khaibao.choxuly' })}
					</Tag>
				),
			onCell,
		},
		// {
		// 	title: 'Đối tượng',
		// 	width: 120,
		// 	dataIndex: 'doiTuong',
		// 	render: (val: EDoiTuongLopHanhChinh) => val && doiTuongLopHanhChinh[val],
		// 	filterType: 'select',
		// 	filterData: Object.values(EDoiTuongLopHanhChinh).map((item) => ({
		// 		label: doiTuongLopHanhChinh[item],
		// 		value: item,
		// 	})),
		// 	onCell,
		// },
		// {
		// 	title: 'Thao tác',
		// 	align: 'center',
		// 	width: 90,
		// 	fixed: 'right',
		// 	hide: isCVHT,
		// 	render: (record: LopHanhChinh.IRecord) => (
		// 		<>
		// 			{/*<Tooltip title='Chỉnh sửa'>*/}
		// 			{/*	<Button onClick={() => {}} type='link' icon={<EditOutlined />} />*/}
		// 			{/*</Tooltip>*/}
		//
		// 			<>
		// 				<Popconfirm
		// 					title={intl.formatMessage({ id: 'minhchung.khaibao.confirm.duyet' })}
		// 					placement={'topLeft'}
		// 					// disabled={rec?.trangThai !== ETrangThaiTiepNhanMinhChung.CHO_XU_LY}
		// 					onConfirm={() => {}}
		// 				>
		// 					<ButtonExtend
		// 						// disabled={rec?.trangThai !== ETrangThaiTiepNhanMinhChung.CHO_XU_LY}
		// 						tooltip={intl.formatMessage({ id: 'minhchung.khaibao.duyet' })}
		// 						type='link'
		// 						icon={<CheckOutlined />}
		// 					/>
		// 				</Popconfirm>
		// 				{/*<Divider type={'vertical'} />*/}
		// 				<Popconfirm
		// 					title={intl.formatMessage({ id: 'minhchung.khaibao.confirm.tuchoi' })}
		// 					placement={'topLeft'}
		// 					// disabled={rec?.trangThai !== ETrangThaiTiepNhanMinhChung.CHO_XU_LY}
		// 					onConfirm={() => {}}
		// 				>
		// 					<ButtonExtend
		// 						// disabled={rec?.trangThai !== ETrangThaiTiepNhanMinhChung.CHO_XU_LY}
		// 						tooltip={intl.formatMessage({ id: 'minhchung.khaibao.tuchoi' })}
		// 						type='link'
		// 						danger
		// 						icon={<CloseOutlined />}
		// 					/>
		// 				</Popconfirm>
		// 				<Divider type={'vertical'} />
		// 			</>
		// 		</>
		// 	),
		// },
	];

	const handleGetTrangThaiLop = async () => {
		try {
			const dataLop = isCVHT && !isAdmin ? danhSachLopNhanSu : danhSach;
			const res = await getTrangThaiKhaiBaoDrl(recordDot?._id ?? '', {
				listLopHanhChinh: dataLop?.map((val) => val?.ten),
			});
			if (res) {
				setDataTrangThai(res?.data?.data);
			}
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		if (recordDot?._id) handleGetTrangThaiLop();
	}, [recordDot, danhSachLopNhanSu, danhSach]);

	return (
		<>
			{/*{(dataPhanQuyen?.isKhoa === true || isCVHT) && !isAdmin && !dataPhanQuyen?.isPhongCTSV ? (*/}
			<Card title={intl.formatMessage({ id: 'minhchung.danhsach.danhsachlop' })}>
				{/*<TableStaticData columns={columns} data={isCVHT ? danhSachLopNhanSu : danhSach}>*/}
				{/*	{!isCVHT && (*/}
				{/*		<SelectNganh*/}
				{/*			value={recNganh?._id}*/}
				{/*			onChange={(val, option) => {*/}
				{/*				const rawData = option?.rawData;*/}
				{/*				setRecordNganh(rawData);*/}
				{/*			}}*/}
				{/*			style={{ width: 300 }}*/}
				{/*			isSetRecord={true}*/}
				{/*			condition={{ maDonVi: dataPhanQuyen?.donVi?.maDonVi }}*/}
				{/*		/>*/}
				{/*	)}*/}
				{/*</TableStaticData>*/}
				<TableBase
					hideCard
					getData={getData}
					dependencies={[
						isCVHT,
						recNganh,
						page,
						limit,
						condition,
						conditionLopNhanSu,
						pageLopNhanSu,
						limitLopNhanSu,
						recKhoaSinhVien,
					]}
					buttons={{ create: false }}
					modelName={
						isCVHT && !isAdmin ? 'daotaov2.lophanhchinh.lophanhchinhnhansu' : 'daotaov2.lophanhchinh.lophanhchinh'
					}
					columns={columns}
					otherButtons={[
						<Space key={'select'}>
							{isAdmin && (
								<>
									<SelectKhoaSinhVien
										isSetRecord
										style={{ width: 200 }}
										value={recKhoaSinhVien?._id}
										onChange={(val, option) => {
											const rawData = option?.rawData;
											setRecKhoaSinhVien(rawData);
										}}
									/>
								</>
							)}
							{!isCVHT && (
								<SelectNganh
									style={{ width: 300 }}
									value={recNganh?._id}
									onChange={(val, option) => {
										const rawData = option?.rawData;
										setRecordNganh(rawData);
									}}
									isSetRecord={true}
								/>
							)}

							<SelectDotDiemRenLuyen
								isSetRecord
								style={{ width: 300 }}
								value={recordDot?._id}
								onChange={(val, option) => {
									const rawData = option?.rawData;
									setRecordDot(rawData);
								}}
							/>
						</Space>,
					]}
				/>
			</Card>
			{/*) : (*/}
			{/*	<DanhSachKhaiBao />*/}
			{/*)}*/}
		</>
	);
};
export default DanhSachLop;
