import MyDatePicker from '@/components/MyDatePicker';
import UploadFile from '@/components/Upload/UploadFile';
import SelectDanToc from '@/pages/DaoTaoV2/Core/DanToc/SelectDanToc';
import SelectQuocTich from '@/pages/DaoTaoV2/Core/QuocTich/SelectQuocTich';
import SelectTonGiao from '@/pages/DaoTaoV2/Core/TonGiao/SelectTonGiao';
import SelectKhoaNganh from '@/pages/DaoTaoV2/NamHoc/KhoaNganh/components/Select';
import { getTinhThanhPho } from '@/services/Core/DonViHanhChinh';
import { type DonViHanhChinh } from '@/services/Core/DonViHanhChinh/typing';
import { exportLyLich } from '@/services/DaoTaoV2/SinhVien';
import { EGioiTinh, ELoaiNoiSinh, TenLoaiNoiSinh } from '@/services/DaoTaoV2/SinhVien/constant';
import { type SinhVien } from '@/services/DaoTaoV2/SinhVien/typings';
import { buildUpLoadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { PlusOutlined, PrinterOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Col, Collapse, Divider, Form, Input, Row, Select } from 'antd';
import dayjs from 'dayjs';
import fileDownload from 'js-file-download';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import SelectDonViHanhChinh from '../../Core/DonViHanhChinh/SelectDonViHanhChinh';
import FormSucKhoe from '../HoSo/FormSucKhoe';
import FormTuyenSinh from '../HoSo/FormTuyenSinh';
import ThongTinGiaDinhFormItem from '../HoSo/GiaDinh';

const FormSinhVien = (props: { afterAddNew: (rec: SinhVien.IRecord) => void; disabledForm?: boolean }) => {
	const intl = useIntl();
	const { record, edit, postModel, putModel, formSubmiting, setRecord, setEdit, setFormSubmiting, visibleForm } =
		useModel('daotaov2.sinhvien.sinhvien');
	const [listTinh, setListTinh] = useState<DonViHanhChinh.IRecord[]>();
	const { afterAddNew, disabledForm } = props;
	const [form] = Form.useForm();
	const loaiNoiSinh = Form.useWatch('loaiNoiSinh', form) ?? ELoaiNoiSinh.TRONG_NUOC;

	useEffect(() => {
		getTinhThanhPho().then((data) => {
			setListTinh(data.data.data);
		});
	}, []);

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: SinhVien.IRecord) => {
		setFormSubmiting(true);
		const url = await buildUpLoadFile(values, 'anhDaiDienUrl');
		values.anhDaiDienUrl = url;
		setFormSubmiting(false);

		if (edit) {
			putModel(record?._id ?? '', values, undefined, undefined, false)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(values, undefined, false)
				.then((rec) => {
					setRecord(rec);
					setEdit(true);
					if (afterAddNew) afterAddNew(rec);
				})
				.catch((er) => console.log(er));
	};

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

	return (
		<Form onFinish={onFinish} form={form} layout='vertical' disabled={disabledForm}>
			{!disabledForm ? (
				<div className='button-section'>
					<Button
						loading={formSubmiting}
						htmlType='submit'
						type='primary'
						icon={edit ? <SaveOutlined /> : <PlusOutlined />}
					>
						{intl.formatMessage({ id: !edit ? 'sinhvien.themhoso' : 'sinhvien.capnhathoso' })}
					</Button>

					{edit ? (
						<Button icon={<PrinterOutlined />} onClick={onExport} loading={formSubmiting}>
							{intl.formatMessage({ id: 'hosonguoihoc.previewhoso.button.inlylich' })}
						</Button>
					) : null}
				</div>
			) : null}

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
								label={intl.formatMessage({ id: 'sinhvien.id.masinhvien' })}
								rules={[...rules.required, ...rules.text, ...rules.length(20)]}
							>
								<Input placeholder={intl.formatMessage({ id: 'sinhvien.id.masinhvien' })} disabled={edit} />
							</Form.Item>
						</Col>
						<Col span={24} md={16}>
							<Form.Item
								name='maKhoaNganh'
								label={intl.formatMessage({ id: 'sinhvien.id.khoanganh' })}
								rules={[...rules.required]}
							>
								<SelectKhoaNganh disabled={edit} />
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={[12, 0]}>
						<Col span={24} md={8}>
							<Form.Item
								name='ten'
								label={intl.formatMessage({ id: 'sinhvien.id.hoten' })}
								rules={[...rules.required, ...rules.text, ...rules.length(250)]}
							>
								<Input placeholder={intl.formatMessage({ id: 'sinhvien.id.nhaphoten' })} />
							</Form.Item>
						</Col>
						<Col span={12} md={8}>
							<Form.Item
								name='ngaySinh'
								label={intl.formatMessage({ id: 'sinhvien.id.ngaysinh' })}
								rules={[...rules.required, ...rules.ngaySinh]}
							>
								<MyDatePicker style={{ width: '100%' }} disabledDate={(cur) => dayjs(cur).isAfter(dayjs())} />
							</Form.Item>
						</Col>
						<Col span={12} md={8}>
							<Form.Item
								name='gioiTinh'
								label={intl.formatMessage({ id: 'sinhvien.id.gioitinh' })}
								rules={[...rules.required, ...rules.text]}
							>
								<Select
									placeholder={intl.formatMessage({ id: 'sinhvien.id.chongioitinh' })}
									options={Object.values(EGioiTinh).map((item) => ({
										key: item,
										value: item,
										label: item,
									}))}
								/>
							</Form.Item>
						</Col>

						<Col span={12} md={8}>
							<Form.Item name='cccd' label={intl.formatMessage({ id: 'sinhvien.id.cccd' })} rules={[...rules.CMND]}>
								<Input placeholder={intl.formatMessage({ id: 'sinhvien.id.nhapcccd' })} />
							</Form.Item>
						</Col>
						<Col span={12} md={8}>
							<Form.Item
								name='ngayCapCccd'
								label={intl.formatMessage({ id: 'sinhvien.id.ngaycap' })}
								rules={[...rules.truocHomNay]}
							>
								<MyDatePicker placeholder={intl.formatMessage({ id: 'sinhvien.id.chonngaycap' })} allowClear />
							</Form.Item>
						</Col>
						<Col span={12} md={8}>
							<Form.Item
								name='noiCapCccd'
								label={intl.formatMessage({ id: 'sinhvien.id.noicap' })}
								rules={[...rules.text, ...rules.length(250)]}
							>
								<Input placeholder={intl.formatMessage({ id: 'sinhvien.id.nhapnoicap' })} />
							</Form.Item>
						</Col>

						<Col span={12} md={8}>
							<Form.Item
								name='email'
								label={intl.formatMessage({ id: 'sinhvien.id.email' })}
								rules={[...rules.required, ...rules.email]}
							>
								<Input placeholder={intl.formatMessage({ id: 'sinhvien.id.nhapemail' })} />
							</Form.Item>
						</Col>
						<Col span={12} md={16}>
							<Form.Item name='maKhoaNganh2' label={intl.formatMessage({ id: 'sinhvien.id.khoanganh2' })}>
								<SelectKhoaNganh disabled />
							</Form.Item>
						</Col>
					</Row>
				</Col>
			</Row>

			<Collapse>
				<Collapse.Panel forceRender header={intl.formatMessage({ id: 'sinhvien.thongtinchung.chitiet' })} key={'1'}>
					<Row gutter={[12, 0]}>
						<Col span={12} md={8}>
							<Form.Item name='quocTich' label={intl.formatMessage({ id: 'sinhvien.id.quoctich' })}>
								<SelectQuocTich allowClear />
							</Form.Item>
						</Col>
						<Col span={12} md={8}>
							<Form.Item name='danToc' label={intl.formatMessage({ id: 'sinhvien.id.dantoc' })}>
								<SelectDanToc allowClear />
							</Form.Item>
						</Col>
						<Col span={12} md={8}>
							<Form.Item name='tonGiao' label={intl.formatMessage({ id: 'sinhvien.id.tongiao' })}>
								<SelectTonGiao allowClear />
							</Form.Item>
						</Col>
					</Row>

					<Divider orientation='center'>{intl.formatMessage({ id: 'sinhvien.noisinh.title' })}</Divider>
					<Row gutter={[12, 0]}>
						<Col span={12} md={12}>
							<Form.Item name='loaiNoiSinh' label={intl.formatMessage({ id: 'sinhvien.id.loainoisinh' })}>
								<Select
									placeholder={intl.formatMessage({ id: 'sinhvien.id.chonloainoisinh' })}
									allowClear
									options={Object.values(ELoaiNoiSinh).map((item) => ({
										key: item,
										value: item,
										label: TenLoaiNoiSinh[item],
									}))}
								/>
							</Form.Item>
						</Col>
						<Col span={12} md={12}>
							{loaiNoiSinh === ELoaiNoiSinh.TRONG_NUOC ? (
								<Form.Item name='tinhTpNoiSinh' label={intl.formatMessage({ id: 'sinhvien.id.tinhtp' })}>
									<Select
										placeholder={intl.formatMessage({ id: 'sinhvien.id.chontinhtp' })}
										options={listTinh?.map((item) => ({
											key: item.ma,
											value: item.tenDonVi,
											label: item.tenDonVi,
										}))}
										allowClear
										showSearch
										optionFilterProp='label'
									/>
								</Form.Item>
							) : (
								<Form.Item name='quocGiaNoiSinh' label={intl.formatMessage({ id: 'sinhvien.id.quocgia' })}>
									<Input placeholder={intl.formatMessage({ id: 'sinhvien.id.nhapquocgia' })} />
								</Form.Item>
							)}
						</Col>
					</Row>
					{/* <Row gutter={[12, 0]}>
						<SelectDonViHanhChinh form={form} listTinh={listTinh} suffix='NoiSinh' />
					</Row> */}

					<Divider orientation='center'>{intl.formatMessage({ id: 'sinhvien.quequan.title' })}</Divider>
					<Row gutter={[12, 0]}>
						<SelectDonViHanhChinh form={form} listTinh={listTinh} suffix='QueQuan' />
					</Row>

					<Divider orientation='center'>{intl.formatMessage({ id: 'sinhvien.hokhau.title' })}</Divider>
					<Row gutter={[12, 0]}>
						<SelectDonViHanhChinh form={form} listTinh={listTinh} suffix='ThuongTru' hasSoNha />
					</Row>

					<Divider orientation='center'>{intl.formatMessage({ id: 'sinhvien.thongtinlienlac.title' })}</Divider>
					<Row gutter={[12, 0]}>
						<Col span={12}>
							<Form.Item
								name='soDienThoai'
								label={intl.formatMessage({ id: 'sinhvien.id.nhapsdt' })}
								rules={[...rules.soDienThoai]}
							>
								<Input placeholder={intl.formatMessage({ id: 'sinhvien.id.nhapsdt' })} />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name='email2'
								label={intl.formatMessage({ id: 'sinhvien.id.emaillienlac' })}
								rules={[...rules.email]}
							>
								<Input placeholder={intl.formatMessage({ id: 'sinhvien.id.nhapemail' })} />
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

					<Divider orientation='center'>{intl.formatMessage({ id: 'sinhvien.taikhoannganhang' })}</Divider>
					<Row gutter={[12, 0]}>
						<Col span={24} md={8}>
							<Form.Item
								name='soTaiKhoanNganHang'
								label={intl.formatMessage({ id: 'sinhvien.id.stknganhang' })}
								rules={[...rules.sotaikhoan]}
							>
								<Input placeholder={intl.formatMessage({ id: 'sinhvien.id.nhapstknganhang' })} />
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item
								name='tenNganHang'
								label={intl.formatMessage({ id: 'sinhvien.id.tennganhang' })}
								rules={[...rules.text, ...rules.length(250)]}
							>
								<Input placeholder={intl.formatMessage({ id: 'sinhvien.id.nhaptennganhang' })} />
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item
								name='chiNhanhNganHang'
								label={intl.formatMessage({ id: 'sinhvien.id.chinhanh' })}
								rules={[...rules.text, ...rules.length(250)]}
							>
								<Input placeholder={intl.formatMessage({ id: 'sinhvien.id.nhapchinhanh' })} />
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
								label={intl.formatMessage({ id: 'sinhvien.id.ngayvaodoan' })}
								rules={[...rules.truocHomNay]}
							>
								<MyDatePicker allowClear style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col span={12} md={8}>
							<Form.Item
								name='ngayVaoDang'
								label={intl.formatMessage({ id: 'sinhvien.id.ngayvaodang' })}
								rules={[...rules.truocHomNay]}
							>
								<MyDatePicker allowClear style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item
								name='ngayVaoDangChinhThuc'
								label={intl.formatMessage({ id: 'sinhvien.id.ngayvaodangchinhthuc' })}
								rules={[...rules.truocHomNay]}
							>
								<MyDatePicker allowClear style={{ width: '100%' }} />
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
					<FormTuyenSinh />
				</Collapse.Panel>
			</Collapse>
		</Form>
	);
};

export default FormSinhVien;
