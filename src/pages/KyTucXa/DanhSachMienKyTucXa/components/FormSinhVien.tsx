import UploadFile from '@/components/Upload/UploadFile';
import SelectSinhVienDebounce from '@/pages/DaoTaoV2/SinhVien/component/Select';
import { buildUpLoadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Row } from 'antd';
import React, { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

interface FormSinhVienProps {
	danhSachId?: string;
	maHocKy?: string;
	getData?: () => void;
}

const FormSinhVien: React.FC<FormSinhVienProps> = ({ danhSachId, maHocKy, getData }) => {
	const [form] = Form.useForm();
	const intl = useIntl();
	const t = (id: string) => intl.formatMessage({ id });
	const { record, visibleForm, edit, setVisibleForm, putModel, postModel, formSubmiting } =
		useModel('kytucxa.danhsachmiensinhvien');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id)
			form.setFieldsValue({
				...record,
			});
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		try {
			const fileUrl = await buildUpLoadFile(values, 'urlMinhChung');
			const payload = {
				...values,
				urlMinhChung: fileUrl || values.urlMinhChung,
				danhSachId: record?.danhSachId || danhSachId,
				maHocKy,
			};
			if (edit) {
				await putModel(record?._id ?? '', payload, getData);
			} else {
				await postModel(payload, getData);
				form.resetFields();
			}
			setVisibleForm(false);
		} catch (er) {
			console.log(er);
		}
	};

	return (
		<Form layout='vertical' onFinish={onFinish} form={form}>
			<Row gutter={[12, 0]}>
				<Col span={24}>
					<Form.Item name='code' label={t('kytucxa.danhsachmien.sinhVien')} rules={[...rules.required]}>
						<SelectSinhVienDebounce
							selectMa
							disabled={edit}
							onChange={(value, option) => {
								const rawData = option?.rawData;
								form.setFieldsValue({
									code: value,
									fullname: rawData?.ten || rawData?.hoTen || '',
									khoaSinhVien: rawData?.khoaSinhVien?.ten || rawData?.khoaSinhVien || rawData?.maKhoaSinhVien || '',
									khoaNganh:
										rawData?.khoaNganh?.ten ||
										rawData?.khoaNganh?.ma ||
										(typeof rawData?.khoaNganh === 'string' ? rawData.khoaNganh : undefined) ||
										rawData?.tenKhoaNganh ||
										rawData?.maKhoaNganh ||
										'',
									soDienThoai: rawData?.soDienThoai || rawData?.sdt || '',
									email: rawData?.email || '',
									ssoId: rawData?.ssoId || '',
								});
							}}
						/>
					</Form.Item>
				</Col>
				<Form.Item name='fullname' hidden rules={[...rules.required]} />
				<Form.Item name='khoaSinhVien' hidden rules={[...rules.required]} />
				<Form.Item name='khoaNganh' hidden />
				<Form.Item name='soDienThoai' hidden />
				<Form.Item name='email' hidden />
				<Form.Item name='ssoId' hidden />
				<Col xs={24}>
					<Form.Item
						name='urlMinhChung'
						label={t('kytucxa.danhsachmien.uploadMinhChung')}
						rules={edit ? [] : [{ required: true, message: t('kytucxa.danhsachmien.message.uploadRequired') }]}
					>
						<UploadFile maxCount={1} accept='.pdf,.png,.jpg,.jpeg,.doc,.docx' />
					</Form.Item>
				</Col>
			</Row>

			<div className='form-footer'>
				<Button onClick={() => setVisibleForm(false)} style={{ borderRadius: 6 }}>
					{t('global.button.huy')}
				</Button>
				<Button
					loading={formSubmiting}
					htmlType='submit'
					type='primary'
					style={{ backgroundColor: '#125195', borderColor: '#125195', borderRadius: 6 }}
				>
					{!edit ? t('global.button.themmoi') : t('global.button.luulai')}
				</Button>
			</div>
		</Form>
	);
};

export default FormSinhVien;
