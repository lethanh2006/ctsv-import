import formWaiting from '@/components/Loading/FormWaiting';
import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import FormThemMoiSinhVien from '@/pages/SuKienV2/components/FormThemMoiSinhVien';
import ViewKhaoSat from '@/pages/SuKienV2/components/ViewKhaoSat/View';
import { exportDanhSachSinhVien, getThongKeSinhVien, xemKhaoSat } from '@/services/SuKienV2';
import { ELoaiKhaoSatSuKien, ETrangThaiThamGia } from '@/services/SuKienV2/constant';
import type { SuKienV2 } from '@/services/SuKienV2/typings';
import { getFilenameHeader } from '@/utils/utils';
import {
	CheckOutlined,
	CloseOutlined,
	DeleteOutlined,
	EditOutlined,
	ExportOutlined,
	MenuOutlined,
	UndoOutlined,
} from '@ant-design/icons';
import { Badge, Button, Card, Checkbox, Col, Divider, Modal, Popconfirm, Popover, Row, Tooltip, message } from 'antd';
import dayjs from 'dayjs';
import fileDownload from 'js-file-download';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';

interface IProps {
	type: 'Đăng ký' | 'Tham gia';
	disabled?: boolean;
}
const color = ['blue', 'green', 'yellow', 'red', 'pink', 'orange'];
const DanhSachSinhVien = (props: IProps) => {
	const intl = useIntl();
	const { type } = props;
	const {
		getModel,
		page,
		limit,
		condition,
		handleEdit,
		deleteModel,
		putModel,
		setDataTraLoiSinhVien,
		dataTraLoiSinhVien,
		setRecord,
		record,
	} = useModel('sinhviensukien');
	const { record: recSuKien } = useModel('sukienv2');
	const { getByIdModel: getBieuMau } = useModel('tienich.bieumau');
	const [dataThongKe, setDataThongKe] = useState<SuKienV2.IDataThongKe>();
	const [visibleKhaoSat, setVisibleKhaoSat] = useState<boolean>(false);

	const handleGetDataThongKe = async () => {
		try {
			if (recSuKien?._id) {
				const res = await getThongKeSinhVien(recSuKien?._id);
				if (res) {
					setDataThongKe(res?.data?.data ?? ({} as SuKienV2.IDataThongKe));
				}
			}
		} catch (e) {
			console.log(e);
		}
	};

	const getData = () => {
		getModel({ loaiQR: type, idSuKien: recSuKien?._id });
		handleGetDataThongKe();
	};

	const handleViewKhaoSat = async (ssoId: string, loai: ELoaiKhaoSatSuKien) => {
		try {
			if (recSuKien?._id) {
				const res = await xemKhaoSat(recSuKien?._id, loai, ssoId);
				if (res) {
					setDataTraLoiSinhVien(res?.data?.data);
					if (res?.data?.data?.idKhaoSat) {
						getBieuMau(res?.data?.data?.idKhaoSat).then(() => {
							setVisibleKhaoSat(true);
						});
					} else {
						message.info('Không có biểu mẫu vui lòng kiểm tra lại.');
					}
				}
			}
		} catch (e) {
			console.log(e);
		}
	};

	const columns: IColumn<SuKienV2.IRecordSinhVienSuKien>[] = [
		{
			title: intl.formatMessage({ id: 'sukien.chitiet.danhsachdangky.column.masv' }),
			width: 90,
			dataIndex: 'maSv',
			filterType: 'string',
			align: 'center',
			render: (val: string) => val.toUpperCase(),
		},
		{
			title: intl.formatMessage({ id: 'sukien.chitiet.danhsachdangky.column.hoten' }),
			dataIndex: 'tenSv',
			width: 90,
			filterType: 'string',
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'sukien.chitiet.danhsachdangky.column.thoigiandangky' }),
			dataIndex: 'thoiGian',
			width: 120,
			hide: type !== 'Đăng ký',
			align: 'center',
			render: (val) => (val ? dayjs(val).format('HH:mm DD/MM/YYYY') : '--'),
		},
		{
			title: intl.formatMessage({ id: 'sukien.chitiet.danhsachdangky.column.thoigiancheckin' }),
			dataIndex: 'thoiGianCheckIn',
			width: 120,
			hide: type !== 'Tham gia',
			align: 'center',
			render: (val) => (val ? dayjs(val).format('HH:mm DD/MM/YYYY') : '--'),
		},
		{
			title: intl.formatMessage({ id: 'sukien.chitiet.danhsachdangky.column.thoigiancheckout' }),
			dataIndex: 'thoiGianCheckOut',
			width: 120,
			hide: type !== 'Tham gia',
			align: 'center',
			render: (val) => (val ? dayjs(val).format('HH:mm DD/MM/YYYY') : '--'),
		},
		{
			title: intl.formatMessage({ id: 'sukien.chitiet.danhsachdangky.column.khaosatdangky' }),
			dataIndex: 'isLamKhaoSatDangKy',
			width: 120,
			hide: !(type === 'Đăng ký' && recSuKien?.idKhaoSatDangKy),
			align: 'center',
			render: (val) => <Checkbox checked={val ?? false} />,
		},
		{
			title: intl.formatMessage({ id: 'sukien.chitiet.danhsachdangky.column.khaosatcheckin' }),
			dataIndex: 'isLamKhaoSatCheckIn',
			width: 120,
			hide: !(type === 'Tham gia' && recSuKien?.idKhaoSatCheckIn),
			align: 'center',
			render: (val) => <Checkbox checked={val ?? false} />,
		},
		{
			title: intl.formatMessage({ id: 'sukien.chitiet.danhsachdangky.column.khaosatcheckout' }),
			dataIndex: 'isLamKhaoSatCheckOut',
			width: 120,
			hide: !(type === 'Tham gia' && recSuKien?.idKhaoSatCheckOut),
			align: 'center',
			render: (val) => <Checkbox checked={val ?? false} />,
		},
		{
			title: intl.formatMessage({ id: 'sukien.chitiet.danhsachdangky.column.thaotac' }),
			align: 'center',
			width: 80,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<Popover
						placement='left'
						content={
							<>
								{type === 'Đăng ký' && (
									<>
										<Popconfirm
											title={intl.formatMessage({ id: 'common.confirm.approve' })}
											disabled={
												rec?.trangThaiThamGia === ETrangThaiThamGia.XAC_NHAN ||
												rec?.trangThaiThamGia === ETrangThaiThamGia.TU_CHOI
											}
											onConfirm={() => {
												putModel(rec?._id, { trangThaiThamGia: ETrangThaiThamGia.XAC_NHAN }, getData);
											}}
										>
											<Tooltip title={intl.formatMessage({ id: 'common.button.approve' })}>
												<Button type='link' icon={<CheckOutlined />} />
											</Tooltip>
										</Popconfirm>
										<Divider type={'vertical'} />
										<Popconfirm
											title={intl.formatMessage({ id: 'common.confirm.reject' })}
											onConfirm={() => {
												putModel(rec?._id, { trangThaiThamGia: ETrangThaiThamGia.TU_CHOI }, getData);
											}}
										>
											<Tooltip title={intl.formatMessage({ id: 'common.button.reject' })}>
												<Button danger type='link' icon={<CloseOutlined />} />
											</Tooltip>
										</Popconfirm>
										<Divider type={'vertical'} />
										<Popconfirm
											title={intl.formatMessage({ id: 'common.confirm.reset' })}
											onConfirm={() => {
												putModel(rec?._id, { trangThaiThamGia: ETrangThaiThamGia.CHUA_XAC_NHAN }, getData);
											}}
										>
											<Tooltip title={intl.formatMessage({ id: 'common.button.reset' })}>
												<Button danger type='link' icon={<UndoOutlined />} />
											</Tooltip>
										</Popconfirm>
										<Divider type={'vertical'} />
									</>
								)}

								<Tooltip title={intl.formatMessage({ id: 'global.button.chinhsua' })}>
									<Button onClick={() => handleEdit(rec)} type='link' icon={<EditOutlined />} />
								</Tooltip>
								<Divider type={'vertical'} />
								<Tooltip title={intl.formatMessage({ id: 'global.button.xoa' })}>
									<Popconfirm
										title={intl.formatMessage({ id: 'common.confirm.delete' })}
										onConfirm={() => {
											deleteModel(rec?._id, getData);
										}}
									>
										<Button danger type='link' icon={<DeleteOutlined />} />
									</Popconfirm>
								</Tooltip>
							</>
						}
					>
						<Button type='link' icon={<MenuOutlined />} />
					</Popover>
				</>
			),
		},
	];

	const handleExportDanhSach = async () => {
		try {
			formWaiting('Hệ thống đang xử lý');
			const res = await exportDanhSachSinhVien({ idSuKien: recSuKien?._id });
			if (res) {
				fileDownload(res?.data, getFilenameHeader(res));
			}
		} catch (e) {
			console.log(e);
		} finally {
			Modal.destroyAll();
		}
	};

	return (
		<>
			<div style={{ marginBottom: 8 }}>
				<Row gutter={[12, 12]}>
					{type === 'Đăng ký' && (
						<>
							{/* <Col span={24}>
								<Card style={{ borderRadius: 5 }} hoverable>
									<div style={{ display: 'flex', justifyContent: 'space-between' }}>
										<div>
											<Badge style={{ marginRight: 4 }} color={color?.[0]} />
											<span>
												Chưa xác nhận tham gia:
												<b style={{ marginLeft: 4 }}>{dataThongKe?.tongChuaXacNhanThamGia ?? 0}</b>
											</span>
										</div>
										<div>
											<Badge style={{ marginRight: 4 }} color={color?.[1]} />
											<span>
												Xác nhận tham gia:
												<b style={{ marginLeft: 4 }}>{dataThongKe?.tongXacNhanThamGia ?? 0}</b>
											</span>
										</div>
										<div>
											<Badge style={{ marginRight: 4 }} color={color?.[2]} />
											<span>
												Từ chối tham gia:
												<b style={{ marginLeft: 4 }}>{dataThongKe?.tongTuChoiThamGia ?? 0}</b>
											</span>
										</div>
									</div>
								</Card>
							</Col> */}
							{recSuKien?.idKhaoSatDangKy && (
								<Col span={24}>
									<Card style={{ borderRadius: 5 }} hoverable>
										<div style={{ display: 'flex', justifyContent: 'space-between' }}>
											<div>
												<Badge style={{ marginRight: 4 }} color={color?.[0]} />
												<span>
													{intl.formatMessage({ id: 'sukien.chitiet.danhsachdangky.lamks' })}:
													<b style={{ marginLeft: 4 }}>{dataThongKe?.tongLamKhaoSatDangKy ?? 0}</b>
												</span>
											</div>
											<div>
												<Badge style={{ marginRight: 4 }} color={color?.[1]} />
												<span>
													{intl.formatMessage({ id: 'sukien.chitiet.danhsachdangky.chualamks' })}:
													<b style={{ marginLeft: 4 }}>{dataThongKe?.tongChuaLamKhaoSatDangKy ?? 0}</b>
												</span>
											</div>
										</div>
									</Card>
								</Col>
							)}
						</>
					)}

					{type === 'Tham gia' && (
						<>
							<Col
								span={
									recSuKien?.idKhaoSatCheckIn && recSuKien?.idKhaoSatCheckOut
										? 8
										: recSuKien?.idKhaoSatCheckIn || recSuKien?.idKhaoSatCheckOut
											? 12
											: 24
								}
							>
								<Card style={{ borderRadius: 5 }} hoverable>
									<Badge style={{ marginRight: 4 }} color={color?.[0]} />
									<span>
										{intl.formatMessage({ id: 'sukien.chitiet.danhsachdangky.checkin' })}:
										<b style={{ marginLeft: 4 }}>{dataThongKe?.tongCheckin ?? 0}</b>
									</span>
									<br />
									<Badge style={{ marginRight: 4 }} color={color?.[1]} />
									<span>
										{intl.formatMessage({ id: 'sukien.chitiet.danhsachdangky.checkout' })}:
										<b style={{ marginLeft: 4 }}>{dataThongKe?.tongCheckOut ?? 0}</b>
									</span>
									<br />
								</Card>
							</Col>
							{recSuKien?.idKhaoSatCheckIn && (
								<Col span={recSuKien?.idKhaoSatCheckOut ? 8 : 12}>
									<Card style={{ borderRadius: 5 }} hoverable>
										<Badge style={{ marginRight: 4 }} color={color?.[0]} />
										<span>
											{intl.formatMessage({ id: 'sukien.chitiet.danhsachdangky.lamkscheckin' })}:
											<b style={{ marginLeft: 4 }}>{dataThongKe?.tongLamKhaoSatCheckIn ?? 0}</b>
										</span>
										<br />
										<Badge style={{ marginRight: 4 }} color={color?.[1]} />
										<span>
											{intl.formatMessage({ id: 'sukien.chitiet.danhsachdangky.chualamkscheckin' })}:
											<b style={{ marginLeft: 4 }}>{dataThongKe?.tongChuaLamKhaoCheckIn ?? 0}</b>
										</span>
										<br />
									</Card>
								</Col>
							)}
							{recSuKien?.idKhaoSatCheckOut && (
								<Col span={recSuKien?.idKhaoSatCheckIn ? 8 : 12}>
									<Card style={{ borderRadius: 5 }} hoverable>
										<Badge style={{ marginRight: 4 }} color={color?.[0]} />
										<span>
											{intl.formatMessage({ id: 'sukien.chitiet.danhsachdangky.lamkscheckout' })}:
											<b style={{ marginLeft: 4 }}>{dataThongKe?.tongLamKhaoSatCheckOut ?? 0}</b>
										</span>
										<br />
										<Badge style={{ marginRight: 4 }} color={color?.[1]} />
										<span>
											{intl.formatMessage({ id: 'sukien.chitiet.danhsachdangky.chualamkscheckout' })}:
											<b style={{ marginLeft: 4 }}>{dataThongKe?.tongChuaLamKhaoCheckOut ?? 0}</b>
										</span>
										<br />
									</Card>
								</Col>
							)}
						</>
					)}
				</Row>
			</div>

			<TableBase
				otherProps={{ size: 'small' }}
				hideCard
				buttons={{ create: true, import: true, export: false }}
				dependencies={[page, limit, type, condition]}
				getData={getData}
				modelName={'sinhviensukien'}
				columns={columns}
				Form={FormThemMoiSinhVien as any}
				formProps={{
					getData: getData,
					type: type,
				}}
				params={{ idSuKien: recSuKien?._id, loaiQR: type }}
				otherButtons={[
					<>
						<Button
							icon={<ExportOutlined />}
							size={'small'}
							onClick={() => {
								handleExportDanhSach();
							}}
						>
							{intl.formatMessage({ id: 'global.button.xuatdulieu' })}
						</Button>
					</>,
				]}
			/>

			<Modal
				destroyOnClose
				title={intl.formatMessage({ id: 'sukien.khaosat.title' }, { ten: record?.tenSv, ma: record?.maSv })}
				open={visibleKhaoSat}
				onCancel={() => {
					setVisibleKhaoSat(false);
				}}
				width={800}
				footer={null}
			>
				<ViewKhaoSat
					hideCard
					disabled
					onCancel={() => {
						setVisibleKhaoSat(false);
					}}
					cauTraLoi={dataTraLoiSinhVien?.danhSachTraLoi}
				/>
			</Modal>
		</>
	);
};
export default DanhSachSinhVien;
