import { useModel } from 'umi';
import TableBase from '@/components/Table';
import FormVanBan from '@/pages/QuanLyVanBan/components/Form';
import { IColumn } from '@/components/Table/typing';
import {Button, Popconfirm, Space, Tag, Tooltip} from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const QuanLyVanBan = () => {
	const { page, limit, condition, getModel, deleteModel, setRecord, setVisibleForm, setEdit } =
		useModel('quytrinh.quanlyvanban');
	const columns: IColumn<VanBan.IRecord>[] = [
		{
			title: 'Tên văn bản',
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
		},
		{
			title: 'Mã',
			dataIndex: 'ma',
			width: 150,
		},
		{
			title: 'Đường dẫn',
			dataIndex: 'url',
			width: 150,
			render: (val) => {
				return (
					<>
						<a href={val} target={'_blank'} rel='noreferrer'>
							Đường dẫn
						</a>
					</>
				);
			},
		},
		{
			title: 'Tags',
			dataIndex: 'tags',
			width: 150,
			render: (val) => {
				return (
					<>
            <Space>
              {val?.map((item: any, i: number) => {
                return <Tag  color={'green'}>{item}</Tag>;
              })}
            </Space>

					</>
				);
			},
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (recordVal: VanBan.IRecord) => (
				<>
					{/*<Tooltip title='Xem chi tiết'>*/}
					{/*	<Button onClick={() => {*/}
					{/*    setRecord(recordVal);*/}
					{/*    setEdit(true);*/}
					{/*    setVisibleForm(true);*/}
					{/*  }} type='link' icon={<EyeOutlined />} />*/}
					{/*</Tooltip>*/}
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
							onConfirm={() => deleteModel(recordVal._id ?? '', getModel)}
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
				title={'Quản lý văn bản'}
				modelName={'quytrinh.quanlyvanban'}
				columns={columns}
				Form={FormVanBan}
				getData={getModel}
				dependencies={[page, limit, condition]}
				widthDrawer={800}
        destroyModal
			/>
		</>
	);
};
export default QuanLyVanBan;
