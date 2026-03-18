import UploadFile from '@/components/Upload/UploadFile';
import { type DotXetHocVu } from '@/services/DaoTaoV2/KetQuaHocTap/DotXetHocVu/typing';
import { buildUpLoadMultiFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Form, Input } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormTaiLieuHocVu = (props: any) => {
	const intl = useIntl();
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { postModel, putModel, getModel, visibleForm, setVisibleForm, record, edit, formSubmiting, setFormSubmiting } =
		useModel('daotaov2.ketquahoctap.xethocvu.tailieuhocvu');
	const [form] = Form.useForm();
	const { title } = props;

	const getData = () => getModel({ maHocKy: recHocKy?.ma });

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: DotXetHocVu.ITaiLieu) => {
		setFormSubmiting(true);
		const urlTaiLieu = await buildUpLoadMultiFile(values, 'urls');
		const data = {
			...values,
			maHocKy: recHocKy?.ma,
			urls: urlTaiLieu ?? [],
		};
		setFormSubmiting(false);

		if (edit) {
			putModel(record?._id ?? '', data, getData)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(data, getData)
				.then()
				.catch((er) => console.log(er));
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<div style={{ marginBottom: 12 }}>
					<Form.Item label='Tên tài liệu' name='ten' rules={[...rules.required, ...rules.text, ...rules.length(500)]}>
						<Input placeholder='Nhập tên tài liệu' />
					</Form.Item>
					<Form.Item label='Tệp tin' name='urls' rules={[...rules.required, ...rules.fileRequired]}>
						<UploadFile maxCount={5} />
					</Form.Item>
				</div>

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

export default FormTaiLieuHocVu;
