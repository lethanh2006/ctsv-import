import TableBase from '@/components/Table';
import { EOperatorType } from '@/components/Table/constant';
import { TExternalConditionItem, TFilter, type IColumn } from '@/components/Table/typing';
import { handleLockHoSo, handleUnLockHoSo } from '@/services/DaoTaoV2/SinhVien';
import { colorTrangThaiHocSv, ETrangThaiHocSv, localeTrangThaiHocSv } from '@/services/DaoTaoV2/SinhVien/constant';
import { type SinhVien } from '@/services/DaoTaoV2/SinhVien/typings';
import dayjs from '@/utils/dayjs';
import { formatDate } from '@/utils/formatDate';
import { formatPhoneNumber } from '@/utils/utils';
import { EyeOutlined, FileImageOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { Button, message, Modal, Popconfirm, Tag, Tooltip } from 'antd';
import { useMemo, useState } from 'react';
import { useAccess, useIntl, useModel } from 'umi';
import SelectKhoaNganh from '../NamHoc/KhoaNganh/components/Select';
import FilterKhoaSinhVien from '../NamHoc/KhoaSinhVien/components/FilterKhoaSinhVien';
import ModalSinhVien from './component/ModalSinhVien';
import PreviewHoSo from './component/PreviewHoSo';
import FormCapNhatAnhSV from './components/FormCapNhatAnhSV';
import KetQuaCapNhatAnhSV from './components/KetQuaCapNhatAnhSV';

const ViewSinhVien = () => {
	const intl = useIntl();
	const {
		page,
		limit,
		isView,
		handleView,
		setKhoaNganhSelected,
		record,
		visibleFormCapNhatAnh,
		setvisibleFormCapNhatAnh,
	} = useModel('daotaov2.sinhvien.sinhvien');
	const { record: recKhoa } = useModel('daotaov2.namhoc.khoasinhvien');
	const { record: recNganh } = useModel('daotaov2.danhmuc.nganhdaotao');
	const { record: recTrinhDo } = useModel('daotaov2.danhmuc.trinhdo');
	const { record: recHinhThuc } = useModel('daotaov2.danhmuc.hinhthucdaotao');
	const { minorAccessFilter } = useAccess();

	const [refreshKey, setRefreshKey] = useState(0);
	const refreshData = () => setRefreshKey((prev) => prev + 1);

	const handleLockHoSoModel = async (id: string) => {
		try {
			const res = await handleLockHoSo(id);
			if (res) {
				message.success(intl.formatMessage({ id: 'hosonguoihoc.message.khoathanhcong' }));
				refreshData();
			}
		} catch (e) {
			console.log(e);
		}
	};

	const handleUnLockHoSoModel = async (id: string) => {
		try {
			const res = await handleUnLockHoSo(id);
			if (res) {
				message.success(intl.formatMessage({ id: 'hosonguoihoc.message.mokhoathanhcong' }));
				refreshData();
			}
		} catch (e) {
			console.log(e);
		}
	};

	const onCell = (rec: SinhVien.IRecord) => ({
		onClick: () => {
			if (record?.ssoId !== rec.ssoId) setKhoaNganhSelected(undefined);
			handleView(rec);
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<SinhVien.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'sinhvien.column.masv' }),
			dataIndex: 'ma',
			width: 120,
			sortable: true,
			filterType: 'string',
			align: 'center',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sinhvien.column.hoten' }),
			dataIndex: 'ten',
			width: 170,
			filterType: 'string',
			render: (val, rec) =>
				minorAccessFilter?.() ? (val ?? [rec?.firstName, rec?.lastName].filter(Boolean).join(' ')) : val,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sinhvien.column.ngaysinh' }),
			dataIndex: 'ngaySinh',
			width: 100,
			align: 'center',
			filterType: 'date',
			sortable: true,
			render: (val) => val && formatDate(val),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sinhvien.column.cccd' }),
			dataIndex: 'cccd',
			width: 120,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sinhvien.column.sdt' }),
			dataIndex: 'soDienThoai',
			width: 120,
			filterType: 'string',
			render: (val) => val && formatPhoneNumber(val),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sinhvien.column.email' }),
			dataIndex: 'email',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sinhvien.column.khoanganh' }),
			dataIndex: 'maKhoaNganh',
			width: 180,
			filterType: 'customselect',
			filterCustomSelect: <SelectKhoaNganh multiple allowClear />,
			render: (val, rec) =>
				[rec.khoaNganh?.ten ?? val, rec.khoaNganh2?.ten ?? rec?.maKhoaNganh2].filter(Boolean).join(', '),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sinhvien.column.trangthaihoc' }),
			dataIndex: 'trangThaiHoc',
			align: 'center',
			width: 120,
			filterType: 'select',
			filterData: Object.values(ETrangThaiHocSv),
			render: (val) => (
				<Tag color={colorTrangThaiHocSv[val as ETrangThaiHocSv]}>
					{intl.formatMessage({ id: localeTrangThaiHocSv[val as ETrangThaiHocSv] })}
				</Tag>
			),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'hosonguoihoc.column.capnhat' }),
			dataIndex: 'updatedAt',
			width: 120,
			sortable: true,
			render: (val) => (val ? dayjs(val).format('HH:mm DD/MM/YYYY') : ''),
		},
		{
			title: intl.formatMessage({ id: 'hosonguoihoc.column.trangthai' }),
			dataIndex: 'choPhepSua',
			width: 120,
			align: 'center',
			fixed: 'right',
			render: (val) =>
				val ? (
					<Tag color='green'>{intl.formatMessage({ id: 'hosonguoihoc.column.trangthaihoc.mokhoa' })}</Tag>
				) : (
					<Tag color='red'>{intl.formatMessage({ id: 'hosonguoihoc.column.trangthaihoc.khoa' })}</Tag>
				),
			filterType: 'select',
			filterData: [
				{ value: true, label: intl.formatMessage({ id: 'hosonguoihoc.column.trangthaihoc.mokhoa' }) },
				{ value: false, label: intl.formatMessage({ id: 'hosonguoihoc.column.trangthaihoc.khoa' }) },
			],
		},
		{
			title: intl.formatMessage({ id: 'sinhvien.column.thaotac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (rec: SinhVien.IRecord) => (
				<>
					<Tooltip title={intl.formatMessage({ id: 'hosonguoihoc.column.xemchitiet' })}>
						<Button onClick={() => handleView(rec)} type='link' icon={<EyeOutlined />} />
					</Tooltip>
					<Tooltip
						title={intl.formatMessage({
							id: rec?.choPhepSua ? 'hosonguoihoc.column.khoahoso' : 'hosonguoihoc.column.mokhoahoso',
						})}
					>
						<Popconfirm
							title={intl.formatMessage({
								id: rec?.choPhepSua ? 'hosonguoihoc.column.xacnhankhoahoso' : 'hosonguoihoc.column.xacnhanmokhoahoso',
							})}
							onConfirm={() => {
								if (rec?.choPhepSua) {
									handleLockHoSoModel(rec?._id);
								} else {
									handleUnLockHoSoModel(rec?._id);
								}
							}}
						>
							<Button
								// onClick={() => {
								// 	if (record?.choPhepSua) {
								// 		handleLockHoSo(record?._id);
								// 	} else {
								// 		handleUnLockHoSoModel(record?._id);
								// 	}
								// }}
								type='link'
								icon={rec?.choPhepSua ? <LockOutlined /> : <UnlockOutlined />}
							/>
						</Popconfirm>
					</Tooltip>
					{/* <Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getData)}
							title='Bạn có chắc chắn muốn xóa sinh viên này?'
							placement='topRight'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip> */}
				</>
			),
		},
	];

	const externalConditions = useMemo<TExternalConditionItem<SinhVien.IRecord>[]>(() => {
		return [
			{
				field: 'maKhoaSinhVien',
				value: recKhoa?.ma,
				label: intl.formatMessage({ id: 'sinhvien.filter.khoaSinhVien' }),
				valueLabel: recKhoa?.ten,
			},
			{
				field: 'maNganh',
				value: recNganh?.ma,
				label: intl.formatMessage({ id: 'sinhvien.filter.nganh' }),
				valueLabel: recNganh?.ten,
			},
			{
				field: 'maTrinhDo',
				value: recTrinhDo?.ma,
				label: intl.formatMessage({ id: 'sinhvien.filter.trinhDo' }),
				valueLabel: recTrinhDo?.ten,
			},
			{
				field: 'maHinhThuc',
				value: recHinhThuc?.ma,
				label: intl.formatMessage({ id: 'sinhvien.filter.hinhThuc' }),
				valueLabel: recHinhThuc?.ten,
			},
		];
	}, [recKhoa?.ma, recNganh?.ma, recTrinhDo?.ma, recHinhThuc?.ma]);

	const externalFilters = useMemo<TFilter<SinhVien.IRecord>[]>(() => {
		return externalConditions
			.filter((item) => item.value)
			.map((item) => ({
				field: item.field as keyof SinhVien.IRecord,
				operator: EOperatorType.EQUAL,
				values: [item.value],
			}));
	}, [externalConditions]);

	return (
		<>
			<TableBase
				columns={columns}
				externalConditions={externalConditions}
				externalFilters={externalFilters}
				dependencies={[page, limit, recKhoa?.ma, recNganh?.ma, recTrinhDo?.ma, recHinhThuc?.ma, refreshKey]}
				modelName='daotaov2.sinhvien.sinhvien'
				title={intl.formatMessage({ id: 'sinhvien.title' })}
				Form={isView ? PreviewHoSo : ModalSinhVien}
				formProps={{ hasEdit: true }}
				widthDrawer={1200}
				rowSelection
				deleteMany
				buttons={{ create: false, export: true }}
				otherButtons={[
					<Button
						onClick={() => {
							setvisibleFormCapNhatAnh(true);
						}}
						icon={<FileImageOutlined />}
						key={'image'}
						type='primary'
					>
						{intl.formatMessage({ id: 'hosonguoihoc.button.capnhatanhthesv' })}
					</Button>,
				]}
			>
				<div style={{ marginBottom: 12 }}>
					<FilterKhoaSinhVien hasSelectNganh allowClear />
				</div>
			</TableBase>
			<Modal
				open={visibleFormCapNhatAnh}
				onCancel={() => setvisibleFormCapNhatAnh(false)}
				styles={{ body: { padding: 0 } }}
				footer={null}
			>
				<FormCapNhatAnhSV getData={refreshData} />
			</Modal>
			<KetQuaCapNhatAnhSV />
		</>
	);
};

export default ViewSinhVien;
