import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import { ETrangThaiHoatDong, MapKeyColorTrangThaiHoatDongCLB } from '@/services/CauLacBo/constant';
import type { CauLacBo } from '@/services/CauLacBo/typings';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Tag, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useModel } from 'umi';
import FormHoatDong from './Form';
import { useState } from 'react';
import ViewDetailHoatDongCLB from './ViewDetail';
import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';

const HoatDongCauLacBo = () => {
	const { handleEdit, deleteModel, getModel, setRecord, setCondition, condition } = useModel('caulacbo.hoatdong');
	const { record: recCauLacBo } = useModel('caulacbo.caulacbo');
	const [visible, setVisible] = useState<boolean>(false);

	const getData = () => {
		getModel({ idCauLacBo: recCauLacBo?._id });
	};

	const onCell = (record: CauLacBo.HoatDong) => ({
		onClick: () => {
			setRecord(record);
			setVisible(true);
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<CauLacBo.HoatDong>[] = [
		{
			title: 'Tên hoạt động',
			dataIndex: 'ten',
			width: 200,
			onCell,
			filterType: 'string',
		},

		{
			title: 'Thời gian',
			dataIndex: 'thoiGianDuKien',
			width: 250,
			align: 'center',
			render: (val) => <div>{dayjs(val).format('HH:mm DD/MM/YYYY')}</div>,
			onCell,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			width: 200,
			align: 'center',
			filterType: 'select',
			onCell,
			filterData: Object.values(ETrangThaiHoatDong).map((item) => ({ value: item, label: item })),
			render: (val: ETrangThaiHoatDong) => <Tag color={MapKeyColorTrangThaiHoatDongCLB[val]}>{val}</Tag>,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (record: CauLacBo.HoatDong) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button
							onClick={() => {
								handleEdit(record);
							}}
							type='link'
							icon={<EditOutlined />}
						/>
					</Tooltip>

					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => {
								deleteModel(record._id, getData);
							}}
							title='Bạn có chắc chắn muốn xóa?'
						>
							<Button type='link' danger icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	return (
		<>
			<TableBase
				destroyModal
				getData={getData}
				otherProps={{
					size: 'small',
				}}
				dependencies={[recCauLacBo?._id]}
				hideCard
				widthDrawer={1000}
				Form={FormHoatDong}
				title='Quản lý câu lạc bộ'
				modelName={'caulacbo.hoatdong'}
				columns={columns}
				otherButtons={[
					<MyDateRangePicker
						allowClear
						onChange={(val) => {
							setCondition({ ...condition, thoiGianDuKien: val ? { $gte: val[0], $lte: val[1] } : undefined });
						}}
						size='small'
						placeholder={['Từ ngày', 'đến ngày']}
						style={{ width: 230, maxHeight: 25 }}
						key='1'
					/>,
				]}
			/>
			<Modal
				width={900}
				title='Chi tiết'
				open={visible}
				onCancel={() => setVisible(false)}
				footer={
					<Button
						onClick={() => {
							setVisible(false);
						}}
					>
						Đóng
					</Button>
				}
			>
				<ViewDetailHoatDongCLB />
			</Modal>
		</>
	);
};

export default HoatDongCauLacBo;
