import UploadFile from '@/components/Upload/UploadFile';
import SelectLoaiDanhMucChung from '@/pages/KyTucXa/DanhMucChung/components/Select';
import { buildUpLoadFile } from '@/services/uploadFile';
import { ipCsvc } from '@/utils/ip';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Checkbox, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormThemMoi = (props: any) => {
	const { getData } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm, isView, setFormSubmiting } =
		useModel('kytucxa.danhmucchung');
	const maLoai = Form.useWatch('maLoai', form);

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue({ ...record });

		if (!record?._id) {
			form.setFieldsValue({ maLoai: 'TIEN_ICH_PHONG' });
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		try {
			setFormSubmiting(true);

			const anh = await buildUpLoadFile(values, 'anh', undefined, undefined, ipCsvc);
			values.anh = anh;
			setFormSubmiting(true);

			if (values.maLoai !== 'TIEN_ICH_PHONG') {
				delete values.cauHinh;
			} else {
				values.cauHinh = {
					...(values.cauHinh || {}),
					tienIchChung: !!values?.cauHinh?.tienIchChung,
				};
			}

			if (edit) {
				putModel(
					record?._id ?? '',
					values,
					getData,
					undefined,
					undefined,
					intl.formatMessage({ id: 'global.message.luuthanhcong' }),
				);
			} else {
				postModel(values, getData, undefined, intl.formatMessage({ id: 'global.message.themmoithanhcong' }));
			}
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<Form form={form} onFinish={onFinish} layout='vertical'>
			<Row gutter={16}>
				<Col span={12}>
					<Form.Item
						name='ma'
						label={intl.formatMessage({ id: 'kytucxa.danhmucchung.ma' })}
						rules={[...rules.required]}
					>
						<Input
							placeholder={intl.formatMessage({ id: 'kytucxa.danhmucchung.nhapma' })}
							autoFocus
							disabled={edit || isView}
						/>
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item
						name='maLoai'
						label={intl.formatMessage({ id: 'kytucxa.danhmucchung.maloai' })}
						rules={[...rules.required]}
					>
						<SelectLoaiDanhMucChung disabled={edit || isView} selectMa />
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item
						name='ten'
						label={intl.formatMessage({ id: 'kytucxa.danhmucchung.ten' })}
						rules={[...rules.required]}
					>
						<Input placeholder={intl.formatMessage({ id: 'kytucxa.danhmucchung.nhapten' })} disabled={isView} />
					</Form.Item>
				</Col>

				{maLoai === 'TIEN_ICH_PHONG' && (
					<Col span={12}>
						<Form.Item label=' ' colon={false}>
							<Form.Item name={['cauHinh', 'tienIchChung']} valuePropName='checked' noStyle>
								<Checkbox disabled={isView}>{intl.formatMessage({ id: 'kytucxa.danhmucchung.tienichchung' })}</Checkbox>
							</Form.Item>
						</Form.Item>
					</Col>
				)}

				<Col span={24}>
					<Form.Item name='ghiChu' label={intl.formatMessage({ id: 'kytucxa.danhmucchung.ghichu' })}>
						<Input.TextArea
							rows={3}
							placeholder={intl.formatMessage({ id: 'kytucxa.danhmucchung.nhapghichu' })}
							disabled={isView}
						/>
					</Form.Item>
				</Col>

				<Col span={24}>
					<Form.Item name='anh' label={intl.formatMessage({ id: 'kytucxa.danhmucchung.anhicon' })}>
						<UploadFile disabled={isView} maxCount={1} isAvatarSmall buttonDescription='Chọn Icon' />
					</Form.Item>
				</Col>
			</Row>

			<div className='form-footer'>
				{!isView && (
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{intl.formatMessage({ id: 'global.button.luulai' })}
					</Button>
				)}
				<Button onClick={() => setVisibleForm(false)}>
					{intl.formatMessage({ id: isView ? 'global.button.dong' : 'global.button.huy' })}
				</Button>
			</div>
		</Form>
	);
};

export default FormThemMoi;
