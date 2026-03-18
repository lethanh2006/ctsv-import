import UploadFile from '@/components/Upload/UploadFile';
import SelectTags from '@/pages/QuyTrinhDong/QuanLyTag/select';
import { buildUpLoadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { renderFileListUrl } from '@/utils/utils';
import { useModel } from 'umi';
import { Button, Card, Col, Form, Input, Row, Spin } from 'antd';
import { useEffect } from 'react';

const FormVanBan = () => {
	const { record, edit, postModel, putModel, setVisibleForm, loading } = useModel('quytrinh.quanlyvanban');
	const [form] = Form.useForm();
	const onFinish = async (val: any) => {
		try {
			const url = await buildUpLoadFile(val, 'url');
			if (edit) {
				putModel(record?._id, { ...val, url });
			} else {
				postModel({ ...val, url });
			}
		} catch (e) {
			console.log(e);
		}
	};
	useEffect(() => {
		if (edit && record) {
			form.setFieldsValue({ ...record });
		}
	}, [edit, record]);
	return (
		<Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
			<Spin spinning={loading}>
				<Form onFinish={onFinish} layout={'vertical'} form={form}>
					<Row gutter={[16, 16]}>
						<Col span={24}>
							<Form.Item label={'Tên văn bản'} name={'ten'} rules={[...rules.required, ...rules.length(200)]}>
								<Input placeholder={'Nhập tên văn bản'} autoFocus />
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item label={'Số'} name={'ma'} rules={[...rules.required, ...rules.length(50)]}>
								<Input placeholder={'Nhập số'} />
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item label={'Phân loại'} name={'tags'} rules={[...rules.required]}>
								<SelectTags multiple valueGet={'ten'} />
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item
								label={'File đính kèm'}
								name={'url'}
								rules={[...rules.required, ...rules.fileRequired]}
								initialValue={renderFileListUrl(record?.url ?? '')}
							>
								<UploadFile maxCount={1} accept={'.docx, .pdf'} />
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item>
								<div style={{ display: 'flex', justifyContent: 'center' }}>
									<Button type={'primary'} htmlType={'submit'} style={{ marginRight: 8 }}>
										{edit ? 'Chỉnh sửa' : 'Thêm mới'}
									</Button>
									<Button
										onClick={() => {
											setVisibleForm(false);
										}}
									>
										Đóng
									</Button>
								</div>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Spin>
		</Card>
	);
};
export default FormVanBan;
