import { exportLyLich, exportTheSinhVien } from '@/services/DaoTaoV2/SinhVien';
import { colorTrangThaiHocSv, localeTrangThaiHocSv, type ETrangThaiHocSv } from '@/services/DaoTaoV2/SinhVien/constant';
import { formatDate } from '@/utils/formatDate';
import { formatPhoneNumber } from '@/utils/utils';
import { ContactsOutlined, DownOutlined, IdcardOutlined, MenuOutlined, PrinterOutlined } from '@ant-design/icons';
import { Button, Card, Col, Dropdown, Empty, Image, Menu, Row, Spin, Tag } from 'antd';
import fileDownload from 'js-file-download';
import React from 'react';
import { useAccess, useIntl, useModel } from 'umi';
import TabTongQuanKqhtToanKhoa from '../../KetQuaHocTap/KetQuaToanKhoa/components/TabTongQuan';
import SelectSongNganh from '../../NamHoc/KhoaNganh/components/SelectSongNganh';
import ChartCongNoSinhVien from '../CongNoSinhVien/ChartCongNo';
import './style.less';

type DescriptionItem = {
	label?: string;
	content?: React.JSX.Element | string | number;
	md?: 6 | 8 | 12 | 16 | 18 | 24;
	children?: DescriptionItem[];
};

