import { useModel } from 'umi';
import TableBase from '@/components/Table';
import FormTag from '@/pages/QuyTrinhDong/QuanLyTag/components/Form';
import type { IColumn } from '@/components/Table/typing';
import type { QuyTrinh } from '@/services/QuyTrinh/typings';
import { Button, Popconfirm, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const QuanLyTag = () => {
	const { getModel, page, limit, condition, deleteModel, setRecord, setEdit, setVisibleForm } =
		useModel('quytrinh.quanlytag');
	const columns: IColumn<Tag.IRecord>[] = [
		{
			title: 'Tên nhãn',
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (recordVal: QuyTrinh.IRecord) => (
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
				title={'Quản lý nhãn'}
				modelName={'quytrinh.quanlytag'}
				columns={columns}
				dependencies={[page, limit, condition]}
				Form={FormTag}
				getData={getModel}
				widthDrawer={600}
				destroyModal
			/>
		</>
	);
};
export default QuanLyTag;
