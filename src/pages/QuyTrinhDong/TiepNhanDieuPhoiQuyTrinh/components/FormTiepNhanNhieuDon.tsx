import { Button, Col, Form, Input, message, Modal, Row, Select, Spin, Tooltip } from 'antd';

import ImportExcel from '@/components/ImportExcel';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import SelectQuyTrinh from '@/pages/QuyTrinhDong/QuanLyQuyTrinh/Select';
import SelectVanBan from '@/pages/QuyTrinhDong/QuanLyVanBan/Select';
import { TrangThaiTiepNhanDon } from '@/services/QuyTrinhDong/KhaiBaoQuyTrinh/constants';
import { chuyenVienTiepNhanImport } from '@/services/QuyTrinhDong/KhaiBaoQuyTrinh/khaibaoquytrinh';
import type { QuyTrinh } from '@/services/QuyTrinhDong/typings';
import rules from '@/utils/rules';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
const { TextArea } = Input;

const FormTiepNhanNhieuDon = (props: { handleCancel: () => void }) => {
	const intl = useIntl();
	const { handleCancel } = props;
	const { danhSach } = useModel('quytrinh.quanlyquytrinh');
	const [curentQuyTrinhSelect, setCurentQuyTrinhSelect] = useState<QuyTrinh.IRecord>();
	const [maFormKhaiBaoSelect, setMaFormKhaiBaoSelect] = useState<string>();
	const [visibleThamChieu, setVisbleThamChieu] = useState<boolean>(false);
	const [editThamChieu, setEditThamChieu] = useState<boolean>(false);
	const [loadingDuyet, setLoadingDuyet] = useState<boolean>(false);
	const [recordThamChieu, setRecordThamChieu] = useState<any>();
	const [dataDanhSachThamChieu, setDataDanhSachThamChieu] = useState<any[]>([]);
	const [ImportExcelType, setImportExcelType] = useState<string>('');
	const [currentTypeDuyet, setCurrentTypeDuyet] = useState<string>('');
	const [visible, setVisible] = useState<boolean>(false);
	const onFinish = async (values: any) => {
		try {
			if (dataDanhSachThamChieu?.length < 1) {
				message.warning('Vui lòng thêm danh sách tham chiếu đơn');
				return;
			}
			setLoadingDuyet(true);
			const payload = {
				...values,
				danhSachThamChieu: dataDanhSachThamChieu?.map((val) => val?.ten),
			};
			const res = await chuyenVienTiepNhanImport(payload);
			if (res) {
				message.success('Tiếp nhận thành công');
				handleCancel();
			}
		} catch (e) {
			console.log(e);
		} finally {
			setLoadingDuyet(false);
		}
	};
	const columns: IColumn<any>[] = [
		{
			title: intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.form.ten' }),
			dataIndex: 'ten',
			width: 150,
		},
		{
			title: intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.form.thaotac' }),
			width: 150,
			align: 'center',
			render: (recordVal) => {
				return (
					<>
						<Tooltip title={intl.formatMessage({ id: 'global.button.chinhsua' })}>
							<Button
								onClick={() => {
									setRecordThamChieu(recordVal);
									setEditThamChieu(true);
									setVisbleThamChieu(true);
									// history.push(`/quan-ly-khoa-hoc/khai-bao-quy-trinh/${recordVal?._id}`);
								}}
								type='link'
								icon={<EditOutlined />}
							/>
						</Tooltip>
						<Tooltip title={intl.formatMessage({ id: 'global.button.xoa' })}>
							<Button
								onClick={() => {
									if (dataDanhSachThamChieu) {
										setDataDanhSachThamChieu(dataDanhSachThamChieu?.filter((item) => item?.id !== recordVal?.id));
									}
									// history.push(`/quan-ly-khoa-hoc/khai-bao-quy-trinh/${recordVal?._id}`);
								}}
								danger
								type='link'
								icon={<DeleteOutlined />}
							/>
						</Tooltip>
					</>
				);
			},
		},
	];
	const handleData = (newData: any[]) => {
		const oldData = [...dataDanhSachThamChieu];
		const data = {};
		// @ts-ignore
		data[ImportExcelType] = _.union(
			oldData,
			newData
				?.filter((item) => item?.[0] !== null && item?.[0] !== undefined)
				?.map((item: any[]) =>
					typeof item?.[0] === 'string'
						? { id: nanoid(), ten: item?.[0]?.trim() ?? '' }
						: { id: nanoid(), ten: item?.[0] },
				),
		);

		// form.setFieldsValue(data);
		// @ts-ignore
		setDataDanhSachThamChieu(data?.[ImportExcelType]);
		setVisible(false);
	};
	return (
		<>
			<Spin spinning={loadingDuyet}>
				<Form layout={'vertical'} onFinish={onFinish}>
					<Row>
						<Col span={24}>
							<Form.Item
								name={'quyTrinhId'}
								label={intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.form.quytrinh' })}
								rules={[...rules.required]}
							>
								<SelectQuyTrinh
									allowClear
									onChange={(val: any) => {
										const obj = danhSach?.find((item) => item?._id === val);
										setCurentQuyTrinhSelect(obj);
									}}
								/>
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item
								name={'maBuoc'}
								label={intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.form.buoc' })}
								rules={[...rules.required]}
							>
								<Select
									placeholder={intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.form.buoc.place' })}
									style={{ width: '100%' }}
									allowClear
									onChange={(val) => {
										const obj = curentQuyTrinhSelect?.danhSachBuocXuLy?.find((item) => item.ma === val);
										if (obj) {
											setMaFormKhaiBaoSelect(obj?.maFormKhaiBao);
										}
										// setCondition({
										//   ...condition,
										//   maBuoc: val,
										// });
									}}
									notFoundContent={intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.form.buoc.empty' })}
									options={curentQuyTrinhSelect?.danhSachBuocXuLy?.map((val) => {
										return {
											value: val?.ma,
											label: val?.ten,
										};
									})}
								/>
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item
								name={'trangThaiTiepNhan'}
								label={intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.form.ketqua' })}
								rules={[...rules.required]}
							>
								<Select
									placeholder={intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.form.ketqua.place' })}
									style={{ width: '100%' }}
									allowClear
									onChange={(val) => {
										setCurrentTypeDuyet(val);
									}}
									options={Object.values(TrangThaiTiepNhanDon)?.map((val) => {
										return {
											value: val,
											label: val,
										};
									})}
								/>
							</Form.Item>
						</Col>
						{currentTypeDuyet === TrangThaiTiepNhanDon.DUYET && (
							<Col span={24}>
								<Form.Item
									label={intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.form.vanban' })}
									name={'maVanBan'}
									rules={currentTypeDuyet !== TrangThaiTiepNhanDon.DUYET ? [...rules.required] : []}
								>
									<SelectVanBan dataState={'ma'} hasCreate />
								</Form.Item>
							</Col>
						)}
						<Col span={24}>
							<Form.Item name={'ghiChu'} label={intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.form.ghichu' })}>
								<TextArea
									rows={4}
									placeholder={intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.form.ghichu.place' })}
								/>
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item name={'quyTrinhId'} label={intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.form.dsdon' })}>
								<TableStaticData
									setShowEdit={() => {
										setVisbleThamChieu(true);
									}}
									data={dataDanhSachThamChieu}
									columns={columns}
									hasCreate={true}
								>
									<Button
										onClick={() => {
											setVisible(true);
											setImportExcelType('MaThanToan');
										}}
									>
										{intl.formatMessage({ id: 'global.button.nhapdulieu' })}
									</Button>
								</TableStaticData>
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item
								name={'maTruongThamChieu'}
								label={intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.form.truongtt' })}
								rules={[...rules.required]}
							>
								<Select
									placeholder={intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.form.truongtt.place' })}
									style={{ width: '100%' }}
									allowClear
									onChange={(val) => {
										// setCondition({
										//   ...condition,
										//   maBuoc: val,
										// });
									}}
									notFoundContent={'Vui lòng chọn bước'}
									options={curentQuyTrinhSelect?.danhSachFormKhaiBao
										?.find((item) => item?.ma === maFormKhaiBaoSelect)
										?.cauHinhLoaiHinh?.map((val) => {
											return {
												value: val?.ma,
												label: val?.ten,
											};
										})}
								/>
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item>
								<div style={{ display: 'flex', justifyContent: 'center' }}>
									<Button style={{ marginRight: 8 }} type={'primary'} htmlType={'submit'}>
										{intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.form.button.tiepnhan' })}
									</Button>
									<Button
										onClick={() => {
											handleCancel();
										}}
									>
										{intl.formatMessage({ id: 'global.button.dong' })}
									</Button>
								</div>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Spin>

			<Modal
				title={intl.formatMessage({ id: 'global.button.themmoi' })}
				open={visibleThamChieu}
				onCancel={() => setVisbleThamChieu(false)}
				width={800}
				// footer={
				// 	<>
				// 		<Button onClick={() => setVisibleForm(false)}>Đóng</Button>
				// 	</>
				// }
				destroyOnClose
				footer={null}
			>
				<Form
					onFinish={async (values: any) => {
						try {
							const arr = [...dataDanhSachThamChieu];
							if (editThamChieu) {
								const obj = arr.find((item) => item?.id === recordThamChieu?.id);
								if (obj) {
									const obj2 = {
										...recordThamChieu,
										ten: values?.ten,
									};
									arr?.forEach((item, i) => {
										if (item?.id === recordThamChieu?.id) {
											arr?.splice(i, 1, obj2);
										}
									});
									setDataDanhSachThamChieu(arr);
								}
							} else {
								arr.push({ ...values, id: nanoid() });
								setDataDanhSachThamChieu(arr);
							}

							setVisbleThamChieu(false);
						} catch (e) {
							console.log(e);
						}
					}}
					initialValues={editThamChieu ? recordThamChieu : undefined}
				>
					<Form.Item label={intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.form.ten' })} name={'ten'}>
						<Input placeholder={intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.form.ten.place' })} />
					</Form.Item>
					<Form.Item>
						<div style={{ display: 'flex', justifyContent: 'center' }}>
							<Button style={{ marginRight: 8 }} type={'primary'} htmlType={'submit'}>
								{intl.formatMessage({ id: 'global.button.themmoi' })}
							</Button>
							<Button onClick={() => setVisbleThamChieu(false)}>
								{intl.formatMessage({ id: 'global.button.dong' })}
							</Button>
						</div>
					</Form.Item>
				</Form>
			</Modal>
			<Modal
				footer={null}
				open={visible}
				styles={{ body: { padding: 0 } }}
				onCancel={() => {
					setVisible(false);
				}}
				destroyOnClose
			>
				<ImportExcel
					handleData={handleData}
					title={'Import '}
					onCancel={() => {
						setVisible(false);
					}}
				/>
			</Modal>
		</>
	);
};
export default FormTiepNhanNhieuDon;
