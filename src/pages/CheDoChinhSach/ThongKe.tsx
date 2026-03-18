import { DeleteOutlined, EditOutlined, ExportOutlined, FileOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Collapse, Empty, Modal, Popconfirm, Spin, Tooltip } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import Form from '../QuyTrinhDong/QuanLyQuyTrinh/ThongKe/components/Form';
import ViewThongKe from '../QuyTrinhDong/QuanLyQuyTrinh/ThongKe/components/ViewThongKe';

const ThongKeBaoCao = () => {
	const intl = useIntl();
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
		getDataThongKeDocxModel,
		loading,
	} = useModel('chedochinhsach.thongke');

	const getData = () => {
		getAllModel(false);
	};

	useEffect(() => {
		getData();
	}, []);

	return (
		<Card title={intl.formatMessage({ id: 'chedochinhsach.thongke.title' })}>
			<div style={{ marginBottom: 8 }}>
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
					{intl.formatMessage({ id: 'global.button.themmoi' })}
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
											<Tooltip title={intl.formatMessage({ id: 'chedochinhsach.thongke.excel' })}>
												<Button
													loading={loading}
													onClick={(e) => {
														e.stopPropagation();
														getDataThongKeExcelModel(item.ten, item._id, { filters: [] });
													}}
													size='small'
													icon={<ExportOutlined />}
													type='link'
												/>
											</Tooltip>
											{item.fileId && (
												<Tooltip title={intl.formatMessage({ id: 'chedochinhsach.thongke.doc' })}>
													<Button
														loading={loading}
														onClick={(e) => {
															e.stopPropagation();
															getDataThongKeDocxModel(item.ten, item._id, { filters: [] });
														}}
														size='small'
														icon={<FileOutlined />}
														type='link'
													/>
												</Tooltip>
											)}
											<Tooltip title={intl.formatMessage({ id: 'global.button.chinhsua' })}>
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
											<Tooltip placement='bottom' title={intl.formatMessage({ id: 'global.button.xoa' })}>
												<Popconfirm
													title={intl.formatMessage({ id: 'chedochinhsach.thongke.confirm.xoa' })}
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
									<ViewThongKe type='CheDoChinhSach' idThongKe={item._id} />
								</Collapse.Panel>
							);
						})}
					</Collapse>
				) : (
					<Empty />
				)}
			</Spin>
			<Modal
				onCancel={() => setVisibleForm(false)}
				width={700}
				footer={null}
				styles={{ body: { padding: 0 } }}
				open={visibleForm}
			>
				<Form modelName={'chedochinhsach.thongke'} />
			</Modal>
		</Card>
	);
};

export default ThongKeBaoCao;
