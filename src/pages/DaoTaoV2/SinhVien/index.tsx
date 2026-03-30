import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { handleLockHoSo, handleUnLockHoSo } from '@/services/DaoTaoV2/SinhVien';
import { ETrangThaiHocSv, colorTrangThaiHocSv } from '@/services/DaoTaoV2/SinhVien/constant';
import { type SinhVien } from '@/services/DaoTaoV2/SinhVien/typings';
import { formatPhoneNumber } from '@/utils/utils';
import { EyeOutlined, FileImageOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Tag, Tooltip, message } from 'antd';
import dayjs from 'dayjs';
import { useIntl, useModel } from 'umi';
import SelectKhoaNganh from '../NamHoc/KhoaNganh/components/Select';
import FilterKhoaSinhVien from '../NamHoc/KhoaSinhVien/components/FilterKhoaSinhVien';
import ModalSinhVien from './component/ModalSinhVien';
import PreviewHoSo from './component/PreviewHoSo';
import FormCapNhatAnhSV from './components/FormCapNhatAnhSV';
import KetQuaCapNhatAnhSV from './components/KetQuaCapNhatAnhSV';

const ViewSinhVien = () => {
	const intl = useIntl();
	const { getModel, page, limit, isView, handleView, visibleFormCapNhatAnh, setvisibleFormCapNhatAnh } =
		useModel('daotaov2.sinhvien.sinhvien');
	const { record: recKhoa } = useModel('daotaov2.namhoc.khoasinhvien');
	const { record: recNganh } = useModel('daotaov2.danhmuc.nganhdaotao');

	const getData = () => getModel({ maKhoaSinhVien: recKhoa?.ma, maNganh: recNganh?.ma });

	const handleLockHoSoModel = async (id: string) => {
		try {
			const res = await handleLockHoSo(id);
			if (res) {
				message.success(intl.formatMessage({ id: 'hosonguoihoc.message.khoathanhcong' }));
				getData();
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
				getData();
			}
		} catch (e) {
			console.log(e);
		}
	};

	const onCell = (rec: SinhVien.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<SinhVien.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'hosonguoihoc.column.masinhvien' }),
			dataIndex: 'ma',
			width: 140,
			sortable: true,
			filterType: 'string',
			align: 'center',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'hosonguoihoc.column.hoten' }),
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'hosonguoihoc.column.ngaysinh' }),
			dataIndex: 'ngaySinh',
			width: 100,
			filterType: 'date',
			sortable: true,
			render: (val) => val && dayjs(val).format('DD/MM/YYYY'),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'hosonguoihoc.column.cccd' }),
			dataIndex: 'cccd',
			width: 120,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'hosonguoihoc.column.sdt' }),
			dataIndex: 'soDienThoai',
			width: 120,
			filterType: 'string',
			render: (val) => val && formatPhoneNumber(val),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'hosonguoihoc.column.email' }),
			dataIndex: 'email',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'hosonguoihoc.column.khoanganh' }),
			dataIndex: 'maKhoaNganh',
			width: 150,
			filterType: 'customselect',
			filterCustomSelect: <SelectKhoaNganh multiple />,
			render: (val, rec) => rec.khoaNganh?.ten ?? val,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'hosonguoihoc.column.trangthaihoc' }),
			dataIndex: 'trangThaiHoc',
			align: 'center',
			width: 140,
			filterType: 'select',
			filterData: Object.values(ETrangThaiHocSv),
			render: (val, rec) => <Tag color={colorTrangThaiHocSv[val as ETrangThaiHocSv]}>{val}</Tag>,
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
			title: intl.formatMessage({ id: 'hosonguoihoc.column.thaotac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: SinhVien.IRecord) => (
				<>
					<Tooltip title={intl.formatMessage({ id: 'hosonguoihoc.column.xemchitiet' })}>
						<Button onClick={() => handleView(record)} type='link' icon={<EyeOutlined />} />
					</Tooltip>
					<Tooltip
						title={intl.formatMessage({
							id: record?.choPhepSua ? 'hosonguoihoc.column.khoahoso' : 'hosonguoihoc.column.mokhoahoso',
						})}
					>
						<Popconfirm
							title={intl.formatMessage({
								id: record?.choPhepSua
									? 'hosonguoihoc.column.xacnhankhoahoso'
									: 'hosonguoihoc.column.xacnhanmokhoahoso',
							})}
							onConfirm={() => {
								if (record?.choPhepSua) {
									handleLockHoSoModel(record?._id);
								} else {
									handleUnLockHoSoModel(record?._id);
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
								icon={record?.choPhepSua ? <LockOutlined /> : <UnlockOutlined />}
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

	return (
		<>
			<TableBase
				columns={columns}
				getData={getData}
				dependencies={[page, limit, recKhoa?.ma, recNganh?.ma]}
				modelName='daotaov2.sinhvien.sinhvien'
				title={intl.formatMessage({ id: 'hosonguoihoc.title' })}
				Form={isView ? PreviewHoSo : ModalSinhVien}
				formProps={{ hasEdit: true }}
				widthDrawer={1200}
				rowSelection
				deleteMany
				buttons={{ import: false, export: true, create: false }}
				otherButtons={[
					<FilterKhoaSinhVien key={'filter'} hasSelectNganh allowClear />,
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
			/>
			<Modal
				open={visibleFormCapNhatAnh}
				onCancel={() => setvisibleFormCapNhatAnh(false)}
				styles={{ body: { padding: 0 } }}
				footer={null}
			>
				<FormCapNhatAnhSV getData={getData} />
			</Modal>
			<KetQuaCapNhatAnhSV />
		</>
	);
};

export default ViewSinhVien;
