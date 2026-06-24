import MyDatePicker from '@/components/MyDatePicker';
import UploadFile from '@/components/Upload/UploadFile';
import SelectDanToc from '@/pages/Core/DanToc/SelectDanToc';
import SelectTinhThanhPho from '@/pages/Core/DonViHanhChinh/SelectTinh';
import SelectQuocTich from '@/pages/Core/QuocTich/SelectQuocTich';
import SelectTonGiao from '@/pages/Core/TonGiao/SelectTonGiao';
import { tenTruongVietTatTiengAnh } from '@/services/base/constant';
import {
	EGioiTinh,
	ELoaiChuyenTruong,
	ELoaiNoiSinh,
	localeGioiTinh,
	TenLoaiNoiSinh,
} from '@/services/DaoTaoV2/SinhVien/constant';
import dayjs from '@/utils/dayjs';
import { getDateFormat } from '@/utils/formatDate';
import rules from '@/utils/rules';
import { Col, Collapse, Divider, Form, type FormInstance, Input, Row, Select } from 'antd';
import { useIntl, useModel } from 'umi';
import SelectDonViHanhChinh from '../../Core/DonViHanhChinh/SelectDonViHanhChinh';
import SelectChuyenNganh from '../../DanhMucHeThong/CoSo/Nganh/ChuyenNganh/SelectChuyenNganh';
import SelectKhoaNganh from '../../NamHoc/KhoaNganh/components/Select';
import FormSucKhoe from '../HoSo/FormSucKhoe';
import FormTuyenSinh from '../HoSo/FormTuyenSinh';
import ThongTinGiaDinhFormItem from '../HoSo/GiaDinh';
import ChuyenTruongSinhVienCollapse from './ChuyenTruong';
import ThongTinVisaFormItem from './ThongTinVisa';

