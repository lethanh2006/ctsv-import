import { Button, Card, Col, Collapse, Form, InputNumber, Row, Select, Spin } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import rules from '@/utils/rules';
import { ELoaiGiaTri, SettingKey } from './constants';
import { InfoCircleOutlined } from '@ant-design/icons';
const { Panel } = Collapse;
const CauHinhChinhSua = () => {
	const { fetchSettingMapModel, settingMap, updateSettingModel } = useModel('quantri.cauhinh');
	const [form] = Form.useForm();

	const getData = () => {
		fetchSettingMapModel(SettingKey.THONG_BAO_SU_KIEN).then(() => {
			form.setFieldsValue({ [SettingKey.THONG_BAO_SU_KIEN]: settingMap?.THONG_BAO_SU_KIEN?.value });
		});
	};

	const onFinish = async (value: any) => {
		try {
			updateSettingModel({ key: SettingKey.THONG_BAO_SU_KIEN, value: value?.[SettingKey.THONG_BAO_SU_KIEN] }).then(
				() => {
					getData();
				},
			);
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		getData();
	}, []);

	const onChange = (val: any) => {};

	return (
		<>
			<Card title={'Cấu hình hệ thống'}>
				<Spin spinning={false}>
					<Collapse defaultActiveKey={['1']} onChange={onChange}>
						<Panel header='Thông báo sự kiện' key='1'>
							<Form onFinish={onFinish} layout={'vertical'} form={form}>
								<Row gutter={[12, 12]}>
									<Col span={8}>
										<Form.Item
											name={[SettingKey.THONG_BAO_SU_KIEN, 'giaTri']}
											label={'Giá trị'}
											rules={[...rules.required]}
											tooltip={{
												title: 'Giá trị theo loại thông báo.',
												icon: <InfoCircleOutlined />,
											}}
										>
											<InputNumber style={{ width: '100%' }} max={60} min={0} placeholder={'Giá trị'} />
										</Form.Item>
									</Col>
									<Col span={8}>
										<Form.Item
											name={[SettingKey.THONG_BAO_SU_KIEN, 'loaiGiatri']}
											label={'Loại'}
											rules={[...rules.required]}
											tooltip={{
												title: 'Loại thời gian tính thông báo theo giờ hoặc phút hoặc ngày.',
												icon: <InfoCircleOutlined />,
											}}
										>
											<Select
												placeholder={'Chọn loại thời gian'}
												options={Object.values(ELoaiGiaTri)?.map((val) => ({ value: val, label: val }))}
											></Select>
										</Form.Item>
									</Col>
								</Row>
								<div className='form-footer'>
									<Button htmlType='submit' type='primary'>
										Lưu lại
									</Button>
								</div>
							</Form>
						</Panel>
					</Collapse>
				</Spin>
			</Card>
		</>
	);
};
export default CauHinhChinhSua;
