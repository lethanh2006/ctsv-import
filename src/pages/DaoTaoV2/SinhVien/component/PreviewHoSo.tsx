import KetQuaToanKhoaSinhVien from '@/pages/DaoTaoV2/KetQuaHocTap/KetQuaToanKhoa/KetQuaToanKhoaSinhVien';
import { exportLyLich } from '@/services/DaoTaoV2/SinhVien';
import type { ETrangThaiHocSv } from '@/services/DaoTaoV2/SinhVien/constant';
import { colorTrangThaiHocSv } from '@/services/DaoTaoV2/SinhVien/constant';
import { formatPhoneNumber } from '@/utils/utils';
import { MenuOutlined, PrinterOutlined } from '@ant-design/icons';
import { Button, Card, Col, Empty, Image, Row, Spin, Tag } from 'antd';
import dayjs from 'dayjs';
import fileDownload from 'js-file-download';
import { useIntl, useModel } from 'umi';
import ChartCongNoSinhVien from '../CongNoSinhVien/ChartCongNo';

type DescriptionItem = {
	label?: string;
	content?: JSX.Element | string | number;
	md?: 6 | 8 | 12 | 16 | 18 | 24;
	children?: DescriptionItem[];
};

const PreviewHoSo = (props: any) => {
	const intl = useIntl();
	const { record, loading, handleEdit, setVisibleForm, formSubmiting, setFormSubmiting } =
		useModel('daotaov2.sinhvien.sinhvien');

	const onExport = () => {
		if (record?.ssoId) {
			if (formSubmiting) return;
			setFormSubmiting(true);

			exportLyLich(record?.ssoId)
				.then((res) =>
					fileDownload(
						res.data,
						`${intl.formatMessage({ id: 'hosonguoihoc.previewhoso.filename' }, { ten: record?.ten })}`,
					),
				)
				.finally(() => setFormSubmiting(false));
		}
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
		{ label: intl.formatMessage({ id: 'hosonguoihoc.previewhoso.label.masinhvien' }), content: record?.ma, md: 8 },
		{ label: intl.formatMessage({ id: 'hosonguoihoc.previewhoso.label.hoten' }), content: record?.ten, md: 16 },
		{ label: intl.formatMessage({ id: 'hosonguoihoc.previewhoso.label.gioitinh' }), content: record?.gioiTinh, md: 8 },
		{
			label: intl.formatMessage({ id: 'hosonguoihoc.previewhoso.label.ngaysinh' }),
			content: record?.ngaySinh ? dayjs(record.ngaySinh).format('DD/MM/YYYY') : '',
			md: 8,
		},
		{
			label: intl.formatMessage({ id: 'hosonguoihoc.previewhoso.label.cccd' }),
			content: `${record?.cccd ?? ''}, ${intl.formatMessage({ id: 'hosonguoihoc.previewhoso.label.ngaycap' })} ${
				record?.ngayCapCccd ? dayjs(record.ngayCapCccd).format('DD/MM/YYYY') : '--'
			}, ${intl.formatMessage({ id: 'hosonguoihoc.previewhoso.label.noicap' })} ${record?.noiCapCccd ?? ''}`,
			md: 24,
		},
		{
			label: intl.formatMessage({ id: 'hosonguoihoc.previewhoso.label.sodienthoai' }),
			content: !!record?.soDienThoai && formatPhoneNumber(record.soDienThoai),
			md: 8,
		},
		{ label: intl.formatMessage({ id: 'hosonguoihoc.previewhoso.label.email' }), content: record?.email, md: 16 },
		{
			label: intl.formatMessage({ id: 'hosonguoihoc.previewhoso.label.trangthaihoc' }),
			content: <Tag color={colorTrangThaiHocSv[record?.trangThaiHoc as ETrangThaiHocSv]}>{record?.trangThaiHoc}</Tag>,
			md: 8,
		},
		{
			label: intl.formatMessage({ id: 'hosonguoihoc.previewhoso.label.khoanganh' }),
			content: record?.khoaNganh?.ten ?? '',
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
	// 			{ label: 'Phường/Xã', content: record?.xaPhuongThuongTru },
	// 			{ label: 'Địa chỉ cụ thể', content: record?.soNhaTenDuongThuongTru },
	// 		],
	// 	},
	// 	{
	// 		label: 'Đoàn / Đảng',
	// 		md: 24,
	// 		children: [
	// 			{
	// 				label: 'Ngày vào Đoàn',
	// 				content: record?.ngayVaoDoan ? dayjs(record.ngayVaoDoan).format('DD/MM/YYYY') : '',
	// 				md: 8,
	// 			},
	// 			{
	// 				label: 'Ngày vào Đảng',
	// 				content: record?.ngayVaoDang ? dayjs(record.ngayVaoDang).format('DD/MM/YYYY') : '',
	// 				md: 8,
	// 			},
	// 			{
	// 				label: 'Ngày vào Đảng chính thức',
	// 				content: record?.ngayVaoDangChinhThuc ? dayjs(record.ngayVaoDangChinhThuc).format('DD/MM/YYYY') : '',
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
		<Card title={intl.formatMessage({ id: 'hosonguoihoc.previewhoso.title' })}>
			<Spin spinning={loading}>
				{record?.ssoId ? (
					<>
						{/* <h2 style={{ textAlign: 'center', marginBottom: 32 }}>SƠ YẾU LÝ LỊCH</h2> */}
						<Row gutter={[18, 18]} style={{ maxWidth: 1200, margin: 'auto' }}>
							<Col span={24}>
								<Button icon={<PrinterOutlined />} onClick={onExport} loading={formSubmiting}>
									{intl.formatMessage({ id: 'hosonguoihoc.previewhoso.button.inlylich' })}
								</Button>
							</Col>

							<Col span={24} sm={6} style={{ display: 'flex', justifyContent: 'center', padding: 12 }}>
								<div style={{ width: 140, height: 180 }}>
									<Image src={record?.anhDaiDienUrl ?? '/cong-tac-sinh-vien/metadata.png'} />
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
									title={intl.formatMessage({ id: 'hosonguoihoc.previewhoso.ketquahoctap' })}
									bordered={false}
									headStyle={{ padding: 0 }}
									styles={{ padding: '8px 0 0 0' }}
								>
									<KetQuaToanKhoaSinhVien sinhVienSsoId={record?.ssoId} hideDetail />
								</Card>
							</Col>
							<Col span={24} md={8}>
								<Card
									title={intl.formatMessage({ id: 'hosonguoihoc.previewhoso.congno' })}
									bordered={false}
									headStyle={{ padding: 0 }}
									styles={{ padding: '8px 0 0 0' }}
								>
									<ChartCongNoSinhVien />
								</Card>
							</Col>
						</Row>
					</>
				) : (
					<Empty
						description={
							<i style={{ color: '#999' }}>
								{intl.formatMessage({ id: 'hosonguoihoc.previewhoso.label.khongthaysv' })}
							</i>
						}
						style={{ marginTop: 32, marginBottom: 32 }}
					/>
				)}
			</Spin>

			<div className='form-footer' style={{ marginTop: 18 }}>
				{props.hasEdit && record?.ssoId ? (
					<Button type='primary' icon={<MenuOutlined />} onClick={() => handleEdit()}>
						{intl.formatMessage({ id: 'hosonguoihoc.previewhoso.xemchitiet' })}
					</Button>
				) : null}
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>
		</Card>
	);
};

export default PreviewHoSo;
