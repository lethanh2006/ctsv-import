import { ESettingKey } from '@/services/base/constant';
import { buildUpLoadFile } from '@/services/uploadFile';
import { ipCCT } from '@/utils/ip';
import rules from '@/utils/rules';
import { Button, Form, Modal, Select, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

const SettingCCD = (props: { visible: boolean; setVisible: (val: boolean) => void }) => {
	const { visible, setVisible } = props;
	const intl = useIntl();
	const { getByKeyModel, updateSettingModel, setFormSubmiting, formSubmiting, loading, settings } =
		useModel('tienich.caidat');
	const { getAllModel } = useModel('danhmuc.ccd');

	const [danhSach, setDanhSach] = useState<ActivitiesTypeDomain.IRecord[]>([]);

	const [form] = Form.useForm();

	useEffect(() => {
		if (visible) {
			getByKeyModel(ESettingKey.CCT_TRANSCRIPT, ipCCT).then((value: SubmisstionRound.ISetting | undefined) =>
				form.setFieldsValue(value),
			);

			getAllModel(undefined, { order: 1 }, undefined, undefined, undefined, false).then((res) => setDanhSach(res));
		}
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
		<Modal title='Configure The Awards Activity Group' open={visible} footer={null} onCancel={() => setVisible(false)}>
			<Spin spinning={loading}>
				<Form form={form} layout='vertical' onFinish={onFinish}>
					<Form.Item label='Activity Group' name='listTypeAwardAndRecognition' rules={[...rules.required]}>
						<Select
							mode={'multiple'}
							allowClear
							value
							options={(danhSach || []).map((item) => ({
								key: item._id,
								value: item._id,
								label: item.name,
								rawData: item,
							}))}
							showSearch
							optionFilterProp='label'
							placeholder={intl.formatMessage({ id: 'activitiestypedomain.select.place' })}
							style={{ width: '100%' }}
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

export default SettingCCD;
