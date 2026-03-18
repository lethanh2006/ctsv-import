import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import type { TheChat } from '@/services/TienIch/TheChat/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import FormChiSoTheHinh from './components/Form';
import HumanBodyViewer from './components/HumanBodyViewer';

const ChiSoTheHinhPage = () => {
	const intl = useIntl();
	const { record: recDot } = useModel('tienich.thechat.dot');
	const { getModel, page, limit, deleteModel, handleEdit, setRecord, record } =
		useModel('tienich.thechat.chisothehinh');
	const [visibleModal, setVisibleModal] = useState<boolean>(false);

	const now = moment();
	const start = recDot?.thoiGianBatDau ? moment(recDot.thoiGianBatDau) : null;
	const end = recDot?.thoiGianKetThuc ? moment(recDot.thoiGianKetThuc) : null;
	const isTrongThoiGian = start && end && now.isAfter(start) && now.isBefore(end);

	const getData = () => {
		if (recDot?._id) getModel({ dotDanhGiaTheChatId: recDot?._id });
	};

	const onCell = (rec: TheChat.IChiSoHinhThe) => ({
		onClick: () => {
			setRecord(rec);
			setVisibleModal(true);
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<TheChat.IChiSoHinhThe>[] = [
		{
			title: 'Mã SV',
			align: 'center',
			dataIndex: 'maSv',
			width: 120,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Họ tên',
			dataIndex: 'tenSv',
			width: 180,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Chỉ số hình thể',
			width: 550,
			children: [
				{
					title: 'Chiều cao (cm)',
					dataIndex: 'chieuCao',
					width: 90,
					align: 'center',
					sortable: true,
					onCell,
				},
				{
					title: 'Cân nặng (kg)',
					dataIndex: 'canNang',
					width: 90,
					align: 'center',
					sortable: true,
					onCell,
				},
				{
					title: 'Vòng eo (cm)',
					dataIndex: 'vongEo',
					width: 90,
					align: 'center',
					sortable: true,
					onCell,
				},
				{
					title: 'Vòng mông (cm)',
					dataIndex: 'vongMong',
					width: 90,
					align: 'center',
					sortable: true,
					onCell,
				},
				{
					title: 'BMI (kg/m²)',
					dataIndex: 'bmi',
					width: 100,
					align: 'right',
					sortable: true,
					render: (val) => {
						let color = '';
						if (val < 18.5) color = '#1890ff';
						else if (val >= 18.5 && val < 25) color = '#52c41a';
						else if (val >= 25 && val < 30) color = '#faad14';
						else color = '#f5222d';
						return <span style={{ color, fontWeight: 600 }}>{val}</span>;
					},
					onCell,
				},
				{
					title: 'WHR',
					dataIndex: 'whr',
					width: 90,
					align: 'right',
					sortable: true,
					render: (val) => {
						let color = '';
						if (val < 0.8) color = '#52c41a';
						else if (val >= 0.8 && val < 0.9) color = '#faad14';
						else color = '#f5222d';
						return <span style={{ color, fontWeight: 600 }}>{val}</span>;
					},
					onCell,
				},
			],
		},
		{
			title: 'Đánh giá chung',
			dataIndex: 'danhGiaChung',
			width: 300,
			render: (val) => <ExpandText>{val}</ExpandText>,
			onCell,
		},
		{
			title: 'Người tạo',
			dataIndex: 'tenNguoiTao',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 100,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend
						disabled={!isTrongThoiGian}
						tooltip='Chỉnh sửa'
						onClick={() => handleEdit(rec)}
						type='link'
						icon={<EditOutlined />}
					/>
					<Popconfirm
						onConfirm={() => deleteModel(rec._id, getModel)}
						title='Bạn có chắc chắn muốn xóa bản ghi này?'
						placement='topRight'
					>
						<ButtonExtend disabled={!isTrongThoiGian} tooltip='Xóa' danger type='link' icon={<DeleteOutlined />} />
					</Popconfirm>
				</>
			),
		},
	];

	return (
		<>
			<TableBase
				params={{ dotDanhGiaTheChatId: recDot?._id }}
				getData={getData}
				columns={columns}
				dependencies={[page, limit, recDot?._id]}
				modelName='tienich.thechat.chisothehinh'
				title='Chỉ số hình thể'
				Form={FormChiSoTheHinh}
				formProps={{ getData }}
				buttons={{
					create: isTrongThoiGian ? true : false,
					import: isTrongThoiGian ? true : false,
					export: isTrongThoiGian ? true : false,
				}}
				hideCard
			/>

			{record?.ssoIdSinhVien && (
				<Modal
					title='Thông tin kết quả & chỉ số hình thể sinh viên'
					visible={visibleModal}
					onCancel={() => setVisibleModal(false)}
					footer={null}
					width={800}
				>
					<HumanBodyViewer ssoId={record?.ssoIdSinhVien} />

					<div className='form-footer'>
						<Button onClick={() => setVisibleModal(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
					</div>
				</Modal>
			)}
		</>
	);
};

export default ChiSoTheHinhPage;
