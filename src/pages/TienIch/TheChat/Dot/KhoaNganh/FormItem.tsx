import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import type { TheChat } from '@/services/TienIch/TheChat/typing';
import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm } from 'antd';
import { useModel } from 'umi';
import Form from './Form';

const FormItemKhoaNganhTheChat = (props: {
	value?: TheChat.IDanhSachKhoaNganh[];
	onChange?: (data: TheChat.IDanhSachKhoaNganh[]) => void;
}) => {
	const { setVisibleForm, visibleForm, setEdit, edit, record, setRecord, isView, setIsView } =
		useModel('tienich.thechat.khoanganh');
	const { value = [], onChange } = props;

	const onDelete = (index: number) => {
		const data = [...value];
		data.splice(index, 1);
		onChange?.(data);
	};

	const onAdd = (rec: TheChat.IDanhSachKhoaNganh) => {
		if (!record?.index) {
			const data = [...value, rec];
			onChange?.(data);
			setVisibleForm(false);
		} else {
			const data = [...value];
			data.splice(record.index - 1, 1, rec);
			onChange?.(data);
			setVisibleForm(false);
		}
	};

	const columns: IColumn<TheChat.IDanhSachKhoaNganh>[] = [
		{
			title: 'Mã khóa ngành',
			dataIndex: 'maKhoaNganh',
			width: 120,
		},
		{
			title: 'Tên khóa ngành',
			dataIndex: 'tenKhoaNganh',
			width: 200,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<Popconfirm
					onConfirm={() => onDelete(rec.index - 1)}
					title='Bạn có chắc chắn muốn xóa bản ghi này?'
					placement='topLeft'
				>
					<ButtonExtend tooltip='Xóa' danger type='link' icon={<DeleteOutlined />} />
				</Popconfirm>
			),
		},
	];

	return (
		<>
			<TableStaticData
				data={value} // ✅ dùng trực tiếp value, không còn [0]?.danhSachKhoaNganh
				columns={columns}
				size='small'
				hasTotal
				addStt
				otherProps={{ pagination: false, scroll: { y: 400 } }}
			>
				<Button
					icon={<PlusCircleOutlined />}
					onClick={() => {
						setRecord({} as TheChat.IDanhSachKhoaNganh);
						setEdit(false);
						setIsView(false);
						setVisibleForm(true);
					}}
					size='small'
					type='primary'
				>
					Thêm mới
				</Button>
			</TableStaticData>

			<Modal
				title={`${edit ? 'Chỉnh sửa' : isView ? 'Chi tiết' : 'Thêm mới'} khóa ngành`}
				visible={visibleForm}
				width={900}
				footer={null}
				onCancel={() => setVisibleForm(false)}
			>
				<Form onOk={onAdd} />
			</Modal>
		</>
	);
};

export default FormItemKhoaNganhTheChat;
