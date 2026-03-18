import SelectNhanSuDebounce from '@/pages/DaoTaoV2/ToChucNhanSu/NhanSu/Select';
import { type DotXetHocVu } from '@/services/DaoTaoV2/KetQuaHocTap/DotXetHocVu/typing';
import { ELoaiThanhPhanHoiDong } from '@/services/DaoTaoV2/KetQuaHocTap/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormThanhVienHoiDong = (props: any) => {
	const intl = useIntl();
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm, getModel } = useModel(
		'ketquahoctap.xethocvu.thanhvienhoidong',
	);
	const { danhSach: danhSachNhanSu } = useModel('daotaov2.tochucnhansu.nhansu');
	const [form] = Form.useForm();
	const { title } = props;

	const getData = () => getModel({ maHocKy: recHocKy?.ma });

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onChangeNhanSu = (ssoId: string) => {
		const ns = danhSachNhanSu.find((item) => item.ssoId === ssoId);
		form.setFieldsValue({
			hoTen: [ns?.hoDem, ns?.ten].join(' '),
			soDienThoai: ns?.sdtCaNhan,
			email: ns?.email,
			chucVu: `${ns?.donViViTri?.tenChucVu ?? ''} - ${ns?.donViChinh?.ten ?? ''}`,
		});
	};

	const onFinish = async (values: DotXetHocVu.IThanhVienHoiDong) => {
		if (edit) {
			putModel(record?._id ?? '', values, getData)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel({ ...values, maHocKy: recHocKy?.ma ?? '' }, getData)
				.then()
				.catch((er) => console.log(er));
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col span={24} md={12}>
						<Form.Item label='Học kỳ'>
							<Input value={recHocKy?.ten} disabled />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item label='Thành phần hội đồng' name='thanhPhan' rules={[...rules.required]}>
							<Select
								placeholder='Chọn thành phần hội đồng'
								options={Object.values(ELoaiThanhPhanHoiDong).map((item) => ({ key: item, label: item, value: item }))}
							/>
						</Form.Item>
					</Col>

					<Col span={24} md={12}>
						<Form.Item label='Họ tên' name='nhanSuSsoId' rules={[...rules.required]}>
							<SelectNhanSuDebounce onChange={(val) => onChangeNhanSu(val?.toString())} />
						</Form.Item>
						<Form.Item name='hoTen' hidden />
					</Col>
					<Col span={24} md={12}>
						<Form.Item label='Chức vụ' name='chucVu' rules={[...rules.text, ...rules.length(100)]}>
							<Input placeholder='Nhập chức vụ' />
						</Form.Item>
					</Col>

					<Col span={24} md={12}>
						<Form.Item label='Số điện thoại' name='soDienThoai' rules={[...rules.soDienThoai]}>
							<Input placeholder='Nhập số điện thoại' />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item label='Email' name='email' rules={[...rules.email]}>
							<Input placeholder='Nhập email' />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit
							? `${intl.formatMessage({ id: 'global.button.themmoi' })}`
							: `${intl.formatMessage({ id: 'global.button.luulai' })}`}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormThanhVienHoiDong;
