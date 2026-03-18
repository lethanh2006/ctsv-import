import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { colorXepLoaiTheChat, EXepLoaiTheChat } from '@/services/TienIch/TheChat/constant';
import type { TheChat } from '@/services/TienIch/TheChat/typing';
import { DeleteOutlined, EditOutlined, MenuOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, Modal, Popconfirm, Select, Tag } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import FormChiSoTheHinh from '../../ChiSoTheHinh/components/Form';
import HumanBodyViewer from '../../ChiSoTheHinh/components/HumanBodyViewer';
import Form from './components/Form';

const KetQuaTheChatPage = () => {
	const intl = useIntl();
	const { record: recDot } = useModel('tienich.thechat.dot');
	const {
		getModel,
		page,
		limit,
		deleteModel,
		handleEdit,
		record,
		setRecord: setRecTheChat,
	} = useModel('tienich.thechat.ketquathechat');
	const { setRecord, setEdit, setIsView, visibleForm, setVisibleForm } = useModel('tienich.thechat.chisothehinh');
	const [visibleModal, setVisibleModal] = useState<boolean>(false);

	const now = moment();
	const start = recDot?.thoiGianBatDau ? moment(recDot.thoiGianBatDau) : null;
	const end = recDot?.thoiGianKetThuc ? moment(recDot.thoiGianKetThuc) : null;
	const isTrongThoiGian = start && end && now.isAfter(start) && now.isBefore(end);

	const handleAddHinhThe = (rec: TheChat.IKetQuaTheChat) => {
		setRecTheChat(rec);
		setRecord({} as TheChat.IChiSoHinhThe);
		setEdit(false);
		setIsView(false);
		setVisibleForm(true);
	};

	const getData = () => {
		if (recDot?._id) getModel({ dotDanhGiaTheChatId: recDot?._id });
	};

	const onCell = (rec: TheChat.IKetQuaTheChat) => ({
		onClick: () => {
			setRecTheChat(rec);
			setVisibleModal(true);
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<TheChat.IKetQuaTheChat>[] = [
		{
			title: 'Mã SV',
			dataIndex: 'maSv',
			align: 'center',
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
			title: 'Lớp hành chính',
			dataIndex: 'lopHanhChinh',
			width: 120,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Tiêu chi đánh giá',
			dataIndex: 'maDanhMuc',
			width: 200,
			render: (val, rec) => [rec?.danhMuc?.ten, `(${rec?.danhMuc?.donViDoLuong})`].filter(Boolean).join(' '),
			filterType: 'customselect',
			filterCustomSelect: (
				<Select
					placeholder='Chọn tiêu chí đánh giá'
					options={recDot?.danhMucTheChat?.map((item) => ({
						value: item?.maDanhMuc,
						label: item.danhMuc?.ten,
					}))}
				/>
			),
			onCell,
		},
		{
			title: 'Kết quả',
			dataIndex: 'giaTri',
			align: 'center',
			width: 120,
			render: (val, rec) => `${val} ${rec?.danhMuc?.donViDoLuong}`,
			sortable: true,
			onCell,
		},
		{
			title: 'Thời gian đánh giá',
			align: 'center',
			dataIndex: 'thoiGianDanhGia',
			width: 120,
			render: (val, rec) => val && moment(val).format('HH:mm DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
			onCell,
		},
		{
			title: 'Cán bộ đánh giá',
			dataIndex: 'tenNguoiDanhGia',
			width: 180,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Xếp loại',
			dataIndex: 'xepLoai',
			align: 'center',
			width: 90,
			render: (val, rec) => <Tag color={colorXepLoaiTheChat[val as EXepLoaiTheChat]}>{val}</Tag>,
			filterType: 'select',
			filterData: Object.values(EXepLoaiTheChat),
			fixed: 'right',
			onCell,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => {
				const menu = (
					<Menu>
						<Menu.Item key='edit' disabled={!isTrongThoiGian}>
							<ButtonExtend type='link' onClick={() => handleEdit(rec)} icon={<EditOutlined />} size='small'>
								Chỉnh sửa
							</ButtonExtend>
						</Menu.Item>

						<Menu.Item key='delete' disabled={!isTrongThoiGian}>
							<Popconfirm
								title='Bạn có chắc chắn muốn xóa kết quả này?'
								onConfirm={() => deleteModel(rec?._id ?? '', getModel)}
								placement='topRight'
							>
								<ButtonExtend type='link' danger icon={<DeleteOutlined />} size='small'>
									Xóa
								</ButtonExtend>
							</Popconfirm>
						</Menu.Item>
					</Menu>
				);

				return (
					<>
						<ButtonExtend
							disabled={!isTrongThoiGian}
							tooltip='Chỉ số hình thể sinh viên'
							onClick={() => handleAddHinhThe(rec)}
							type='link'
							icon={<PlusCircleOutlined />}
						/>

						<Dropdown overlay={menu} trigger={['click']}>
							<ButtonExtend disabled={!isTrongThoiGian} type='link' icon={<MenuOutlined />} />
						</Dropdown>
					</>
				);
			},
		},
	];

	return (
		<>
			<TableBase
				params={{ dotDanhGiaTheChatId: recDot?._id }}
				getData={getData}
				columns={columns}
				dependencies={[page, limit, recDot?._id]}
				modelName='tienich.thechat.ketquathechat'
				Form={Form}
				formProps={{ getData }}
				hideCard
				buttons={{
					create: isTrongThoiGian ? true : false,
					import: isTrongThoiGian ? true : false,
					export: isTrongThoiGian ? true : false,
				}}
				title='Sinh viên thể chất'
				destroyModal
			/>

			<Modal
				styles={{ body: { padding: 0 } }}
				visible={visibleForm}
				onCancel={() => setVisibleForm(false)}
				footer={null}
			>
				<FormChiSoTheHinh title='Chỉ số hình thể' getData={getData} />
			</Modal>

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

export default KetQuaTheChatPage;
