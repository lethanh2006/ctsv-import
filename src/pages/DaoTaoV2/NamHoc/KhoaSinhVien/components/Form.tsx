import SelectHinhThuc from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/HinhThuc/components/Select';
import SelectTrinhDo from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/TrinhDo/components/Select';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, InputNumber, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormKhoaSinhVien = (props: { afterAddNew: (rec: KhoaSinhVien.IRecord) => void }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, setRecord, setEdit, visibleForm } =
		useModel('daotaov2.namhoc.khoasinhvien');
	const { afterAddNew } = props;

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: KhoaSinhVien.IRecord) => {
		if (edit) {
			putModel(record?._id ?? '', values, undefined, undefined, false)
				.then((rec) => {
					setRecord(rec);
				})
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

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<Col xs={24} md={12}>
					<Form.Item name='maTrinhDoDaoTao' label='Trình độ đào tạo' rules={[...rules.required]}>
						<SelectTrinhDo selectMa disabled={edit} />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item name='maHinhThucDaoTao' label='Hình thức đào tạo' rules={[...rules.required]}>
						<SelectHinhThuc selectMa disabled={edit} />
					</Form.Item>
				</Col>
				{/* <Col xs={24}>
            <Form.Item name="namHocId" label="Năm học" rules={[...rules.required]}>
              <SelectNamHoc />
            </Form.Item>
          </Col> */}
				<Col xs={24} md={12}>
					<Form.Item
						name='namHocBatDau'
						label='Năm học bắt đầu'
						rules={[...rules.required, ...rules.number(2050, 2010, false)]}
					>
						<InputNumber
							style={{ width: '100%' }}
							min={2010}
							max={2050}
							placeholder='Nhập năm học bắt đầu'
							disabled={edit}
						/>
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item
						name='ten'
						label='Tên khóa sinh viên'
						rules={[...rules.required, ...rules.text, ...rules.length(250)]}
					>
						<Input placeholder='Nhập tên khóa sinh viên' />
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
	);
};

export default FormKhoaSinhVien;