const PreviewHoSo = (props: { hasEdit?: boolean; hasHocBa?: boolean; [key: string]: any }) => {
	const intl = useIntl();
	const {
		record,
		loading,
		handleEdit,
		setVisibleForm,
		formSubmiting,
		setFormSubmiting,
		khoaNganhSelected,
		setKhoaNganhSelected,
		setVisibleHocBa,
	} = useModel('daotaov2.sinhvien.sinhvien');
	const { minorAccessFilter } = useAccess();

	const onExport = () => {
		if (record?.ssoId) {
			if (formSubmiting) return;
			setFormSubmiting(true);

			exportLyLich(record?.ssoId)
				.then((res) =>
					fileDownload(
						res.data,
						`${intl.formatMessage({ id: 'sinhvien.preview.hoso.filename' }, { ten: record.ten })}.pdf`,
					),
				)
				.finally(() => setFormSubmiting(false));
		}
	};

	const onExportThe = () => {
		if (!record?.ssoId) return;
		exportTheSinhVien({ listSsoIds: [record.ssoId] })
			.then((res) => fileDownload(res.data, `Thẻ sinh viên - ${record.ten}.pdf`))
			.catch((er) => console.log(er));
	};

	const renderDescription = (data: DescriptionItem) => (
		<Col key={data.label} span={24} md={data.md ?? 6}>
			{data.label ? (
				<>
					<span className='fw500'>{data.label}: </span>{' '}
				</>
			) : null}
			{data.children ? (
				<Row gutter={[8, 8]} style={{ marginLeft: 18 }}>
					{data.children.map((item) => renderDescription(item))}
				</Row>
			) : (
				data.content
			)}
		</Col>
	);

	const dataChung: DescriptionItem[] = [
		{ label: intl.formatMessage({ id: 'sinhvien.column.masv' }), content: record?.ma, md: 8 },
		{
			label: intl.formatMessage({ id: 'sinhvien.column.hoten' }),
			content: minorAccessFilter?.()
				? (record?.ten ?? [record?.lastName, record?.firstName].filter(Boolean).join(' '))
				: record?.ten,
			md: 16,
		},
		{ label: intl.formatMessage({ id: 'sinhvien.form.gioitinh' }), content: record?.gioiTinh, md: 8 },
		{
			label: intl.formatMessage({ id: 'sinhvien.form.ngaysinh' }),
			content: record?.ngaySinh ? formatDate(record?.ngaySinh) : '',
			md: 8,
		},
		{
			label: intl.formatMessage({ id: 'sinhvien.column.cccd' }),
			content: `${record?.cccd ?? '--'}, ${intl.formatMessage({ id: 'sinhvien.preview.cccd.ngaycap' })}: ${
				record?.ngayCapCccd ? formatDate(record?.ngayCapCccd) : ''
			}, ${intl.formatMessage({ id: 'sinhvien.preview.cccd.noicap' })}: ${record?.noiCapCccd ?? '--'}`,
			md: 24,
		},
		{
			label: intl.formatMessage({ id: 'sinhvien.column.sdt' }),
			content: !!record?.soDienThoai && formatPhoneNumber(record.soDienThoai),
			md: 8,
		},
		{ label: intl.formatMessage({ id: 'sinhvien.column.email' }), content: record?.email, md: 16 },
		{
			label: intl.formatMessage({ id: 'sinhvien.column.trangthaihoc' }),
			content: (() => {
				const trangThaiHoc = record?.trangThaiHoc as ETrangThaiHocSv | undefined;
				const localeId = trangThaiHoc ? localeTrangThaiHocSv[trangThaiHoc] : undefined;
				if (!localeId) return record?.trangThaiHoc ?? '';

				return (
					<Tag color={colorTrangThaiHocSv[trangThaiHoc as ETrangThaiHocSv]}>{intl.formatMessage({ id: localeId })}</Tag>
				);
			})(),
			md: 8,
		},
		{
			label: intl.formatMessage({ id: 'sinhvien.column.khoanganh' }),
			content: [record?.khoaNganh?.ten, record?.khoaNganh2?.ten].filter(Boolean).join(', '),
			md: 16,
		},
	];

	// const dataThem: DescriptionItem[] = [
	// 	{ label: 'Quốc tịch', content: record?.quocTich },
	// 	{ label: 'Dân tộc', content: record?.danToc },
	// 	{ label: 'Tôn giáo', content: record?.tonGiao },
	// 	{
	// 		label: 'Thông tin của cha',
	// 		md: 24,
	// 		children: [
	// 			{ label: 'Họ tên', content: record?.tenCha },
	// 			{ label: 'Năm sinh', content: record?.namSinhCha },
	// 			{ label: 'Nghề nghiệp', content: record?.ngheNghiepCha },
	// 			{ label: 'SĐT', content: record?.soDienThoaiCha },
	// 		],
	// 	},
	// 	{
	// 		label: 'Thông tin của mẹ',
	// 		md: 24,
	// 		children: [
	// 			{ label: 'Họ tên', content: record?.tenMe },
	// 			{ label: 'Năm sinh', content: record?.namSinhMe },
	// 			{ label: 'Nghề nghiệp', content: record?.ngheNghiepMe },
	// 			{ label: 'SĐT', content: record?.soDienThoaiMe },
	// 		],
	// 	},
	// 	{
	// 		label: 'Địa chỉ thường trú',
	// 		md: 24,
	// 		children: [
	// 			{ label: 'Tỉnh/Thành phố', content: record?.tinhTpThuongTru },
	// 			{ label: 'Quận/Huyện', content: record?.quanHuyenThuongTru },
	// 			{ label: 'Xã/Phường/Đặc khu', content: record?.xaPhuongThuongTru },
	// 			{ label: 'Địa chỉ cụ thể', content: record?.soNhaTenDuongThuongTru },
	// 		],
	// 	},
	// 	{
	// 		label: 'Đoàn / Đảng',
	// 		md: 24,
	// 		children: [
	// 			{
	// 				label: 'Ngày vào Đoàn',
	// 				content: record?.ngayVaoDoan ? formatDate(record?.ngayVaoDoan) : '',
	// 				md: 8,
	// 			},
	// 			{
	// 				label: 'Ngày vào Đảng',
	// 				content: record?.ngayVaoDang ? formatDate(record?.ngayVaoDang) : '',
	// 				md: 8,
	// 			},
	// 			{
	// 				label: 'Ngày vào Đảng chính thức',
	// 				content: record?.ngayVaoDangChinhThuc ? formatDate(record?.ngayVaoDangChinhThuc) : '',
	// 				md: 8,
	// 			},
	// 		],
	// 	},
	// 	{ label: 'Số thẻ BHYT', content: record?.soBaoHiemSinhVien, md: 12 },
	// 	{ label: 'Mã bệnh viện khám chữa bệnh', content: record?.maBenhVienKhamChuaBenh, md: 12 },
	// 	{
	// 		label: 'Tài khoản ngân hàng',
	// 		children: [
	// 			{ label: 'Tên ngân hàng', content: record?.tenNganHang, md: 12 },
	// 			{ label: 'Số tài khoản', content: record?.soTaiKhoanNganHang, md: 12 },
	// 		],
	// 		md: 24,
	// 	},
	// ];

	return (
		<Card title={intl.formatMessage({ id: 'sinhvien.thongtinchung.hososinhvien' })}>
			<Spin spinning={loading}>
				{record?.ssoId ? (
					<>
						{/* <h2 style={{ textAlign: 'center', marginBottom: 32 }}>SƠ YẾU LÝ LỊCH</h2> */}
						<Row gutter={[18, 18]} style={{ maxWidth: 1200, margin: 'auto' }}>
							<Col span={24} sm={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
								<div className='avatar-container'>
									<Image src={record?.anhDaiDienUrl ?? '/metadata.png'} />
								</div>
							</Col>
							<Col span={24} sm={18}>
								<Row gutter={[18, 18]}>
									{dataChung.map((item, index) => renderDescription({ ...item, label: `${index + 1}. ${item.label}` }))}
								</Row>
							</Col>

							{/* <Col span={24}>
								<Row gutter={[18, 18]}>
									{dataThem.map((item, index) =>
										renderDescription({
											...item,
											label: `${index + dataChung.length + 1}. ${item.label}`,
										}),
									)}
								</Row>
							</Col> */}
						</Row>

						<Row gutter={[12, 12]} style={{ marginTop: 24 }}>
							<Col span={24} md={16}>
								<Card
									title={intl.formatMessage({ id: 'sinhvien.lichsucanhbao.ketqua' })}
									extra={
										<SelectSongNganh
											size='small'
											ssoId={record.ssoId}
											style={{ width: 200 }}
											value={khoaNganhSelected}
											onChange={(val) => setKhoaNganhSelected(val)}
										/>
									}
									// variant='borderless'
									// className='card-borderless'
									// styles={{ body: { padding: '8px 0 0' }, header: { padding: 0 } }}
								>
									<TabTongQuanKqhtToanKhoa
										sinhVienSsoId={record?.ssoId}
										hideDetail
										maKhoaNganh={khoaNganhSelected}
										fixedSize
									/>
								</Card>
							</Col>
							<Col span={24} md={8}>
								<Card title={intl.formatMessage({ id: 'sinhvien.tab6' })}>
									<ChartCongNoSinhVien />
								</Card>
							</Col>
						</Row>
					</>
				) : (
					<Empty
						description={<i style={{ color: '#999' }}>{intl.formatMessage({ id: 'sinhvien.preview.khongtimthay' })}</i>}
						style={{ marginTop: 32, marginBottom: 32 }}
					/>
				)}
			</Spin>

			<div className='form-footer' style={{ marginTop: 18 }}>
				{props.hasEdit && record?.ssoId ? (
					<Button type='primary' icon={<MenuOutlined />} onClick={() => handleEdit()}>
						{intl.formatMessage({ id: 'sinhvien.preview.xemchitiet' })}
					</Button>
				) : null}
				<Dropdown
					overlay={
						<Menu>
							<Menu.Item key='hoso' icon={<PrinterOutlined />} onClick={onExport}>
								{intl.formatMessage({ id: 'sinhvien.button.inhoso' })}
							</Menu.Item>
							<Menu.Item key='the' icon={<IdcardOutlined />} onClick={onExportThe}>
								{intl.formatMessage({ id: 'sinhvien.button.inthe' })}
							</Menu.Item>
						</Menu>
					}
				>
					<Button icon={<PrinterOutlined />} loading={formSubmiting}>
						{intl.formatMessage({ id: 'sinhvien.button.inhoso' })} <DownOutlined />
					</Button>
				</Dropdown>
				{props.hasHocBa ? (
					<Button
						icon={<ContactsOutlined />}
						onClick={() => {
							setVisibleForm(false);
							setVisibleHocBa(true);
						}}
					>
						{intl.formatMessage({ id: 'sinhvien.hocba.title' })}
					</Button>
				) : null}
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'sinhvien.button.dong' })}</Button>
			</div>
		</Card>
	);
};

export default PreviewHoSo;
