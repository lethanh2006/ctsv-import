import TinyEditor from '@/components/TinyEditor';
import UploadFile from '@/components/Upload/UploadFile';
import SelectDonVi from '@/pages/ToChucNhanSu/DonVi/Select';
import type { CauLacBo } from '@/services/CauLacBo/typings';
import { buildUpLoadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormCauLacBo = () => {
	const intl = useIntl();
	const [form] = Form.useForm();

	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('caulacbo.caulacbo');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) {
			form.setFieldsValue({
				...record,
			});
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: CauLacBo.IRecord) => {
		const noiQuyQuyChe = await buildUpLoadFile(values, 'noiQuyQuyChe');
		const logo = await buildUpLoadFile(values, 'logo');
		const quyetDinhThanhLap = await buildUpLoadFile(values, 'quyetDinhThanhLap');
		const payload = {
			...record,
			...values,
			noiQuyQuyChe,
			quyetDinhThanhLap,
			logo,
		};
		if (edit) {
			putModel(
				record?._id ?? '',
				payload,
				undefined,
				undefined,
				undefined,
				intl.formatMessage({ id: 'global.message.luuthanhcong' }),
			);
		} else {
			postModel(payload, undefined, undefined, intl.formatMessage({ id: 'global.message.themmoithanhcong' }));
		}
	};

	return (
		<Card
			title={
				edit
					? intl.formatMessage({ id: 'quanlyclb.form.chinhsua' })
					: intl.formatMessage({ id: 'quanlyclb.form.themmoi' })
			}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col xs={24} md={24}>
						<Form.Item
							name='ten'
							label={intl.formatMessage({ id: 'quanlyclb.form.ten' })}
							rules={[...rules.required, ...rules.text]}
						>
							<Input.TextArea placeholder={intl.formatMessage({ id: 'quanlyclb.form.ten.place' })} />
						</Form.Item>
					</Col>
					<Col xs={24} md={24}>
						<Form.Item
							name='logo'
							label={intl.formatMessage({ id: 'quanlyclb.form.logo' })}
							rules={[...rules.fileRequired]}
						>
							<UploadFile accept='.png, .jpeg, .jpg' isAvatarSmall maxCount={1} />
						</Form.Item>
					</Col>
					<Col xs={24} md={24}>
						<Form.Item
							name='slogan'
							label={intl.formatMessage({ id: 'quanlyclb.form.khauhieu' })}
							rules={[...rules.text]}
						>
							<Input.TextArea placeholder={intl.formatMessage({ id: 'quanlyclb.form.khauhieu.place' })} />
						</Form.Item>
					</Col>
					<Col xs={24} md={24}>
						<Form.Item
							name='mucDich'
							label={intl.formatMessage({ id: 'quanlyclb.form.mucdich' })}
							rules={[...rules.required]}
						>
							<TinyEditor height={350} stickyToolbar={false} />
						</Form.Item>
					</Col>
					<Col xs={24} md={24}>
						<Form.Item
							name='yNghia'
							label={intl.formatMessage({ id: 'quanlyclb.form.ynghia' })}
							rules={[...rules.required]}
						>
							<TinyEditor height={350} stickyToolbar={false} />
						</Form.Item>
					</Col>
					<Col xs={24} md={24}>
						<Form.Item
							name='donViQuanLy'
							label={intl.formatMessage({ id: 'quanlyclb.form.donviql' })}
							rules={[...rules.required]}
						>
							<SelectDonVi />
						</Form.Item>
					</Col>
					<Col xs={24} md={24}>
						<Form.Item
							name='noiQuyQuyChe'
							label={intl.formatMessage({ id: 'quanlyclb.form.noiquy' })}
							rules={[...rules.fileRequired]}
						>
							<UploadFile accept='.pdf, .docx, .doc' maxCount={1} />
						</Form.Item>
					</Col>
					<Col xs={24} md={24}>
						<Form.Item
							name='quyetDinhThanhLap'
							label={intl.formatMessage({ id: 'quanlyclb.form.quyetdinh' })}
							rules={[...rules.fileRequired]}
						>
							<UploadFile accept='.pdf, .docx, .doc' maxCount={1} />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit
							? `${intl.formatMessage({ id: 'global.button.themmoi' })}`
							: `${intl.formatMessage({ id: 'global.button.luulai' })}`}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormCauLacBo;
