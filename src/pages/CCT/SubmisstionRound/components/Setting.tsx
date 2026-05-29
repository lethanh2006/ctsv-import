import UploadFile from '@/components/Upload/UploadFile';
import { ESettingKey } from '@/services/base/constant';
import { EFileScope, uploadFileManagerMultipart } from '@/services/uploadFile';
import { ipCCT } from '@/utils/ip';
import rules from '@/utils/rules';
import { Button, Col, Form, Input, message, Modal, Spin, Typography } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const getUploadedFileId = (file: any) => {
	return file?.response?.file?._id ?? file?.response?._id ?? file?.url ?? null;
};

const getUploadErrorMessage = (error: any) =>
	error?.response?.data?.message ??
	error?.response?.data?.detail?.exception?.message ??
	error?.message ??
	'File upload failed. Please try again.';

const uploadSettingFileRequest = async ({ file, onSuccess, onError }: any) => {
	try {
		const response = await uploadFileManagerMultipart({
			file,
			scope: EFileScope.PRIVATE,
			module: 'co-curriculum',
		});

		const fileId = response?.data?.data?.file?._id ?? response?.data?.data?._id;

		if (!fileId) {
			throw new Error('Missing uploaded file id');
		}

		onSuccess?.({ ...response?.data?.data, _id: fileId, fileId }, file);
	} catch (error) {
		message.error(getUploadErrorMessage(error));
		onError?.(error);
	}
};

const getUploadedSingleFileId = (fileValue: any) => {
	if (!fileValue) return null;

	if (typeof fileValue === 'string') return fileValue;

	const fileList = fileValue?.fileList ?? [];
	const file = fileList?.[0];

	if (!file) return null;

	if (file?.status === 'uploading') {
		throw new Error('File is still uploading. Please wait for the upload to complete.');
	}

	if (file?.status === 'error') {
		throw new Error('File upload failed. Please remove the failed file and upload again.');
	}

	const fileId = getUploadedFileId(file);

	if (!fileId) {
		throw new Error('File has not been uploaded successfully. Please upload again.');
	}

	return fileId;
};

const SettingDot = (props: { visible: boolean; setVisible: (val: boolean) => void }) => {
	const { visible, setVisible } = props;
	const intl = useIntl();
	const { getByKeyModel, updateSettingModel, setFormSubmiting, formSubmiting, loading, settings } =
		useModel('tienich.caidat');
	const [form] = Form.useForm();

	useEffect(() => {
		if (visible)
			getByKeyModel(ESettingKey.CCT_TRANSCRIPT, ipCCT).then((value: SubmisstionRound.ISetting | undefined) =>
				form.setFieldsValue(value),
			);
	}, [visible]);

	const onFinish = async (value: SubmisstionRound.ISetting) => {
		setFormSubmiting(true);

		try {
			value.fileId = getUploadedSingleFileId(value.fileId);
		} catch (error: any) {
			message.error(error?.message);
			setFormSubmiting(false);
			return;
		}

		setFormSubmiting(false);

		const prev = settings[ESettingKey.CCT_TRANSCRIPT] as SubmisstionRound.ISetting | undefined;
		updateSettingModel(
			{
				key: ESettingKey.CCT_TRANSCRIPT,
				value: { ...prev, ...value },
			},
			ipCCT,
		)
			.then(() => setVisible(false))
			.catch((er) => console.log(er));
	};

	return (
		<Modal title='CCT file configuration' open={visible} footer={null} onCancel={() => setVisible(false)}>
			<Spin spinning={loading}>
				<Form form={form} layout='vertical' onFinish={onFinish}>
					<Form.Item label='File Name' name='fileName' rules={[...rules.required]}>
						<Input placeholder='Enter File Name' />
					</Form.Item>
					<Col span={24}>
						<Typography.Text style={{ color: 'red' }} italic>
							Note: The import file must be in .pptx format.
						</Typography.Text>
					</Col>
					<Form.Item label='File' name='fileId' rules={[...rules.required]}>
						<UploadFile
							isPrivate
							maxCount={1}
							otherProps={{
								maxCount: 1,
								multiple: false,
								accept: '.pptx',
								customRequest: uploadSettingFileRequest,
							}}
						/>
					</Form.Item>

					<div className='form-footer'>
						<Button type='primary' htmlType='submit' loading={formSubmiting}>
							{intl.formatMessage({ id: 'global.button.luulai' })}
						</Button>
					</div>
				</Form>
			</Spin>
		</Modal>
	);
};

export default SettingDot;
