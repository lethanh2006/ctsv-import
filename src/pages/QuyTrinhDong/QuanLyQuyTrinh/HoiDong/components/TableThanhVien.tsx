import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { HoiDong } from '@/services/QuyTrinh/HoiDong/typings';

import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, Popconfirm, Space, Tooltip } from 'antd';
import { useCallback, useState } from 'react';
import { useModel } from 'umi';
import FormThanhVien from './FormThanhVien';

const TableThanhVien = (props: { mode: 'view' | 'edit'; data?: HoiDong.ThanhVienHoiDong[] }) => {
	const { record: recordHoiDong, setRecord: setRecordHoiDong } = useModel('quytrinh.hoidong');

	const [edit, setEdit] = useState<boolean>(false);
	const [visibleForm, setVisibleForm] = useState<boolean>(false);
	const [record, setRecord] = useState<HoiDong.ThanhVienHoiDong>();

	const onCancelForm = useCallback(() => {
		setVisibleForm(false);
	}, []);

	const columns: IColumn<HoiDong.ThanhVienHoiDong>[] = [
		{
			title: 'Họ tên',
			dataIndex: 'ten',
			width: 120,
			align: 'center',
		},
		{
			title: 'Đơn vị công tác',
			width: 120,
			dataIndex: 'donVi',
		},
		{
			title: 'Vai trò',
			dataIndex: 'vaiTroHoiDong',
			width: 120,
			align: 'center',
		},

		{
			title: 'Thao tác',
			align: 'center',
			width: 80,
			fixed: 'right',
			hide: props.mode === 'view',
			render: (rec: HoiDong.ThanhVienHoiDong) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button
							size='small'
							onClick={() => {
								setEdit(true);
								setVisibleForm(true);
								setRecord(rec);
							}}
							shape='circle'
							icon={<EditOutlined />}
							type='link'
						/>
					</Tooltip>
					<Divider type='vertical' />
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => {
								setRecordHoiDong({
									...recordHoiDong,
									danhSachThanhVien:
										recordHoiDong?.danhSachThanhVien
											?.map((item, index) => ({ ...item, index: index + 1 }))
											.filter((item) => item.index !== rec.index) ?? [],
								} as HoiDong.IRecord);
							}}
							title='Bạn có chắc chắn muốn xóa?'
						>
							<Button size='small' shape='circle' type={'link'} danger icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	return (
		<>
			<TableStaticData
				addStt
				data={
					props?.data
						? props.data
						: (recordHoiDong?.danhSachThanhVien?.map((item, index) => ({ ...item, index: index + 1 })) ?? [])
				}
				otherProps={{
					pagination: false,
					size: 'small',
				}}
				columns={columns?.filter((item) => item.hide !== true)}
			>
				{props.mode === 'edit' && (
					<Space wrap>
						<Button
							size='small'
							type='primary'
							icon={<PlusCircleOutlined />}
							onClick={() => {
								setEdit(false);
								setVisibleForm(true);
								setRecord(undefined);
							}}
						>
							Thêm mới
						</Button>
					</Space>
				)}
			</TableStaticData>
			<Modal
				zIndex={1002}
				destroyOnClose
				open={visibleForm}
				onCancel={onCancelForm}
				footer={null}
				styles={{ padding: 0 }}
			>
				<FormThanhVien record={record} edit={edit} onCancel={onCancelForm} />
			</Modal>
		</>
	);
};

export default TableThanhVien;
