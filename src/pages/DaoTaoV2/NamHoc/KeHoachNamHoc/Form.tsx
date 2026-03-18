import SelectLoaiHoatDongTuan from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/LoaiHoatDongTuan/components/Select';
import type { KeHoachNamHoc } from '@/services/DaoTaoV2/NamHoc/KeHoachNamHoc/typings';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, InputNumber, Row } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import SelectKhoaNganh from '../KhoaNganh/components/Select';

const FormKeHoachTheoTuan = (props: {
	afterAddNew: (rec: KeHoachNamHoc.IKeHoachTheoTuan) => void;
	isLocal?: boolean;
}) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { recordKHTheoTuan, visibleForm, setVisibleForm, formSubmiting, putKeHoachTheoTuanModel } = useModel(
		'daotaov2.namhoc.kehoachnamhoc',
	);
	const { record: recordNamHoc } = useModel('daotaov2.namhoc.namhoc');
	const { danhSach: danhSachHoatDong } = useModel('daotaov2.danhmuc.loaihoatdongtuan');

	const tuanBatDau = Form.useWatch('tuanBatDau', form);
	const { afterAddNew, isLocal } = props;

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else form.setFieldsValue(recordKHTheoTuan);
	}, [JSON.stringify(recordKHTheoTuan), visibleForm]);

	const onFinish = async (values: KeHoachNamHoc.IKeHoachTheoTuan) => {
		if (isLocal) {
			const hoatDongTuan = danhSachHoatDong.find((item) => item._id === values.hoatDongTuanId);
			afterAddNew({ ...values, hoatDongTuan });
		} else
			putKeHoachTheoTuanModel({ ...values, namHocId: recordNamHoc?._id ?? '' })
				.then((rec) => {
					resetFieldsForm(form);
					if (afterAddNew) afterAddNew(rec);
				})
				.catch((er) => console.log(er));
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<Col span={24}>
					<Form.Item name='maKhoaNganhList' label='Danh sách khóa ngành áp dụng' rules={[...rules.required]}>
						<SelectKhoaNganh multiple namHoc={dayjs(recordNamHoc?.thoiGianBatDau).year()} />
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item name='hoatDongTuanId' label='Tên hoạt động' rules={[...rules.required]}>
						<SelectLoaiHoatDongTuan loadData={false} />
					</Form.Item>
				</Col>

				<Col span={24} md={12}>
					<Form.Item name='tuanBatDau' label='Tuần bắt đầu' rules={[...rules.required, ...rules.number(100, 1, false)]}>
						<InputNumber
							style={{ width: '100%' }}
							min={1}
							max={100}
							step={1}
							onChange={() => form.validateFields(['tuanKetThuc'])}
							placeholder='Nhập tuần bắt đầu'
						/>
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item
						name='tuanKetThuc'
						label='Tuần kết thúc'
						rules={[...rules.required, ...rules.number(100, tuanBatDau, false)]}
					>
						<InputNumber
							style={{ width: '100%' }}
							min={tuanBatDau}
							max={100}
							step={1}
							placeholder='Nhập tuần kết thúc'
						/>
					</Form.Item>
				</Col>
			</Row>

			<div className='form-footer'>
				<Button disabled={recordNamHoc?.daChotKeHoachNamHoc} loading={formSubmiting} htmlType='submit' type='primary'>
					{intl.formatMessage({ id: 'global.button.luulai' })}
				</Button>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>
		</Form>
	);
};

export default FormKeHoachTheoTuan;
