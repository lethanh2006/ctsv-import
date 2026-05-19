import UploadFile from '@/components/Upload/UploadFile';
import { ESettingKey } from '@/services/base/constant';
import { buildUpLoadFile } from '@/services/uploadFile';
import { ipCCT } from '@/utils/ip';
import rules from '@/utils/rules';
import { Button, Form, Input, Modal, Spin } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

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
		const fileId = await buildUpLoadFile(value, 'fileId', undefined, true);
		value.fileId = fileId?.data?.data?._id;
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
					<Form.Item label='File' name='fileId' rules={[...rules.required]}>
						<UploadFile isPrivate />
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
