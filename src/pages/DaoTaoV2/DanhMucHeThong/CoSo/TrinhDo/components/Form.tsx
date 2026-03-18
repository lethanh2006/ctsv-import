import SelectTrinhDo from '@/pages/DaoTaoV2/DanhMucHeThong/Bo/TrinhDo/components/SelectTrinhDo';
import SelectVanBanQuyDinh from '@/pages/DaoTaoV2/DanhMucHeThong/VanBanQuyDinh/components/Select';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormTrinhDo = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('daotaov2.danhmuc.trinhdo');
	const { title } = props;

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: TrinhDoDaoTao.IRecordCoSo) => {
		if (edit) {
			putModel(record?._id ?? '', { ...values, canCuId: values.canCuId || null })
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
						<Form.Item name='maDmTrinhDo' label='Trình độ đào tạo của Bộ GD&ĐT' rules={[...rules.required]}>
							<SelectTrinhDo
								selectMa
								onChange={(values: string[], options: any) =>
									!edit &&
									form.setFieldsValue({
										ma: options.label.split('(').pop().split(')').shift(),
										ten: options.label.split('(')?.[0],
									})
								}
							/>
						</Form.Item>
					</Col>
					<Col span={24} md={8}>
						<Form.Item name='ma' label='Mã' rules={[...rules.required, ...rules.text, ...rules.length(20)]}>
							<Input placeholder='Nhập mã trình độ' disabled={edit} />
						</Form.Item>
					</Col>
					<Col span={24} md={16}>
						<Form.Item name='ten' label='Tên trình độ' rules={[...rules.required, ...rules.text, ...rules.length(250)]}>
							<Input placeholder='Nhập tên trình độ' />
						</Form.Item>
					</Col>

					<Col xs={24}>
						<Form.Item name='canCuId' label='Căn cứ pháp lý'>
							<SelectVanBanQuyDinh hasDefault={!edit} />
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
