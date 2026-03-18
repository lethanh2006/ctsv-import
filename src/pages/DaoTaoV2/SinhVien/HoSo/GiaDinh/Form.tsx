import MyDatePicker from '@/components/MyDatePicker';
import SelectDanToc from '@/pages/DaoTaoV2/Core/DanToc/SelectDanToc';
import SelectDiaChiHoSoFormItem from '@/pages/DaoTaoV2/Core/DonViHanhChinh/SelectDiaChiHoSo';
import SelectQuocTich from '@/pages/DaoTaoV2/Core/QuocTich/SelectQuocTich';
import SelectTonGiao from '@/pages/DaoTaoV2/Core/TonGiao/SelectTonGiao';
import { getTinhThanhPho } from '@/services/Core/DonViHanhChinh';
import type { DonViHanhChinh } from '@/services/Core/DonViHanhChinh/typing';
import { ELoaiThanhVienGiaDinh, ETrangThaiThanhVienGiaDinh } from '@/services/DaoTaoV2/SinhVien/constant';
import type { SinhVien } from '@/services/DaoTaoV2/SinhVien/typings';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';

const FormThongTinGiaDinh = (props: {
	visible: boolean;
	onOk: (rec: SinhVien.TThongTinGiaDinh) => void;
	onCancel: () => void;
	record?: SinhVien.TThongTinGiaDinh;
}) => {
	const intl = useIntl();
	const { visible, onCancel, onOk, record } = props;
	const [listTinh, setListTinh] = useState<DonViHanhChinh.IRecord[]>();
	const [form] = Form.useForm();
	const trangThaiThanhVien: ETrangThaiThanhVienGiaDinh = Form.useWatch('trangThaiThanhVien', form);

	useEffect(() => {
		getTinhThanhPho().then((data) => {
			setListTinh(data.data.data);
		});
	}, []);

	useEffect(() => {
		if (!visible) resetFieldsForm(form);
		else if (record?.key !== undefined) form.setFieldsValue(record);
	}, [record?.key, visible]);

	const onFinish = async (values: SinhVien.TThongTinGiaDinh) => {
		if (onOk) onOk(values);
	};

	return (
		<Card
			title={`${intl.formatMessage({ id: record?.key !== undefined ? 'global.title.chinhsua' : 'global.title.themmoi' })} ${intl.formatMessage({ id: 'sinhvien.giadinh.title' })}`}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={12} md={6}>
						<Form.Item
							name='loaiThanhVien'
							label={intl.formatMessage({ id: 'sinhvien.giadinh.id.loaithanhvien' })}
							rules={[...rules.required]}
						>
							<Select
								placeholder={intl.formatMessage({ id: 'sinhvien.giadinh.id.chonloaithanhvien' })}
								options={Object.values(ELoaiThanhVienGiaDinh).map((item) => ({ key: item, value: item, label: item }))}
							/>
						</Form.Item>
					</Col>
					<Col span={12} md={6}>
						<Form.Item
							name='trangThaiThanhVien'
							label={intl.formatMessage({ id: 'sinhvien.giadinh.id.trangthai' })}
							rules={[...rules.required]}
						>
							<Select
								placeholder={intl.formatMessage({ id: 'sinhvien.giadinh.id.chontrangthai' })}
								options={Object.values(ETrangThaiThanhVienGiaDinh).map((item) => ({
									key: item,
									value: item,
									label: item,
								}))}
							/>
						</Form.Item>
					</Col>

					{trangThaiThanhVien !== ETrangThaiThanhVienGiaDinh.KHONG_CO_THONG_TIN ? (
						<>
							<Col span={12} md={6}>
								<Form.Item
									name='hoDem'
									label={intl.formatMessage({ id: 'sinhvien.giadinh.id.hodem' })}
									rules={[...rules.required, ...rules.ten]}
								>
									<Input placeholder={intl.formatMessage({ id: 'sinhvien.giadinh.id.nhaphodem' })} />
								</Form.Item>
							</Col>
							<Col span={12} md={6}>
								<Form.Item
									name='ten'
									label={intl.formatMessage({ id: 'sinhvien.giadinh.id.ten' })}
									rules={[...rules.required, ...rules.ten]}
								>
									<Input placeholder={intl.formatMessage({ id: 'sinhvien.giadinh.id.nhapten' })} />
								</Form.Item>
							</Col>

							<Col span={12} md={6}>
								<Form.Item name='ngaySinh' label={intl.formatMessage({ id: 'sinhvien.giadinh.id.ngaysinh' })}>
									<MyDatePicker placeholder={intl.formatMessage({ id: 'sinhvien.giadinh.id.chonngaysinh' })} />
								</Form.Item>
							</Col>
							<Col span={12} md={6}>
								<Form.Item name='quocTich' label={intl.formatMessage({ id: 'sinhvien.giadinh.id.quoctich' })}>
									<SelectQuocTich />
								</Form.Item>
							</Col>
							<Col span={12} md={6}>
								<Form.Item name='danToc' label={intl.formatMessage({ id: 'sinhvien.giadinh.id.dantoc' })}>
									<SelectDanToc />
								</Form.Item>
							</Col>
							<Col span={12} md={6}>
								<Form.Item name='tonGiao' label={intl.formatMessage({ id: 'sinhvien.giadinh.id.tongiao' })}>
									<SelectTonGiao />
								</Form.Item>
							</Col>

							<Col span={12} md={6}>
								<Form.Item
									name='soDienThoai'
									label={intl.formatMessage({ id: 'sinhvien.giadinh.id.sdt' })}
									rules={[...rules.soDienThoai]}
								>
									<Input placeholder={intl.formatMessage({ id: 'sinhvien.giadinh.id.nhapsdt' })} />
								</Form.Item>
							</Col>
							<Col span={12} md={6}>
								<Form.Item
									name='email'
									label={intl.formatMessage({ id: 'sinhvien.giadinh.id.email' })}
									rules={[...rules.email]}
								>
									<Input placeholder={intl.formatMessage({ id: 'sinhvien.giadinh.id.nhapemail' })} />
								</Form.Item>
							</Col>
							<Col span={12} md={6}>
								<Form.Item
									name='ngheNghiep'
									label={intl.formatMessage({ id: 'sinhvien.giadinh.id.nghenghiep' })}
									rules={[...rules.text, ...rules.length(250)]}
								>
									<Input placeholder={intl.formatMessage({ id: 'sinhvien.giadinh.id.nhapnghenghiep' })} />
								</Form.Item>
							</Col>
							<Col span={12} md={6}>
								<Form.Item
									name='coQuanCongTac'
									label={intl.formatMessage({ id: 'sinhvien.giadinh.id.coquancongtac' })}
									rules={[...rules.text, ...rules.length(250)]}
								>
									<Input placeholder={intl.formatMessage({ id: 'sinhvien.giadinh.id.nhapcoquancongtac' })} />
								</Form.Item>
							</Col>

							<Col span={24}>
								<Form.Item
									name='hoKhauThuongTru'
									label={intl.formatMessage({ id: 'sinhvien.giadinh.id.hokhauthuongtru' })}
								>
									<SelectDiaChiHoSoFormItem listTinh={listTinh} />
								</Form.Item>
							</Col>
							<Col span={24}>
								<Form.Item name='diaChiHienNay' label={intl.formatMessage({ id: 'sinhvien.giadinh.id.diachihientai' })}>
									<SelectDiaChiHoSoFormItem listTinh={listTinh} hasSoNha />
								</Form.Item>
							</Col>

							<Col span={24} md={6}>
								<Form.Item
									name='soTheBHYT'
									label={intl.formatMessage({ id: 'sinhvien.giadinh.id.sotbhyt' })}
									rules={[...rules.text, ...rules.length(50)]}
								>
									<Input placeholder={intl.formatMessage({ id: 'sinhvien.giadinh.id.nhapsotbhyt' })} />
								</Form.Item>
							</Col>
							<Col span={24} md={18}>
								<Form.Item
									name='hoatDongChinhTriXaHoi'
									label={intl.formatMessage({ id: 'sinhvien.giadinh.id.hoatdongchinhtri' })}
									rules={[...rules.text, ...rules.length(250)]}
								>
									<Input placeholder={intl.formatMessage({ id: 'sinhvien.giadinh.id.nhaphoatdongchinhtri' })} />
								</Form.Item>
							</Col>
						</>
					) : null}
				</Row>

				<div className='form-footer'>
					<Button htmlType='submit' type='primary'>
						{intl.formatMessage({ id: record?.key !== undefined ? 'global.button.luulai' : 'global.button.themmoi' })}
					</Button>
					<Button onClick={onCancel}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormThongTinGiaDinh;
