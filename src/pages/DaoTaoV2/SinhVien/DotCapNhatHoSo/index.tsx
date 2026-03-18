import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import DanhSachChuaKhaiBao from '@/pages/DaoTaoV2/SinhVien/DotCapNhatHoSo/components/DanhSachChuaKhaiBao';
import { DeleteOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Switch, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import FormThemDot from './components/form';

const DotCapNhatHoSoPage = () => {
	const intl = useIntl();
	const { handleEdit, getModel, page, limit, deleteModel, putModel, setRecord, record } = useModel(
		'daotaov2.sinhvien.dotcapnhathoso',
	);
	const [visibleDanhSachChuaKhaiBao, setVisibleDanhSachChuaKhaiBao] = useState<boolean>(false);
	const getData = () => {
		try {
			getModel();
		} catch (e) {
			console.log(e);
		}
	};

	const columns: IColumn<DotCapNhatHoSo.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'dotcapnhathoso.column.tendot' }),
			dataIndex: 'tenDot',
			width: 150,
			filterType: 'string',
			sortable: true,
		},

		{
			title: intl.formatMessage({ id: 'dotcapnhathoso.column.tgbt' }),
			width: 120,
			dataIndex: 'thoiGianBatDau',
			filterType: 'date',
			sortable: true,
			render: (val) => val && dayjs(val).format('HH:mm DD/MM/YYYY'),
		},
		{
			title: intl.formatMessage({ id: 'dotcapnhathoso.column.tgkt' }),
			width: 120,
			dataIndex: 'thoiGianKetThuc',
			filterType: 'date',
			sortable: true,
			render: (val) => val && dayjs(val).format('HH:mm DD/MM/YYYY'),
		},
		{
			width: 160,
			title: intl.formatMessage({ id: 'dotcapnhathoso.column.kichhoat' }),
			dataIndex: 'kichHoat',
			align: 'center',
			render: (val, recordVal) => {
				return (
					<Switch
						checked={val}
						onChange={(checked: boolean) => {
							putModel(recordVal._id, { ...recordVal, kichHoat: checked }, getData);
						}}
					/>
				);
			},
		},
		{
			title: intl.formatMessage({ id: 'dotcapnhathoso.column.thaotac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (recordVal: DotCapNhatHoSo.IRecord) => (
				<>
					<Tooltip title={intl.formatMessage({ id: 'global.button.chinhsua' })}>
						<Button onClick={() => handleEdit(recordVal)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title={intl.formatMessage({ id: 'global.button.xoa' })}>
						<Popconfirm
							onConfirm={() =>
								deleteModel(recordVal._id, () => getData(), {
									messageText: intl.formatMessage({ id: 'global.message.xoathanhcong' }),
								})
							}
							title={intl.formatMessage({ id: 'dotcapnhathoso.confirm.xoa' })}
							placement='topRight'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
					<Tooltip title={intl.formatMessage({ id: 'dotcapnhathoso.dssv' })}>
						<Button
							onClick={() => {
								setRecord(recordVal);
								setVisibleDanhSachChuaKhaiBao(true);
							}}
							type='link'
							icon={<UserOutlined />}
						/>
					</Tooltip>
				</>
			),
		},
	];

	return (
		<>
			<TableBase
				columns={columns}
				dependencies={[page, limit]}
				modelName={'daotaov2.sinhvien.dotcapnhathoso'}
				title={intl.formatMessage({ id: 'dotcapnhathoso.title' })}
				Form={FormThemDot}
				rowSelection
				deleteMany
				formProps={{ getData: getData }}
			/>
			<Modal
				open={visibleDanhSachChuaKhaiBao}
				onCancel={() => {
					setVisibleDanhSachChuaKhaiBao(false);
				}}
				width={1200}
				footer={null}
				title={intl.formatMessage({ id: 'dotcapnhathoso.dssv' })}
				destroyOnClose
			>
				<DanhSachChuaKhaiBao
					data={record}
					onCancel={() => {
						setVisibleDanhSachChuaKhaiBao(false);
					}}
				/>
			</Modal>
		</>
	);
};

export default DotCapNhatHoSoPage;
