import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import { thongKeChung } from '@/services/CauLacBo';
import { ETrangThaiHoatDong, ETrangThaiThanhVien } from '@/services/CauLacBo/constant';
import type { CauLacBo } from '@/services/CauLacBo/typings';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import FormCauLacBo from './components/Form';
import ViewDetailCLB from './components/ViewDetail';

const CauLacBoComponent = () => {
	const intl = useIntl();
	const { handleEdit, deleteModel, getModel, setRecord, record: recordCLB } = useModel('caulacbo.caulacbo');
	const { danhSach, getAllModel } = useModel('tochucnhansu.donvi');
	const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
	const [dataThongKe, setDataThongKe] = useState<
		{
			cauLacBo: string;
			thanhVien: {
				[ETrangThaiThanhVien.DANG_HOAT_DONG]: number;
				[ETrangThaiThanhVien.NGUNG_HOAT_DONG]: number;
			};
			tongSoHoatDong: {
				[ETrangThaiHoatDong.CHUA_THUC_HIEN]: number;
				[ETrangThaiHoatDong.DA_THUC_HIEN]: number;
				[ETrangThaiHoatDong.HUY]: number;
			};
		}[]
	>([]);
	const getThongKe = async () => {
		const res = await thongKeChung();
		setDataThongKe(res?.data?.data ?? []);
	};

	useEffect(() => {
		getAllModel(false);
		getThongKe();
	}, []);

	const onCell = (record: CauLacBo.IRecord) => ({
		onClick: () => {
			setVisibleDetail(true);
			setRecord(record);
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<CauLacBo.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'quanlyclb.column.ten' }),
			dataIndex: 'ten',
			width: 200,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'quanlyclb.column.logo' }),
			dataIndex: 'logo',
			width: 100,
			align: 'center',
			render: (val: string) => <img style={{ width: 30, height: 30 }} src={val} />,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'quanlyclb.column.donvi' }),
			dataIndex: 'donViQuanLy',
			width: 150,
			render: (val: string) => danhSach.find((item) => item._id === val)?.ten,
			align: 'center',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'quanlyclb.column.thanhvien' }),
			width: 150,
			onCell,
			align: 'center',
			render: (rec) => {
				const recThongKe = dataThongKe.find((item) => item.cauLacBo === rec.ten);
				return recThongKe?.thanhVien ? (
					<div>
						{recThongKe?.thanhVien[ETrangThaiThanhVien.DANG_HOAT_DONG] +
							recThongKe?.thanhVien[ETrangThaiThanhVien.NGUNG_HOAT_DONG]}{' '}
						{intl.formatMessage({ id: 'quanlyclb.column.thanhvien' })}
					</div>
				) : (
					intl.formatMessage({ id: 'quanlyclb.column.thanhvien.empty' })
				);
			},
		},
		{
			title: intl.formatMessage({ id: 'quanlyclb.column.hoatdong' }),
			width: 150,
			onCell,
			align: 'center',
			render: (rec) => {
				const recThongKe = dataThongKe.find((item) => item.cauLacBo === rec.ten);
				return recThongKe?.tongSoHoatDong ? (
					<div>
						{recThongKe?.tongSoHoatDong[ETrangThaiHoatDong.CHUA_THUC_HIEN] +
							recThongKe?.tongSoHoatDong[ETrangThaiHoatDong.DA_THUC_HIEN] +
							recThongKe?.tongSoHoatDong[ETrangThaiHoatDong.HUY]}{' '}
						{intl.formatMessage({ id: 'quanlyclb.column.hoatdong' })}
					</div>
				) : (
					intl.formatMessage({ id: 'quanlyclb.column.hoatdong.empty' })
				);
			},
		},
		{
			title: intl.formatMessage({ id: 'quanlyclb.column.noiquy' }),
			dataIndex: 'noiQuyQuyChe',
			width: 100,
			align: 'center',
			render: (val) => (
				<a href={val} target='_blank' rel='noreferrer'>
					{intl.formatMessage({ id: 'global.button.chitiet' })}
				</a>
			),
		},
		{
			title: intl.formatMessage({ id: 'quanlyclb.column.quyetdinh' }),
			dataIndex: 'quyetDinhThanhLap',
			width: 120,
			align: 'center',
			render: (val) => (
				<a href={val} target='_blank' rel='noreferrer'>
					{intl.formatMessage({ id: 'global.button.chitiet' })}
				</a>
			),
		},
		{
			title: intl.formatMessage({ id: 'quanlyclb.column.thaotac' }),
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (record: CauLacBo.IRecord) => (
				<>
					<Tooltip title={intl.formatMessage({ id: 'global.button.chinhsua' })}>
						<Button
							onClick={() => {
								handleEdit(record);
							}}
							type='link'
							icon={<EditOutlined />}
						/>
					</Tooltip>

					<Tooltip title={intl.formatMessage({ id: 'global.button.xoa' })}>
						<Popconfirm
							onConfirm={() => {
								deleteModel(record._id, getModel);
							}}
							title={intl.formatMessage({ id: 'global.button.confirm.xoa' })}
						>
							<Button type='link' danger icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
					<Tooltip title={intl.formatMessage({ id: 'global.button.chitiet' })}>
						<Button
							onClick={() => {
								setRecord(record);
								setVisibleDetail(true);
							}}
							type='link'
							icon={<EyeOutlined />}
						/>
					</Tooltip>
				</>
			),
		},
	];

	return (
		<>
			<TableBase
				widthDrawer={800}
				Form={FormCauLacBo}
				title={intl.formatMessage({ id: 'quanlyclb.title' })}
				modelName={'caulacbo.caulacbo'}
				columns={columns}
			/>
			<Modal
				destroyOnClose
				styles={{ body: { paddingTop: 4 } }}
				width={1100}
				footer={
					<Button
						onClick={() => {
							setVisibleDetail(false);
						}}
					>
						{intl.formatMessage({ id: 'global.button.dong' })}
					</Button>
				}
				title={recordCLB?.ten}
				open={visibleDetail}
				onCancel={() => setVisibleDetail(false)}
			>
				<ViewDetailCLB dataThongKe={dataThongKe.find((item) => item.cauLacBo === recordCLB?.ten) as any} />
			</Modal>
		</>
	);
};

export default CauLacBoComponent;
