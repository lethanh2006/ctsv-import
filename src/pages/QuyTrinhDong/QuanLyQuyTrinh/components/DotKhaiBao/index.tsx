import { useModel } from 'umi';
import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import { Button, message, Modal, Popconfirm, Switch, Tooltip } from 'antd';
import type { DotQuyTrinh } from '@/services/QuyTrinhDong/DotQuyTrinh/typing';
import { DeleteOutlined, EditOutlined, TeamOutlined } from '@ant-design/icons';
import FormDotQuyTrinh from '@/pages/QuyTrinhDong/QuanLyQuyTrinh/components/DotKhaiBao/components/Form';
import dayjs from 'dayjs';
import { activeDot } from '@/services/QuyTrinhDong/DotQuyTrinh/dotquytrinh';
import { useState } from 'react';
import QuanLyHoiDong from '../../HoiDong';

const DotKhaiBao = () => {
	const { getModel, page, limit, condition, setRecord, deleteModel, setEdit, setVisibleForm } =
		useModel('quytrinh.dotquytrinh');
	const { record: recordKhaiBao } = useModel('quytrinh.quanlyquytrinh');
	const getData = async () => {
		getModel({ quyTrinhId: recordKhaiBao?._id });
	};

	const [visibleHoiDong, setVisibleHoiDong] = useState<boolean>(false);

	const handleCancelHoiDong = () => {
		setVisibleHoiDong(false);
	};

	const columns: IColumn<DotQuyTrinh.IRecord>[] = [
		{
			title: 'Tên đợt',
			dataIndex: 'ten',
			width: 280,
			filterType: 'string',
		},
		{
			title: 'Thời gian bắt đầu',
			dataIndex: 'thoiGianBatDau',
			width: 150,
			align: 'center',
			render: (val) => {
				return <>{val ? dayjs(val).format('DD/MM/YYYY') : 'Không có dữ liệu'}</>;
			},
		},
		{
			title: 'Thời gian kết thúc',
			dataIndex: 'thoiGianKetThuc',
			width: 150,
			align: 'center',
			render: (val) => {
				return <>{val ? dayjs(val).format('DD/MM/YYYY') : 'Không có dữ liệu'}</>;
			},
		},
		{
			title: 'Trạng thái',
			dataIndex: 'active',
			width: 150,
			align: 'center',
			render: (val, recordVal) => {
				return (
					<Switch
						checked={val}
						onChange={async (e) => {
							const res = await activeDot(recordVal?._id);
							if (res) {
								message.success('Chuyển trạng thái thành công');
								getData();
							}
						}}
					/>
				);
			},
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (recordVal: DotQuyTrinh.IRecord) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button
							onClick={() => {
								setRecord(recordVal);
								setEdit(true);
								setVisibleForm(true);
							}}
							type='link'
							icon={<EditOutlined />}
						/>
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(recordVal._id ?? '', getData)}
							title='Bạn có chắc chắn muốn xóa?'
							placement='topLeft'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
					<Tooltip title='Hội đồng'>
						<Button
							type='link'
							shape={'circle'}
							icon={<TeamOutlined />}
							onClick={() => {
								setVisibleHoiDong(true);
								setRecord(recordVal);
							}}
						/>
					</Tooltip>
				</>
			),
		},
	];
	return (
		<>
			<TableBase
				hideCard
				modelName={'quytrinh.dotquytrinh'}
				columns={columns}
				dependencies={[page, limit, condition]}
				getData={getData}
				Form={FormDotQuyTrinh}
				widthDrawer={800}
				destroyModal
			/>
			<Modal
				width={1300}
				styles={{ padding: 0 }}
				onCancel={handleCancelHoiDong}
				open={visibleHoiDong}
				footer={<Button onClick={handleCancelHoiDong}>Đóng</Button>}
			>
				<QuanLyHoiDong />
			</Modal>
		</>
	);
};
export default DotKhaiBao;
