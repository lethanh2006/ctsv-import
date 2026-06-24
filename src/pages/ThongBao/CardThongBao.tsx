import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { type IColumn } from '@/components/Table/typing';
import { type ESourceTypeNotification, mapModuleKeyToSourceType, NotificationType } from '@/services/ThongBao/constant';
import { type ThongBao } from '@/services/ThongBao/typing';
import dayjs from '@/utils/dayjs';
import { formatDateTime, getDateFormat } from '@/utils/formatDate';
import { currentRole } from '@/utils/ip';
import { DeleteOutlined, EyeOutlined, LeftOutlined, PlusCircleOutlined, RightOutlined } from '@ant-design/icons';
import { Button, DatePicker, Popconfirm, Segmented, Space } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import news from '../../assets/new6.gif';
import { kiemTraPhanVung } from '../../utils/constants';
import Form from './components/Form';
import CardFormThongBaoTuyChinh from './ThongBaoTuyChinh/CardForm';
import ViewThongBao from './ViewThongBao/CardView';
import TableReceiverThongBao from './ViewThongBao/TableReceiver';

const CardThongBao = (props: { notiType: NotificationType; activeKey: string }) => {
	const intl = useIntl();
	const { notiType, activeKey } = props;
	const {
		page,
		limit,
		setRecord,
		record,
		getModel,
		deleteModel,
		setSortTime,
		setVisibleThongBaoDanhSach,
		setRecordThongBaoDanhSach,
		setEdit,
		setIsView,
		setVisibleForm,
	} = useModel('thongbao.thongbao');
	const [visible, setVisible] = useState<boolean>(false);
	const [type, setType] = useState<string>('MONTH');
	const [startDate, setStartDate] = useState<any>(dayjs());
	const startDay = startDate?.format('DD/MM');
	const endDay = startDate.clone()?.add(6, 'day')?.format('DD/MM');
	const [visibleNguoiNhan, setVisibleNguoiNhan] = useState<boolean>(false);

	const onCell = (recordThongBao: ThongBao.IRecord) => ({
		onClick: () => {
			setVisible(true);
			setRecord(recordThongBao);
		},
		style: { cursor: 'pointer' },
	});

	const getData = () => {
		const value =
			type === 'DAY'
				? [startDate.startOf('day').toISOString(), startDate.endOf('day').toISOString()]
				: type === 'WEEK'
					? [
							startDate.startOf('week').startOf('day').toISOString(),
							startDate.startOf('week').add(6, 'day').endOf('day').toISOString(),
						]
					: [
							startDate.startOf('month').startOf('day').toISOString(),
							startDate.startOf('month').add(1, 'month').endOf('day').toISOString(),
						];

		setSortTime([{ field: 'createdAt', operator: 'between', values: value }]);

		//@ts-ignore
		getModel(
			{
				notificationInternal: activeKey === 'tu_dong',
				type: notiType,
				sourceType: mapModuleKeyToSourceType[currentRole] as ESourceTypeNotification,
			},
			[{ active: true, field: 'createdAt', operator: EOperatorType.BETWEEN, values: value }],
		);
	};

	const columns: IColumn<ThongBao.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'thongbao.card.column.nguoigui' }),
			dataIndex: 'senderName',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'thongbao.card.column.tieude' }),
			dataIndex: 'title',
			width: 200,
			filterType: 'string',
			onCell,
			render: (val, recordVal) => (
				<>
					<ExpandText>
						{val}{' '}
						{dayjs().diff(dayjs(recordVal?.createdAt), 'days') < 3 ? (
							<img style={{ width: 30, height: 20 }} src={news} />
						) : (
							''
						)}
					</ExpandText>
				</>
			),
		},
		{
			title: intl.formatMessage({ id: 'thongbao.card.column.nhandan' }),
			dataIndex: 'idTagEmail',
			width: 150,
			render: (val, recordVal) => recordVal?.tagEmail?.ten,
			onCell,
			hide: notiType === NotificationType.ONESIGNAL,
		},
		{
			title: intl.formatMessage({ id: 'thongbao.card.column.mota' }),
			dataIndex: 'description',
			width: 280,
			filterType: 'string',
			onCell,
			render: (val) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: intl.formatMessage({ id: 'thongbao.card.column.danhsachnguoinhan' }),
			align: 'center',
			width: 90,
			render: (val, rec) => (
				<a
					onClick={() => {
						setRecord(rec);
						setVisibleNguoiNhan(true);
					}}
				>
					{intl.formatMessage({ id: 'thongbao.link.xem' })}
				</a>
			),
		},
		{
			title: intl.formatMessage({ id: 'thongbao.card.column.thoigiangui' }),
			dataIndex: 'createdAt',
			width: 120,
			align: 'center',
			filterType: 'datetime',
			sortable: true,
			onCell,
			render: (val) => formatDateTime(val),
		},
		{
			title: intl.formatMessage({ id: 'thongbao.card.column.thaotac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (recordThongBao: ThongBao.IRecord) => {
				const isPhanVung = kiemTraPhanVung(recordThongBao?.dataPartitionCode ?? null);

				return (
					<>
						<ButtonExtend
							tooltip={intl.formatMessage({ id: 'thongbao.tooltip.xemchitiet' })}
							onClick={() => {
								setRecord(recordThongBao);
								setVisible(true);
							}}
							type='link'
							icon={<EyeOutlined />}
						/>
						{notiType === NotificationType.ONESIGNAL ? (
							<Popconfirm
								onConfirm={() => {
									deleteModel(recordThongBao._id, getData);
								}}
								title={intl.formatMessage({ id: 'thongbao.confirm.xoa' })}
							>
								<ButtonExtend
									tooltip={intl.formatMessage({ id: 'thongbao.tooltip.xoa' })}
									disabled={activeKey === 'tu_dong' || !isPhanVung}
									shape='circle'
									type='link'
									danger
									icon={<DeleteOutlined />}
								/>
							</Popconfirm>
						) : null}
					</>
				);
			},
		},
	];

	return (
		<>
			<Space wrap style={{ marginBottom: 12 }}>
				<Segmented
					value={type}
					onChange={(key: any) => {
						if (key === 'WEEK') setStartDate(dayjs().startOf('week'));
						if (key === 'DAY') setStartDate(dayjs());
						if (key === 'MONTH') setStartDate(dayjs());
						setType(key);
					}}
					options={[
						{ value: 'MONTH', label: intl.formatMessage({ id: 'thongbao.segmented.theothang' }) },
						{ value: 'WEEK', label: intl.formatMessage({ id: 'thongbao.segmented.theotuan' }) },
						{ value: 'DAY', label: intl.formatMessage({ id: 'thongbao.segmented.theongay' }) },
					]}
				/>

				{type === 'WEEK' && (
					<Space>
						<Button onClick={() => setStartDate(startDate.subtract(7, 'day'))}>
							<LeftOutlined /> {intl.formatMessage({ id: 'thongbao.button.tuantruoc' })}
						</Button>
						<span>{intl.formatMessage({ id: 'thongbao.label.tuan' }, { startDay, endDay })}</span>
						<Button onClick={() => setStartDate(startDate.add(7, 'day'))}>
							{intl.formatMessage({ id: 'thongbao.button.tuansau' })} <RightOutlined />
						</Button>
						<a onClick={() => setStartDate(dayjs().startOf('week'))}>
							{intl.formatMessage({ id: 'thongbao.button.tuannay' })}
						</a>
					</Space>
				)}
				{type === 'DAY' && (
					<DatePicker
						allowClear={false}
						format={getDateFormat()}
						style={{ width: 150 }}
						value={startDate}
						onChange={(val) => {
							setStartDate(val);
						}}
					/>
				)}
				{type === 'MONTH' && (
					<DatePicker
						allowClear={false}
						picker={'month'}
						format={'MM/YYYY'}
						style={{ width: 150 }}
						value={startDate}
						onChange={(val) => {
							setStartDate(val);
						}}
					/>
				)}
			</Space>

			<TableBase
				title={intl.formatMessage({
					id: notiType === NotificationType.ONESIGNAL ? 'thongbao.title.thongbao' : 'thongbao.title.guiemail',
				})}
				columns={columns}
				modelName='thongbao.thongbao'
				widthDrawer={1000}
				dependencies={[page, limit, type, startDate, activeKey]}
				Form={Form}
				getData={getData}
				formProps={{ getData, notiType }}
				destroyModal
				buttons={{ create: false }}
				hideCard
				otherButtons={[
					activeKey === 'ban_hanh' ? (
						<>
							<ButtonExtend
								onClick={() => {
									setRecord({} as ThongBao.IRecord);
									setEdit(false);
									setIsView(false);
									setVisibleForm(true);
								}}
								icon={<PlusCircleOutlined />}
								type='primary'
								notHideText
								tooltip={intl.formatMessage({ id: 'thongbao.tooltip.themmoidulieu' })}
							>
								{intl.formatMessage({ id: 'global.button.themmoi' })}
							</ButtonExtend>
							<ButtonExtend
								key='1'
								onClick={() => {
									setRecordThongBaoDanhSach(undefined);
									setVisibleThongBaoDanhSach(true);
								}}
							>
								{intl.formatMessage({ id: 'thongbao.button.thongbaotuychinh' })}
							</ButtonExtend>
						</>
					) : (
						<></>
					),
				]}
			/>

			<ModalExpandable
				width={800}
				styles={{ body: { padding: 0 } }}
				okButtonProps={{ hidden: true }}
				cancelText={intl.formatMessage({ id: 'global.button.dong' })}
				open={visible}
				onCancel={() => setVisible(false)}
				destroyOnClose
			>
				<ViewThongBao record={record} />
			</ModalExpandable>

			<ModalExpandable
				title={intl.formatMessage({ id: 'thongbao.modal.title.danhsachnguoinhan' })}
				width={800}
				okButtonProps={{ hidden: true }}
				cancelText={intl.formatMessage({ id: 'global.button.dong' })}
				open={visibleNguoiNhan}
				onCancel={() => setVisibleNguoiNhan(false)}
				destroyOnClose
			>
				<TableReceiverThongBao record={record} />
			</ModalExpandable>

			<CardFormThongBaoTuyChinh getData={getData} type={notiType} />
		</>
	);
};

export default CardThongBao;
