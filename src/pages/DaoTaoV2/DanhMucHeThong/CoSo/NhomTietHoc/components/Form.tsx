import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import SelectHinhThuc from '../../HinhThuc/components/Select';
import SelectTrinhDo from '../../TrinhDo/components/Select';

const FormNhomTietHoc = (props: { afterAddNew?: (rec: NhomTietHoc.IRecordCoSo) => void }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { afterAddNew } = props;
	const {
		record,
		setRecord,
		setVisibleForm,
		edit,
		setEdit,
		postModel,
		putModel,
		getModel,
		formSubmiting,
		visibleForm,
	} = useModel('daotaov2.danhmuc.nhomtiethoc');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: NhomTietHoc.IRecordCoSo) => {
		if (edit) {
			putModel(record?._id ?? '', values, getModel, undefined, false)
				.then()
				.catch((er) => console.log(er));
		} else {
			const finalValues = { ...values, active: true };
			postModel(finalValues, getModel, false)
				.then((rec) => {
					setRecord(rec);
					setEdit(true);
					if (afterAddNew) afterAddNew(rec);
				})
				.catch((er) => console.log(er));
		}
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<Col span={24} md={12}>
					<Form.Item name='maTrinhDoDaoTao' label='Trình độ đào tạo' rules={[...rules.required]}>
						<SelectTrinhDo selectMa />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item name='maHinhThucDaoTao' label='Hình thức đào tạo' rules={[...rules.required]}>
						<SelectHinhThuc selectMa />
					</Form.Item>
				</Col>

				<Col span={24} md={12}>
					<Form.Item name='ma' label='Mã nhóm tiết học' rules={[...rules.required, ...rules.text, ...rules.length(20)]}>
						<Input placeholder='Nhập mã nhóm tiết học' />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item
						name='ten'
						label='Tên nhóm tiết học'
						rules={[...rules.required, ...rules.text, ...rules.length(250)]}
					>
						<Input placeholder='Nhập tên nhóm' />
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

export default FormNhomTietHoc;
