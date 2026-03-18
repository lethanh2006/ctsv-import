import rules from '@/utils/rules';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import SelectKhoiNganh from '../../KhoiNganh/components/SelectKhoiNganh';
import { resetFieldsForm } from '@/utils/utils';

const FormTrinhDo = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('daotaov2.danhmuc.dmlinhvuc');
	const { title } = props;

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: LinhVucDaoTao.IRecordBo) => {
		if (edit) {
			putModel(record?._id ?? '', values)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(values)
				.then()
				.catch((er) => console.log(er));
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col xs={24}>
						<Form.Item name='ma' label='Mã' rules={[...rules.required, ...rules.text, ...rules.length(20)]}>
							<Input placeholder='Nhập mã' />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item
							name='ten'
							label='Tên lĩnh vực đào tạo'
							rules={[...rules.required, ...rules.text, ...rules.length(250)]}
						>
							<Input placeholder='Nhập tên lĩnh vực đào tạo' />
						</Form.Item>
					</Col>

					<Col xs={24}>
						<Form.Item name='maDmKhoiNganh' label='Khối ngành đào tạo' rules={[...rules.required]}>
							<SelectKhoiNganh selectMa />
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

export default FormTrinhDo;
