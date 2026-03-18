import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type TinTuc } from '@/services/TienIch/TinTuc/typing';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useModel } from 'umi';
// import FilterPhamVi from '../ChuDe/components/Filter';
import SelectChuDe from '../ChuDe/components/Select';
import Form from './components/Form';
import ViewTinTuc from './components/ViewTinTuc';

const TinTucPage = () => {
	const { getModel, deleteModel, setRecord, page, limit, handleEdit } = useModel('tintuc.tintuc');
	const [visibleModal, setVisibleModal] = useState<boolean>(false);
	// const canUpdate = useCheckAccess('tin-tuc:update');
	// const canDelete = useCheckAccess('tin-tuc:delete');
	// const canCreate = useCheckAccess('tin-tuc:create');

	const onCell = (record: TinTuc.IRecord) => ({
		onClick: () => {
			setRecord(record);
			setVisibleModal(true);
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<TinTuc.IRecord>[] = [
		{
			title: 'Tiêu đề',
			dataIndex: 'tieuDe',
			width: 200,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Mô tả',
			dataIndex: 'moTa',
			width: 250,
			filterType: 'string',
			render: (val) => <ExpandText>{val}</ExpandText>,
		},
		// {
		//   title: 'Phạm vi',
		//   dataIndex: 'phamVi',
		//   width: 100,
		//   filterType: 'select',
		//   filterData: Object.values(EPhamViChuDe),
		//   onCell,
		// },
		{
			title: 'Chủ đề',
			dataIndex: 'idTopic',
			width: 150,
			filterType: 'customselect',
			filterCustomSelect: <SelectChuDe multiple />,
			render: (val, rec) => rec.chuDe?.name ?? '--',
			onCell,
		},
		{
			title: 'Ngày đăng',
			dataIndex: 'ngayDang',
			width: 100,
			align: 'center',
			filterType: 'date',
			sortable: true,
			render: (val) => dayjs(val).format('HH:mm DD/MM/YYYY'),
			onCell,
		},
		{
			title: 'Người đăng',
			dataIndex: ['nguoiDang', 'username'],
			width: 100,
			onCell,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (record) => (
				<>
					<Tooltip title='Xem chi tiết'>
						<Button
							onClick={() => {
								setRecord(record);
								setVisibleModal(true);
							}}
							type='link'
							icon={<EyeOutlined />}
						/>
					</Tooltip>
					<Tooltip title='Chỉnh sửa'>
						<Button
							// disabled={!canUpdate}
							onClick={() => handleEdit(record)}
							type='link'
							icon={<EditOutlined />}
						/>
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm onConfirm={() => deleteModel(record._id, getModel)} title='Bạn có chắc chắn muốn xóa tin này?'>
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
				columns={columns}
				dependencies={[page, limit]}
				modelName='tintuc.tintuc'
				widthDrawer={900}
				title='Tin tức'
				Form={Form}
			>
				{/* <FilterPhamVi modelName="tintuc.tintuc" /> */}
			</TableBase>

			<Modal
				width={900}
				styles={{ padding: 0 }}
				destroyOnClose
				okButtonProps={{ hidden: true }}
				cancelText='Đóng'
				onCancel={() => setVisibleModal(false)}
				open={visibleModal}
			>
				<ViewTinTuc />
			</Modal>
		</>
	);
};

export default TinTucPage;
