import { ELoaiBieuMau } from '@/services/TienIch/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Checkbox, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormThongTinChungKhaoSat = (props: { afterAddNew?: () => void }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { formSubmiting, record, setRecord, visibleForm, setVisibleForm } = useModel('tienich.bieumau');

	// const [camKet, setCamKet] = useState<boolean | undefined>(record?.coCamKet);

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record?._id) {
			form.setFieldsValue(record);
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		setRecord({
			...record,
			...values,
			loai: ELoaiBieuMau.QUESTIONS,
		});
		if (props.afterAddNew) props.afterAddNew();
	};

	return (
		<Form layout='vertical' onFinish={onFinish} form={form}>
			<Row gutter={[12, 12]}>
				<Col span={24}>
					<Form.Item
						name='tieuDe'
						label={intl.formatMessage({ id: 'questionsmanagement.thongtinchung.tieude' })}
						rules={[...rules.required, ...rules.text, ...rules.length(250)]}
					>
						<Input placeholder={intl.formatMessage({ id: 'questionsmanagement.thongtinchung.tieude.place' })} />
					</Form.Item>
				</Col>

				<Col span={24}>
					<Form.Item name='moTa' label={intl.formatMessage({ id: 'questionsmanagement.thongtinchung.mota' })}>
						<Input.TextArea
							rows={3}
							placeholder={intl.formatMessage({ id: 'questionsmanagement.thongtinchung.mota.place' })}
						/>
					</Form.Item>
				</Col>

				<Col span={24}>
					<Form.Item name='defaultQuestion' initialValue={record?.defaultQuestion ?? true} valuePropName='checked'>
						<Checkbox>{intl.formatMessage({ id: 'questionsmanagement.thongtinchung.defaultQuestion' })}</Checkbox>
					</Form.Item>
				</Col>
			</Row>

			<div className='form-footer'>
				<Button loading={formSubmiting} htmlType='submit' type='primary'>
					{intl.formatMessage({ id: 'questionsmanagement.button.tieptheo' })}
				</Button>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>
		</Form>
	);
};

export default FormThongTinChungKhaoSat;
