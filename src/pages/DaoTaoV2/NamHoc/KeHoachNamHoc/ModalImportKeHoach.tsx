import UploadFile from '@/components/Upload/UploadFile';
import { getMauImportKeHoachNamHoc } from '@/services/DaoTaoV2/NamHoc/KeHoachNamHoc';
import rules from '@/utils/rules';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Modal, Row } from 'antd';
import fileDownload from 'js-file-download';
import { useModel } from 'umi';

const ModalImportKeHoach = (props: { visible: boolean; onCancel: () => void; onOk: () => void }) => {
	const { visible, onCancel, onOk } = props;
	const { record: recNamHoc } = useModel('daotaov2.namhoc.namhoc');
	const { formSubmiting, importKeHoachNamHocModel } = useModel('daotaov2.namhoc.kehoachnamhoc');
	const [form] = Form.useForm();

	const onFinish = (values: any) => {
		const file = values.file.fileList?.[0]?.originFileObj;
		if (recNamHoc?._id && file)
			importKeHoachNamHocModel({ namHocId: recNamHoc?._id, file }).then(() => {
				onOk();
				form.resetFields();
			});
	};

	const onDownloadTemplate = () => {
		if (recNamHoc?._id)
			getMauImportKeHoachNamHoc(recNamHoc?._id).then((res) =>
				fileDownload(res.data, `Mẫu kế hoạch năm học ${recNamHoc.ten}.xlsx`),
			);
	};

	return (
		<Modal
			title='Nhập kế hoạch năm học'
			open={visible}
			onCancel={() => onCancel()}
			footer={null}
			maskClosable={false}
		>
			<Form form={form} layout='vertical' onFinish={onFinish}>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col span={24}>
						<Form.Item label='Năm học'>
							<Input value={recNamHoc?.ten} disabled />
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item name='file' label='Tập tin danh sách kế hoạch' rules={[...rules.fileRequired]}>
							<UploadFile drag />
						</Form.Item>
					</Col>

					<Col span={24} style={{ textAlign: 'center', margin: '8px auto 12px', maxWidth: 400 }}>
						<i>Sử dụng tập dữ liệu mẫu để việc xử lý được thực hiện nhanh chóng và chính xác</i>
						<br />
						<Button icon={<DownloadOutlined />} type='link' onClick={onDownloadTemplate}>
							Tải tập tin mẫu
						</Button>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						Thực hiện
					</Button>
					<Button onClick={() => onCancel()}>Đóng</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalImportKeHoach;
