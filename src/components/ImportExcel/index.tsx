import { Button, Card, Form } from 'antd';
import * as ExcelJS from 'exceljs';
import UploadFile from '@/components/Upload/UploadFile';

const ImportExcel = (props: { onCancel: any; title?: string; handleData: any }) => {
	const [form] = Form.useForm();

	const handleFile = (file: any) => {
		return new Promise<void>((resolve) => {
			const reader = new FileReader();
			reader.onload = async (e: any) => {
				const ab = e.target.result;
				const workbook = await ExcelJS.Workbook.load(ab);
				const worksheet = workbook.worksheets[0];
				const data: any[] = [];
				worksheet.eachRow((row, rowNumber) => {
					if (rowNumber > 1) { // skip header
						data.push(row.values.slice(1)); // slice(1) to remove the first undefined
					}
				});
				props?.handleData(data);
				resolve();
			};
			reader.readAsArrayBuffer(file);
		});
	};

	return (
		<Card title={props?.title ?? 'Import dữ liệu'}>
			<Form
				onFinish={async (values) => {
					await handleFile(values?.file?.fileList?.[0]?.originFileObj);
				}}
				form={form}
			>
				<Form.Item label='File excel' name='file'>
					<UploadFile
						maxCount={1}
						accept='.xls, .xlsx, .ods'
						otherProps={{
							multiple: false,
							showUploadList: { showDownloadIcon: false },
						}}
					/>
				</Form.Item>

				<Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
					<Button style={{ marginRight: 8 }} htmlType='submit' type='primary'>
						Import
					</Button>
					<Button onClick={() => props?.onCancel()}>Đóng</Button>
				</Form.Item>
			</Form>
		</Card>
	);
};

export default ImportExcel;
