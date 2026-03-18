import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import type { HoiDong } from '@/services/QuyTrinh/HoiDong/typings';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useModel } from 'umi';
import FormHoiDong from './components/Form';
import TableThanhVien from './components/TableThanhVien';
import { useCallback, useState } from 'react';

const QuanLyHoiDong = () => {
	const { getModel, page, limit, condition, deleteModel, setRecord, setEdit, setVisibleForm } =
		useModel('quytrinh.hoidong');
	const { record: recordQuyTrinh } = useModel('quytrinh.quanlyquytrinh');

	const [visibleViewThanhVien, setVisibleViewThanhVien] = useState<boolean>(false);

	const onCancelViewThanhVien = useCallback(() => {
		setVisibleViewThanhVien(false);
	}, []);

	const columns: IColumn<HoiDong.IRecord>[] = [
		{
			title: 'Tên hội đồng',
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
		},
		{
			title: 'Thời gian',
			width: 150,
			render: (record: HoiDong.IRecord) => (
				<div>
					{dayjs(record.startDate).format('HH:mm DD/MM/YYYY')} - {dayjs(record.endDate).format('HH:mm DD/MM/YYYY')}
				</div>
			),
		},
		{
			title: 'Danh sách thành viên',
			width: 150,
			align: 'center',
			render: (record: HoiDong.IRecord) => (
				<Button
					onClick={() => {
						setRecord(record);
						setVisibleViewThanhVien(true);
					}}
					type='link'
				>
					{record.danhSachThanhVien.length} thành viên
				</Button>
			),
		},
		{
			title: 'Bước',
			width: 200,
			align: 'center',
			render: (record: HoiDong.IRecord) =>
				recordQuyTrinh?.danhSachBuocXuLy?.find((item) => item.ma === record.maBuoc)?.ten,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (rec: HoiDong.IRecord) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button
							onClick={() => {
								setRecord(rec);
								setEdit(true);
								setVisibleForm(true);
							}}
							type='link'
							icon={<EditOutlined />}
						/>
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(rec._id ?? '', getModel)}
							title='Bạn có chắc chắn muốn xóa?'
							placement='topLeft'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];
	return (
		<>
			<TableBase
				title={'Danh sách hội đồng'}
				modelName={'quytrinh.hoidong'}
				columns={columns}
				dependencies={[page, limit, condition]}
				Form={FormHoiDong}
				getData={getModel}
				widthDrawer={1000}
				destroyModal
			/>
			<Modal
				width={900}
				title='Danh sách thành viên'
				footer={
					<Button type='primary' onClick={onCancelViewThanhVien}>
						Đóng
					</Button>
				}
				open={visibleViewThanhVien}
				onCancel={onCancelViewThanhVien}
			>
				<TableThanhVien mode='view' />
			</Modal>
		</>
	);
};
export default QuanLyHoiDong;
