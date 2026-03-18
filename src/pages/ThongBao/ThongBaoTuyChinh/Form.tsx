import TinyEditor from '@/components/TinyEditor';
import UploadFile from '@/components/Upload/UploadFile';
import { AppModules } from '@/services/base/constant';
import { dowLoadBieuMauNguoiNhan } from '@/services/ThongBao';
import { EVaiTroKhaoSat, TenVaiTroKhaoSat } from '@/services/ThongBao/constant';
import { currentRole } from '@/utils/ip';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Select, Space } from 'antd';
import fileDownload from 'js-file-download';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormThongBaoTuyChinh = (props: any) => {
	const intl = useIntl();
	const { afterAddNew, type } = props;
	const [form] = Form.useForm();
	const {
		visibleThongBaoDanhSach,
		setVisibleThongBaoDanhSach,
		formSubmiting,
		guiThongBaoDanhSachModal,
		recordThongBaoDanhSach,
	} = useModel('thongbao.thongbao');

	useEffect(() => {
		if (!visibleThongBaoDanhSach) {
			resetFieldsForm(form);
			form.setFieldsValue({ content: '' });
		} else {
			form.setFieldsValue(recordThongBaoDanhSach);
		}
	}, [visibleThongBaoDanhSach, recordThongBaoDanhSach?.title]);

	const onDownloadTemplate = () => {
		try {
			dowLoadBieuMauNguoiNhan().then((res: any) =>
				fileDownload(res.data, intl.formatMessage({ id: 'thongbao.formtuychinh.filename' })),
			);
		} catch (er) {
			console.log('🚀 er:', er);
		}
	};

	const onFinish = async (values: any) => {
		await guiThongBaoDanhSachModal(
			values?.file?.fileList[0],
			type,
			values.title,
			values.content,
			AppModules[currentRole].title,
			values.vaiTroNguoiNhan,
			'0',
		)
			.then((rec) => {
				if (afterAddNew) afterAddNew(rec);
			})
			.catch((err) => console.log(err));
	};

	return (
		<Form layout='vertical' onFinish={onFinish} form={form}>
			<Row gutter={[12, 0]}>
				<Col span={24}>
					<Form.Item
						name='title'
						label={intl.formatMessage({ id: 'thongbao.formtuychinh.title.label' })}
						rules={[...rules.required, ...rules.text, ...rules.length(250)]}
					>
						<Input placeholder={intl.formatMessage({ id: 'thongbao.formtuychinh.title.placeholder' })} />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item
						name='vaiTroNguoiNhan'
						label={intl.formatMessage({ id: 'thongbao.formtuychinh.receiverRole.label' })}
						rules={[...rules.required]}
					>
						<Select
							placeholder={intl.formatMessage({ id: 'thongbao.formtuychinh.receiverRole.placeholder' })}
							options={Object.values([EVaiTroKhaoSat.SINH_VIEN, EVaiTroKhaoSat.NHAN_VIEN]).map((item) => ({
								value: item,
								label: TenVaiTroKhaoSat[item],
							}))}
						/>
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item
						name='file'
						label={
							<Space>
								<span>{intl.formatMessage({ id: 'thongbao.formtuychinh.receiverFile.label' })}</span>

								<Button icon={<DownloadOutlined />} type='link' onClick={onDownloadTemplate}>
									{intl.formatMessage({ id: 'thongbao.formtuychinh.receiverFile.downloadTemplate' })}
								</Button>
							</Space>
						}
						rules={[...rules.required]}
					>
						<UploadFile maxCount={1} />
					</Form.Item>
				</Col>
				<Form.Item
					name='content'
					label={intl.formatMessage({ id: 'thongbao.formtuychinh.content.label' })}
					rules={[...rules.requiredHtml]}
					extra={
						<div>
							<p>
								{intl.formatMessage({
									id: 'thongbao.formtuychinh.content.guide.title',
								})}
							</p>
							<ul style={{ margin: 0, paddingLeft: '20px', marginTop: -10 }}>
								<li
									dangerouslySetInnerHTML={{
										__html: intl.formatMessage(
											{ id: 'thongbao.formtuychinh.content.guide.rule1' },
											{ syntax: '{{..}}' },
										),
									}}
								/>
								<li>
									{intl.formatMessage({
										id: 'thongbao.formtuychinh.content.guide.rule2',
									})}
								</li>
								<li
									dangerouslySetInnerHTML={{
										__html: intl.formatMessage({ id: 'thongbao.formtuychinh.content.guide.rule3' }),
									}}
								/>
								<li>
									{intl.formatMessage({
										id: 'thongbao.formtuychinh.content.guide.rule4',
									})}
								</li>
							</ul>
						</div>
					}
				>
					<TinyEditor height={300} hideMenubar />
				</Form.Item>
			</Row>

			<div className='form-footer'>
				<Button loading={formSubmiting} htmlType='submit' type='primary'>
					{intl.formatMessage({ id: 'thongbao.formtuychinh.button.preview' })}
				</Button>
				<Button onClick={() => setVisibleThongBaoDanhSach(false)}>
					{intl.formatMessage({ id: 'global.button.huy' })}
				</Button>
			</div>
		</Form>
	);
};

export default FormThongBaoTuyChinh;