const FormContentSinhVien = (props: { form: FormInstance; editForm?: boolean }) => {
	const intl = useIntl();
	const { form } = props;
	const { edit, record } = useModel('sinhvien.sinhvien');
	const loaiNoiSinh = Form.useWatch('loaiNoiSinh', form) ?? ELoaiNoiSinh.TRONG_NUOC;
	const editForm = props.editForm !== undefined ? props.editForm : edit;

	return (
		<>
			<Divider orientation='center'>{intl.formatMessage({ id: 'sinhvien.thongtinchung' })}</Divider>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<Col span={24} md={6}>
					<Form.Item name='anhDaiDienUrl' label=' '>
						<UploadFile isAvatar />
					</Form.Item>
				</Col>

				<Col span={24} md={18}>
					<Row gutter={[12, 0]}>
						<Col span={24} md={8}>
							<Form.Item
								name='ma'
								label={intl.formatMessage({ id: 'sinhvien.form.masinhvien' })}
								rules={[...rules.required, ...rules.text, ...rules.length(20)]}
							>
								<Input placeholder={intl.formatMessage({ id: 'sinhvien.form.masinhvien.place' })} disabled={editForm} />
							</Form.Item>
						</Col>
						<Col span={24} md={16}>
							<Form.Item
								name='maKhoaNganh'
								label={intl.formatMessage({ id: 'sinhvien.form.khoanganh' })}
								rules={[...rules.required]}
							>
								<SelectKhoaNganh disabled={editForm} />
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={[12, 0]}>
						{tenTruongVietTatTiengAnh === 'VINUNI' ? (
							<>
								<Col span={24} md={8}>
									<Form.Item
										name='firstName'
										label={intl.formatMessage({ id: 'sinhvien.form.firstname' })}
										rules={[...rules.required, ...rules.text, ...rules.length(250)]}
									>
										<Input placeholder={intl.formatMessage({ id: 'sinhvien.form.firstname.place' })} />
									</Form.Item>
								</Col>
								<Col span={24} md={8}>
									<Form.Item name='middleName' label={intl.formatMessage({ id: 'sinhvien.form.middlename' })}>
										<Input placeholder={intl.formatMessage({ id: 'sinhvien.form.middlename.place' })} />
									</Form.Item>
								</Col>
								<Col span={24} md={8}>
									<Form.Item
										name='lastName'
										label={intl.formatMessage({ id: 'sinhvien.form.lastname' })}
										rules={[...rules.required, ...rules.text, ...rules.length(250)]}
									>
										<Input placeholder={intl.formatMessage({ id: 'sinhvien.form.lastname.place' })} />
									</Form.Item>
								</Col>
							</>
						) : (
							<Col span={24} md={8}>
								<Form.Item
									name='ten'
									label={intl.formatMessage({ id: 'sinhvien.form.hovaten' })}
									rules={[...rules.required, ...rules.text, ...rules.length(250)]}
								>
									<Input placeholder={intl.formatMessage({ id: 'sinhvien.form.hovaten.place' })} />
								</Form.Item>
							</Col>
						)}
						<Col span={12} md={8}>
							<Form.Item
								name='ngaySinh'
								label={intl.formatMessage({ id: 'sinhvien.form.ngaysinh' })}
								rules={[...rules.required, ...rules.ngaySinh]}
							>
								<MyDatePicker
									style={{ width: '100%' }}
									disabledDate={(cur) => dayjs(cur).isAfter(dayjs())}
									placeholder={intl.formatMessage({ id: 'sinhvien.form.ngaysinh.place' })}
									format={getDateFormat()}
								/>
							</Form.Item>
						</Col>
						<Col span={12} md={8}>
							<Form.Item
								name='gioiTinh'
								label={intl.formatMessage({ id: 'sinhvien.form.gioitinh' })}
								rules={[...rules.required, ...rules.text]}
							>
								<Select
									placeholder={intl.formatMessage({ id: 'sinhvien.form.gioitinh.place' })}
									options={Object.values(EGioiTinh).map((item) => ({
										key: item,
										value: item,
										label: intl.formatMessage({ id: localeGioiTinh[item] }),
									}))}
								/>
							</Form.Item>
						</Col>

						<Col span={12} md={8}>
							<Form.Item name='cccd' label={intl.formatMessage({ id: 'sinhvien.form.cccd' })} rules={[...rules.CMND]}>
								<Input placeholder={intl.formatMessage({ id: 'sinhvien.form.cccd.place' })} />
							</Form.Item>
						</Col>
						<Col span={12} md={8}>
							<Form.Item
								name='ngayCapCccd'
								label={intl.formatMessage({ id: 'sinhvien.form.ngaycap' })}
								rules={[...rules.truocHomNay]}
							>
								<MyDatePicker
									placeholder={intl.formatMessage({ id: 'sinhvien.form.ngaycap.place' })}
									allowClear
									format={getDateFormat()}
								/>
							</Form.Item>
						</Col>
						<Col span={12} md={8}>
							<Form.Item
								name='noiCapCccd'
								label={intl.formatMessage({ id: 'sinhvien.form.noicap' })}
								rules={[...rules.text, ...rules.length(250)]}
							>
								<Input placeholder={intl.formatMessage({ id: 'sinhvien.form.noicap.place' })} />
							</Form.Item>
						</Col>

						<Col span={12} md={8}>
							<Form.Item
								name='email'
								label={intl.formatMessage({ id: 'sinhvien.form.email' })}
								rules={[...rules.required, ...rules.email]}
							>
								<Input placeholder={intl.formatMessage({ id: 'sinhvien.form.email.place' })} />
							</Form.Item>
						</Col>
						<Col span={12} md={16}>
							<Form.Item name='maChuyenNganh' label={intl.formatMessage({ id: 'sinhvien.form.chuyennganh' })}>
								<SelectChuyenNganh maNganh={record?.khoaNganh?.maNganh ?? record?.maNganh} allowClear selectMa />
							</Form.Item>
						</Col>
						{/* // TODO: Xóa => Chuyển thành tính chất chương trình */}
						{/* <Col span={12} md={8}>
							<Form.Item name='doiTuong' label='Đối tượng' rules={[...rules.required]}>
								<Select
									placeholder='Chọn đối tượng'
									options={Object.values(EDoiTuongLopHanhChinh).map((item) => ({
										value: item,
										key: item,
										label: doiTuongLopHanhChinh[item],
									}))}
								/>
							</Form.Item>
						</Col> */}
					</Row>
				</Col>
			</Row>

			<Collapse>
				<Collapse.Panel forceRender header={intl.formatMessage({ id: 'sinhvien.thongtinchung.chitiet' })} key={'1'}>
					<Row gutter={[12, 0]}>
						<Col span={12} md={8}>
							<Form.Item name='quocTich' label={intl.formatMessage({ id: 'sinhvien.form.quoctich' })}>
								<SelectQuocTich allowClear />
							</Form.Item>
						</Col>
						<Col span={12} md={8}>
							<Form.Item name='danToc' label={intl.formatMessage({ id: 'sinhvien.form.dantoc' })}>
								<SelectDanToc allowClear />
							</Form.Item>
						</Col>
						<Col span={12} md={8}>
							<Form.Item name='tonGiao' label={intl.formatMessage({ id: 'sinhvien.form.tongiao' })}>
								<SelectTonGiao allowClear />
							</Form.Item>
						</Col>
					</Row>

					<Divider orientation='center'>{intl.formatMessage({ id: 'sinhvien.form.divider.noisinh' })}</Divider>
					<Row gutter={[12, 0]}>
						<Col span={12} md={12}>
							<Form.Item name='loaiNoiSinh' label={intl.formatMessage({ id: 'sinhvien.form.loainoisinh' })}>
								<Select
									placeholder={intl.formatMessage({ id: 'sinhvien.form.loainoisinh.place' })}
									allowClear
									options={Object.values(ELoaiNoiSinh).map((item) => ({
										key: item,
										value: item,
										label: intl.formatMessage({ id: TenLoaiNoiSinh[item] }),
									}))}
								/>
							</Form.Item>
						</Col>
						<Col span={12} md={12}>
							{loaiNoiSinh === ELoaiNoiSinh.TRONG_NUOC ? (
								<Form.Item name='tinhTpNoiSinh' label={intl.formatMessage({ id: 'sinhvien.form.tinhtpnoisinh' })}>
									<SelectTinhThanhPho allowClear />
								</Form.Item>
							) : (
								<Form.Item name='quocGiaNoiSinh' label={intl.formatMessage({ id: 'sinhvien.form.quocgianoisinh' })}>
									<Input placeholder={intl.formatMessage({ id: 'sinhvien.form.quocgianoisinh.place' })} />
								</Form.Item>
							)}
						</Col>
					</Row>
					{/* <Row gutter={[12, 0]}>
						<SelectDonViHanhChinh form={form} suffix='NoiSinh' />
					</Row> */}

					<Divider orientation='center'>{intl.formatMessage({ id: 'sinhvien.form.divider.quequan' })}</Divider>
					<Row gutter={[12, 0]}>
						<SelectDonViHanhChinh form={form} suffix='QueQuan' />
					</Row>

					<Divider orientation='center'>{intl.formatMessage({ id: 'sinhvien.form.divider.thuongtru' })}</Divider>
					<Row gutter={[12, 0]}>
						<SelectDonViHanhChinh form={form} suffix='ThuongTru' hasSoNha />
					</Row>

					<Divider orientation='center'>{intl.formatMessage({ id: 'sinhvien.form.divider.lienlac' })}</Divider>
					<Row gutter={[12, 0]}>
						<Col span={12}>
							<Form.Item
								name='soDienThoai'
								label={intl.formatMessage({ id: 'sinhvien.form.sodienthoai' })}
								rules={[...rules.soDienThoai]}
							>
								<Input placeholder={intl.formatMessage({ id: 'sinhvien.form.sodienthoai.place' })} />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name='email2'
								label={intl.formatMessage({ id: 'sinhvien.form.email2' })}
								rules={[...rules.email]}
							>
								<Input placeholder={intl.formatMessage({ id: 'sinhvien.form.email2.place' })} />
							</Form.Item>
						</Col>
						{/* <Col span={24} md={6}>
							<Form.Item name='soDienThoai2' label='Số điện thoại 2' rules={[...rules.soDienThoai]}>
								<Input placeholder='Nhập số điện thoại 2' />
							</Form.Item>
						</Col>
						<Col span={24} md={6}>
							<Form.Item name='email2' label='Email 2' rules={[...rules.email]}>
								<Input placeholder='Nhập email 2' />
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item name='nguoiLienLac' label='Người liên lạc' rules={[...rules.text, ...rules.length(250)]}>
								<Input placeholder='Nhập họ tên người liên lạc' />
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item name='soDienThoaiNguoiLienLac' label='SĐT' rules={[...rules.soDienThoai]}>
								<Input placeholder='Nhập số điện thoại người liên lạc' />
							</Form.Item>
						</Col> */}
					</Row>

					<Divider orientation='center'>{intl.formatMessage({ id: 'sinhvien.form.divider.nganhang' })}</Divider>
					<Row gutter={[12, 0]}>
						<Col span={24} md={8}>
							<Form.Item
								name='soTaiKhoanNganHang'
								label={intl.formatMessage({ id: 'sinhvien.form.sotaikhoan' })}
								rules={[...rules.sotaikhoan]}
							>
								<Input placeholder={intl.formatMessage({ id: 'sinhvien.form.sotaikhoan.place' })} />
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item
								name='tenNganHang'
								label={intl.formatMessage({ id: 'sinhvien.form.tennganhang' })}
								rules={[...rules.text, ...rules.length(250)]}
							>
								<Input placeholder={intl.formatMessage({ id: 'sinhvien.form.tennganhang.place' })} />
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item
								name='chiNhanhNganHang'
								label={intl.formatMessage({ id: 'sinhvien.form.chinhanhnganhang' })}
								rules={[...rules.text, ...rules.length(250)]}
							>
								<Input placeholder={intl.formatMessage({ id: 'sinhvien.form.chinhanhnganhang.place' })} />
							</Form.Item>
						</Col>
					</Row>
				</Collapse.Panel>

				<Collapse.Panel forceRender header={intl.formatMessage({ id: 'sinhvien.thongtinchung.giadinh' })} key={'4'}>
					<Row gutter={[12, 0]}>
						<Col span={24}>
							<Form.Item name='thanhVienGiaDinh' label=''>
								<ThongTinGiaDinhFormItem />
							</Form.Item>
						</Col>
					</Row>
				</Collapse.Panel>

				<Collapse.Panel forceRender header={intl.formatMessage({ id: 'thongtincanhan.form.thongtinvisa' })} key='5'>
					<Row gutter={[12, 0]}>
						<Col span={24}>
							<Form.Item name='visaList' label=''>
								<ThongTinVisaFormItem />
							</Form.Item>
						</Col>
					</Row>
				</Collapse.Panel>

				<Collapse.Panel forceRender header={intl.formatMessage({ id: 'sinhvien.thongtinchung.doan' })} key={'2'}>
					{/* <Divider orientation='center'>Thông tin Đoàn</Divider> */}
					<Row gutter={[12, 0]}>
						{/* <Col span={24} md={12}>
							<Form.Item name='laDoanVien' label=' ' valuePropName='checked'>
								<Checkbox>Là đoàn viên</Checkbox>
							</Form.Item>
						</Col> */}
						<Col span={12} md={8}>
							<Form.Item
								name='ngayVaoDoan'
								label={intl.formatMessage({ id: 'sinhvien.form.ngayvaodoan' })}
								rules={[...rules.truocHomNay]}
							>
								<MyDatePicker allowClear style={{ width: '100%' }} format={getDateFormat()} />
							</Form.Item>
						</Col>
						<Col span={12} md={8}>
							<Form.Item
								name='ngayVaoDang'
								label={intl.formatMessage({ id: 'sinhvien.form.ngayvaodang' })}
								rules={[...rules.truocHomNay]}
							>
								<MyDatePicker allowClear style={{ width: '100%' }} format={getDateFormat()} />
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item
								name='ngayVaoDangChinhThuc'
								label={intl.formatMessage({ id: 'sinhvien.form.ngayvaodangchinhthuc' })}
								rules={[...rules.truocHomNay]}
							>
								<MyDatePicker allowClear style={{ width: '100%' }} format={getDateFormat()} />
							</Form.Item>
						</Col>
					</Row>

					{/* <Divider orientation='center'>Thông tin Đảng</Divider> */}
					{/* <Row gutter={[12, 0]}> */}
					{/* <Col span={24} md={12}>
							<Form.Item name='daHocLopCamTinhDang' label='' valuePropName='checked'>
								<Checkbox>Đã học lớp cảm tình Đảng</Checkbox>
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item name='laDangVien' label='' valuePropName='checked'>
								<Checkbox>Là Đảng viên</Checkbox>
							</Form.Item>
						</Col> */}

					{/* </Row> */}
				</Collapse.Panel>

				<Collapse.Panel forceRender header={intl.formatMessage({ id: 'sinhvien.thongtinchung.suckhoe' })} key={'3'}>
					<FormSucKhoe />
				</Collapse.Panel>

				<Collapse.Panel header={intl.formatMessage({ id: 'sinhvien.thongtinchung.tuyensinhdauvao' })} key={'ts'}>
					<FormTuyenSinh form={form} />
				</Collapse.Panel>

				{!!record?._id ? (
					<Collapse.Panel header={intl.formatMessage({ id: 'sinhvien.thongtinchung.chuyentruongden' })} key={'ctd'}>
						<ChuyenTruongSinhVienCollapse loaiChuyen={ELoaiChuyenTruong.CHUYEN_DEN} />
					</Collapse.Panel>
				) : null}
			</Collapse>
		</>
	);
};

export default FormContentSinhVien;
