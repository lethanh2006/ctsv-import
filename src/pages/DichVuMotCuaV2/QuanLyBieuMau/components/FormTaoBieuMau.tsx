/* eslint-disable no-underscore-dangle */
import FormView from '@/pages/DichVuMotCuaV2/components/FormBieuMau';
import { DichVuMotCuaV2 } from '@/services/DVMC/DichVuMotCuaV2/typing';
import { uploadFile } from '@/services/uploadFile';
import {
	ArrowDownOutlined,
	ArrowLeftOutlined,
	ArrowRightOutlined,
	ArrowUpOutlined,
	CloseCircleOutlined,
	EyeOutlined,
	PlusOutlined,
} from '@ant-design/icons';
import { Button, Card, Form, Modal } from 'antd';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import { useModel } from 'umi';
import styles from './block.css';
import Block from './BlockBieuMau';

const FormBieuMau = () => {
	const [form] = Form.useForm();
	const { loading, edit, visibleFormBieuMau, setVisibleFormBieuMau, record, setRecord, setCurrent, loaiDichVu } =
		useModel('dvmc.dichvumotcuav2');
	const [recordView, setRecordView] = useState<DichVuMotCuaV2.Don>();
	const [viewBieuBMau, setViewBieuBMau] = useState<boolean>(false);
	//@ts-ignore
	const [choPhepGuiNhieuLan, setChoPhepGuiNhieuLan] = useState<boolean>(
		record?.thongTinThuTuc?.choPhepGuiNhieuLan ?? false,
	);

	const buildPostData = (arrCauHinh: DichVuMotCuaV2.CauHinhBieuMau[]): DichVuMotCuaV2.CauHinhBieuMau[] => {
		return (
			arrCauHinh?.map((item) => {
				return {
					...item,
					dataSource: item?.dataSource?.map((data) => ({
						...data,
						relatedElement: buildPostData(data?.relatedElement ?? []),
					})),
					relatedElement: buildPostData(item?.relatedElement ?? []),
					_id: item?._id ?? nanoid(),
				};
			}) ?? []
		);
	};

	const buildUpLoadFile = async (values: any, name: string) => {
		if (values?.[name]?.fileList?.[0]?.originFileObj) {
			const response = await uploadFile({
				file: values?.[name]?.fileList?.[0]?.originFileObj,
				// filename: values?.[name]?.fileList?.[0]?.name?.split('.')?.[0] ?? 'fileName',
				public: '1',
			});
			return {
				...response?.data?.data?.file,
				_id: response?.data?.data?.file?.id,
			};
		} else {
			// @ts-ignore
			return values?.[name]?.fileList?.[0]?.url ? record?.[name] : {};
		}
	};

	return (
		<Card title={edit ? 'Chỉnh sửa biểu mẫu' : 'Thêm mới biểu mẫu'}>
			<Form
				scrollToFirstError
				labelCol={{ span: 24 }}
				onFinish={async (values) => {
					values.fileMau = await buildUpLoadFile(values, 'fileMau');
					values.fileTraLoi = await buildUpLoadFile(values, 'fileTraLoi');
					setRecord({
						...record,
						fileMau: loaiDichVu === 'DVMC' ? record?.fileMau : values.fileMau,
						fileTraLoi: loaiDichVu === 'DVMC' ? record?.fileTraLoi : values.fileTraLoi,
						thongTinThuTuc:
							loaiDichVu === 'DVMC'
								? record?.thongTinThuTuc
								: {
										choPhepGuiNhieuLan,
									},
						ten: loaiDichVu === 'DVMC' ? record?.ten : values?.ten,
						ghiChu: loaiDichVu === 'DVMC' ? record?.ghiChu : values?.ghiChu,
						cauHinhBieuMau: buildPostData(values?.cauHinhBieuMau ?? []),
					} as DichVuMotCuaV2.BieuMau);

					setCurrent(2);
				}}
				form={form}
			>
				<Form.List
					name='cauHinhBieuMau'
					initialValue={record?.cauHinhBieuMau ?? []}
					rules={[
						{
							validator: async (_, names) => {
								if (!names || names.length < 1) {
									return Promise.reject(new Error('Ít nhất 1 khối'));
								}
								return '';
							},
						},
					]}
				>
					{(fields, { add, remove, move }, { errors }) => {
						return (
							<>
								{fields.map((field, index) => (
									<div key={field.key}>
										<Card
											size='small'
											headStyle={{ padding: '0px 24px' }}
											styles={{ padding: '8px 24px' }}
											className={styles.block}
											title={
												<>
													<div style={{ float: 'left' }}>Khối {index + 1}</div>
													<CloseCircleOutlined
														style={{ float: 'right', marginLeft: 8 }}
														onClick={() => remove(field.name)}
													/>
													<ArrowUpOutlined
														style={{ float: 'right', marginLeft: 8 }}
														onClick={() => move(field.name, field.name - 1)}
													/>
													<ArrowDownOutlined
														style={{ float: 'right' }}
														onClick={() => move(field.name, field.name + 1)}
													/>
												</>
											}
										>
											<Block fieldName={`cauHinhBieuMau.[${index}]`} field={{ ...field }} index={index} />
										</Card>

										<br />
									</div>
								))}
								<Form.Item>
									<Button type='dashed' onClick={() => add()} style={{ width: '100%' }} icon={<PlusOutlined />}>
										Thêm khối
									</Button>
									<Form.ErrorList errors={errors} />
								</Form.Item>
							</>
						);
					}}
				</Form.List>

				<Form.Item style={{ marginBottom: 0, position: 'fixed', top: 14, right: 48 }}>
					<div style={{ display: 'flex' }}>
						<Button
							icon={<EyeOutlined />}
							style={{ marginRight: 8 }}
							onClick={() => {
								const valueView = form.getFieldsValue(true);
								setRecordView({ thongTinDichVu: { ...valueView } } as DichVuMotCuaV2.Don);
								setViewBieuBMau(true);
							}}
						>
							Xem trước
						</Button>
						{loaiDichVu === 'DVMC' && (
							<Button
								icon={<ArrowLeftOutlined />}
								loading={loading}
								style={{ marginRight: 8 }}
								type='primary'
								onClick={() => {
									const valueView = form.getFieldsValue(true);
									setRecord({ ...record, ...valueView });
									setCurrent(0);
								}}
							>
								Quay lại
							</Button>
						)}
						<Button
							icon={<ArrowRightOutlined />}
							loading={loading}
							style={{ marginRight: 8 }}
							htmlType='submit'
							type='primary'
						>
							Tiếp theo
						</Button>
					</div>
				</Form.Item>
			</Form>
			<Modal
				destroyOnClose
				width='60%'
				footer={null}
				open={viewBieuBMau}
				styles={{ padding: 0 }}
				onCancel={() => {
					setViewBieuBMau(false);
				}}
			>
				<FormView type='view' record={recordView} />
			</Modal>
		</Card>
	);
};

export default FormBieuMau;
