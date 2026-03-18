import { EPhanHe } from '@/services/QuyTrinhDong/constant';
import { DeleteOutlined, EditOutlined, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Collapse, Empty, Modal, Popconfirm, Select, Spin, Tooltip } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';
import ViewThongKe from './components/ViewThongKe';

const ThongKeBaoCao = () => {
	const {
		getAllModel,
		setEdit,
		setRecord: setRecordThongKe,
		setVisibleForm,
		visibleForm,
		danhSach: danhSachThongKe,
		handleEdit,
		deleteModel,
		getDataThongKeExcelModel,
		loading,
	} = useModel('quytrinh.thongke');

	const {
		getAllQuyTrinhChiuTrachNhiemModel,
		record: recordQuyTrinh,
		danhSach,
		setRecord,
	} = useModel('quytrinh.quanlyquytrinh');

	const getData = () => {
		getAllModel(true, undefined, { quyTrinhId: recordQuyTrinh?._id });
	};

	useEffect(() => {
		getData();
	}, [recordQuyTrinh?._id]);

	useEffect(() => {
		getAllQuyTrinhChiuTrachNhiemModel();
	}, []);

	return (
		<Card title='Thống kê'>
			<div style={{ marginBottom: 8 }}>
				<Select
					allowClear
					style={{ width: 300 }}
					value={recordQuyTrinh?._id}
					onChange={(val) => {
						setRecord(danhSach.find((item) => item._id === val));
					}}
					placeholder={'Lọc theo dịch vụ'}
					options={danhSach
						.filter((item) => item.phanHe.includes(EPhanHe.CONG_TAC_SINH_VIEN))
						.map((item) => ({ value: item._id, label: item.ten }))}
				/>
				<Button
					onClick={() => {
						setEdit(false);
						setRecordThongKe(undefined);
						setVisibleForm(true);
					}}
					style={{ marginLeft: 8 }}
					type='primary'
					icon={<PlusOutlined />}
				>
					Thêm mới
				</Button>
			</div>
			<Spin spinning={loading}>
				{danhSachThongKe?.length > 0 ? (
					<Collapse style={{ border: 'none' }}>
						{danhSachThongKe.map((item) => {
							return (
								<Collapse.Panel
									style={{ border: 'none', backgroundColor: '#f2f2f2', marginBottom: 8, borderRadius: 10 }}
									extra={
										<div style={{ display: 'flex', width: 100, justifyContent: 'space-between' }}>
											<Tooltip title='Xuất excel'>
												<Button
													loading={loading}
													onClick={(e) => {
														e.stopPropagation();
														getDataThongKeExcelModel(item.ten, { thongKeQuyTrinhDongIds: [item._id] });
													}}
													size='small'
													icon={<ExportOutlined />}
													type='link'
												/>
											</Tooltip>
											<Tooltip title='Chỉnh sửa'>
												<Button
													onClick={(e) => {
														e.stopPropagation();
														handleEdit(item);
													}}
													size='small'
													icon={<EditOutlined />}
													type='link'
												/>
											</Tooltip>
											<Tooltip placement='bottom' title='Xóa'>
												<Popconfirm
													title='Bạn có chắc chắn muốn xóa?'
													onConfirm={() => {
														deleteModel(item._id, getData);
													}}
												>
													<Button
														onClick={(e) => {
															e.stopPropagation();
														}}
														size='small'
														icon={<DeleteOutlined />}
														danger
														type='link'
													/>
												</Popconfirm>
											</Tooltip>
										</div>
									}
									header={item.ten}
									key={item._id}
								>
									<ViewThongKe type='QuyTrinhDong' idThongKe={item._id} />
								</Collapse.Panel>
							);
						})}
					</Collapse>
				) : (
					<>
						<Empty />
					</>
				)}
			</Spin>
			<Modal
				onCancel={() => setVisibleForm(false)}
				width={700}
				footer={null}
				styles={{ padding: 0 }}
				open={visibleForm}
			>
				<Form isQuyTrinh modelName={'quytrinh.thongke'} />
			</Modal>
		</Card>
	);
};

export default ThongKeBaoCao;
