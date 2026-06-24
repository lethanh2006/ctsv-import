import UploadFile from '@/components/Upload/UploadFile';
import rules from '@/utils/rules';
import { Button, Card, Col, Form, Row } from 'antd';
import { useIntl, useModel } from 'umi';

const FormCapNhatAnhSV = (props: { getData: any }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { setvisibleFormCapNhatAnh, loading, uploadAnhTheSinhVienModel } = useModel('daotaov2.sinhvien.sinhvien');

	const onFinish = async (values: any) => {
		uploadAnhTheSinhVienModel(
			{
				file: values?.file?.fileList?.[0]?.originFileObj,
			},
			props.getData,
		);
	};

	return (
		<Card title={intl.formatMessage({ id: 'hosonguoihoc.formcapnhatanhthesv.title' })}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col xs={24} md={24}>
						<Form.Item
							extra={
								<div
									dangerouslySetInnerHTML={{
										__html: intl.formatMessage({ id: 'hosonguoihoc.formcapnhatanhthesv.note' }),
									}}
								/>
							}
							name='file'
							label={intl.formatMessage({ id: 'hosonguoihoc.formcapnhatanhthesv.fileanhsv' })}
							rules={[...rules.fileRequired]}
						>
							<UploadFile maxFileSize={25} accept='.zip' maxCount={1} resize />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={loading} htmlType='submit' type='primary'>
						{intl.formatMessage({ id: 'global.button.luulai' })}
					</Button>
					<Button onClick={() => setvisibleFormCapNhatAnh(false)}>
						{intl.formatMessage({ id: 'global.button.huy' })}
					</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormCapNhatAnhSV;
