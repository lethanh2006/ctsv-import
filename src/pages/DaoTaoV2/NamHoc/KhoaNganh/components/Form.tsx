import SelectChuongTrinh from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/ChuongTrinhDaoTao/components/Select';
import SelectNganhCoSo from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/Nganh/components/SelectNganh';
import { ELoaiChuongTrinhDaoTao } from '@/services/DaoTaoV2/DanhMucHeThong/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormKhoaNganh = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, getModel, formSubmiting, visibleForm } =
		useModel('daotaov2.namhoc.khoanganh');
	const { danhSach: danhSachNganh } = useModel('daotaov2.danhmuc.nganhdaotao');
	const { record: recKhoaSv } = useModel('daotaov2.namhoc.khoasinhvien');
	const maNganh = Form.useWatch('maNganh', form);
	const { title } = props;

	const getData = () => getModel({ maKhoaSinhVien: recKhoaSv?.ma });

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: KhoaNganh.IRecord) => {
		if (edit) {
			putModel(record?._id ?? '', values, getData)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel({ ...values, maKhoaSinhVien: recKhoaSv?.ma ?? '' }, getData)
				.then()
				.catch((er) => console.log(er));
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col xs={24}>
						<Form.Item label='Khóa sinh viên'>
							<Input value={recKhoaSv?.ten} disabled />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item name='maNganh' label='Ngành đào tạo' rules={[...rules.required]}>
							<SelectNganhCoSo
								onChange={(val) => {
									form.setFieldsValue({ maChuongTrinhDaoTao: undefined });
									if (!edit) {
										const tenNganh = danhSachNganh.find((item) => item.ma === val)?.ten;
										form.setFieldsValue({
											ma: `${val}_${recKhoaSv?.ma}`,
											ten: `${tenNganh ?? ''} - ${recKhoaSv?.ten}`,
										});
									}
								}}
								selectMa
								disabled={edit}
							/>
						</Form.Item>
					</Col>

					<Col span={24} md={8}>
						<Form.Item label='Mã' name='ma' rules={[...rules.required, ...rules.length(20)]}>
							<Input placeholder='Nhập mã khóa ngành' disabled={edit} />
						</Form.Item>
					</Col>
					<Col span={24} md={16}>
						<Form.Item label='Tên khóa ngành' name='ten' rules={[...rules.required, ...rules.length(250)]}>
							<Input placeholder='Nhập tên khóa ngành' />
						</Form.Item>
					</Col>

					<Col xs={24}>
						<Form.Item name='maChuongTrinhDaoTao' label='Chương trình đào tạo' rules={[...rules.required]}>
							<SelectChuongTrinh
								selectMa
								disabled={edit}
								condition={{
									maTrinhDoDaoTao: recKhoaSv?.maTrinhDoDaoTao,
									maNganh,
									loai: ELoaiChuongTrinhDaoTao.CHUAN,
								}}
							/>
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

export default FormKhoaNganh;
