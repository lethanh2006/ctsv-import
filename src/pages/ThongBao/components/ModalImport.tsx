import UploadFile from '@/components/Upload/UploadFile';
import { dowLoadBieuMauNguoiNhan } from '@/services/ThongBao';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Col, Form, Modal, Row } from 'antd';
import fileDownload from 'js-file-download';
import _ from 'lodash';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const ModalImport = (props: {
	visible: boolean;
	setVisible: (val: boolean) => void;
	setSelectedUsers: any;
	selectedUsers: any;
	role?: any;
}) => {
	const intl = useIntl();
	const { visible, setVisible, setSelectedUsers, role, selectedUsers } = props;
	const [form] = Form.useForm();
	const { importNguoiNhanThongBaoModel, formSubmiting } = useModel('thongbao.thongbao');

	useEffect(() => {
		if (!visible) resetFieldsForm(form);
	}, [visible]);

	const onDownloadTemplate = () => {
		try {
			dowLoadBieuMauNguoiNhan().then((res: any) =>
				fileDownload(res.data, intl.formatMessage({ id: 'thongbao.import.filename' })),
			);
		} catch (er) {
			console.log('🚀 er:', er);
		}
	};

	const onFinish = async (values: any) => {
		values.file = values?.file?.fileList?.[0].originFileObj;

		importNguoiNhanThongBaoModel(values, role)
			.then((res: any) => {
				const newSelectedUsers = [...selectedUsers, ...res];
				setSelectedUsers(_.uniqBy(newSelectedUsers, (item) => item.code));
				setVisible(false);
			})
			.catch((err: any) => console.log(err));
	};

	return (
		<Modal
			title={intl.formatMessage({ id: 'thongbao.import.button.nhapdulieu' })}
			open={visible}
			onCancel={() => setVisible(false)}
			footer={null}
			width={600}
			destroyOnClose
		>
			<Form layout='vertical' onFinish={onFinish} form={form}>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Form.Item
							name='file'
							label={intl.formatMessage({ id: 'thongbao.import.id.taptin' })}
							rules={[...rules.fileRequired]}
						>
							<UploadFile
								accept='.xls, .xlsx'
								drag
								buttonDescription={intl.formatMessage({ id: 'thongbao.import.description' })}
							/>
						</Form.Item>
					</Col>
					<Col span={24} style={{ textAlign: 'center', marginTop: 8 }}>
						<div
							dangerouslySetInnerHTML={{
								__html: intl.formatMessage({
									id: 'thongbao.import.button.note',
								}),
							}}
						/>
						<br />
						<Button icon={<DownloadOutlined />} type='link' onClick={onDownloadTemplate}>
							{intl.formatMessage({ id: 'thongbao.import.button.tailiemau' })}
						</Button>
					</Col>
				</Row>
				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{intl.formatMessage({ id: 'global.button.luulai' })}
					</Button>

					<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalImport;
