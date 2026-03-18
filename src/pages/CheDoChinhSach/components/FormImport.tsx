import UploadFile from '@/components/Upload/UploadFile';
import rules from '@/utils/rules';
import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Form } from 'antd';
import { useIntl, useModel } from 'umi';

const FormImport = (props: { getData: any }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, importCheDoSinhVienModel, setVisibleImport, loading, formSubmiting } = useModel(
		'chedochinhsach.chedochinhsach',
	);

	return (
		<Form
			scrollToFirstError
			form={form}
			onFinish={async (values) => {
				if (record?._id)
					importCheDoSinhVienModel(record?._id, { file: values?.file?.fileList?.[0]?.originFileObj }, props.getData);
			}}
		>
			<Form.Item
				rules={[...rules.required]}
				name='file'
				label={intl.formatMessage({ id: 'kyluatkhenthuong.formimport.file' })}
			>
				<UploadFile maxCount={1} accept='.xlsx' />
			</Form.Item>

			<div className='form-footer'>
				<Button icon={<SaveOutlined />} loading={formSubmiting || loading} htmlType='submit' type='primary'>
					{intl.formatMessage({ id: 'global.button.luulai' })}
				</Button>
				<Button icon={<CloseOutlined />} onClick={() => setVisibleImport(false)}>
					{intl.formatMessage({ id: 'global.button.huy' })}
				</Button>
			</div>
		</Form>
	);
};

export default FormImport;
