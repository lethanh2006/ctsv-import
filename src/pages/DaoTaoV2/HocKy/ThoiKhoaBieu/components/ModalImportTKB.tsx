import UploadFile from '@/components/Upload/UploadFile';
import { getImportTemplateTheoHocKy } from '@/services/DaoTaoV2/HocKy/LopHocPhan';
import rules from '@/utils/rules';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Modal, Row, message } from 'antd';
import fileDownload from 'js-file-download';
import { useModel } from 'umi';

const ModalImportTKB = (props: { visible?: boolean; onCancel: () => void; onOk: () => void }) => {
	const { visible, onCancel, onOk } = props;
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { formSubmiting, importThoiKhoaBieuModel1 } = useModel('daotaov2.hocky.thoikhoabieu');
	const [form] = Form.useForm();

	const onFinish = (values: any) => {
		const file = values.file.fileList?.[0]?.originFileObj;
		importThoiKhoaBieuModel1(recHocKy?.ma ?? '', { file })
			.then((res) => {
				console.log(res);
				message.success('Lưu thành công');
				onOk();
				// if (res.res === 'SUCCEEDED') {
				//   message.success(`Đã nhập ${res.nImported} mục thành công`);
				//   onOk();
				// } else {
				//   message.error('Có lỗi xảy ra');
				//   onCancel();
				// }
			})
			.catch((er) => console.log(er))
			.finally(() => form.resetFields());
	};

	const onDownloadTemplate = () => {
		if (recHocKy?._id)
			getImportTemplateTheoHocKy(recHocKy._id).then((res) => fileDownload(res.data, 'Mấu import Thời khóa biểu.xlsx'));
	};

	return (
		<Modal title='Nhập thời khóa biểu' open={visible} onCancel={onCancel} footer={null} maskClosable={false}>
			<Form form={form} layout='vertical' onFinish={onFinish}>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col span={24}>
						<Form.Item label='Học kỳ'>
							<Input value={recHocKy?.ten} disabled />
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item name='file' label='Tập tin thời khóa biểu' rules={[...rules.fileRequired]}>
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
					<Button onClick={onCancel}>Đóng</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalImportTKB;
