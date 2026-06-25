import UploadFile from '@/components/Upload/UploadFile';
import SelectSinhVienDebounce from '@/pages/DaoTaoV2/SinhVien/component/Select';
import { buildUpLoadFile } from '@/services/uploadFile';
import { ipCsvc } from '@/utils/ip';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormSinhVienMienKTX = (props: any) => {
	const { getData } = props;
	const [form] = Form.useForm();
	const intl = useIntl();
	const t = (id: string) => intl.formatMessage({ id });
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { record, visibleForm, edit, setVisibleForm, putModel, postModel, formSubmiting } =
		useModel('kytucxa.danhsachmienkytucxa');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: Partial<DanhSachMienKTX.IRecord>) => {
		try {
			const fileUrl = await buildUpLoadFile(values, 'urlMinhChung', undefined, undefined, ipCsvc);
			const payload = {
				...values,
				urlMinhChung: fileUrl || values.urlMinhChung,
				maHocKy: recHocKy?.ma,
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
					<Form.Item name='ssoId' label={t('kytucxa.danhsachmien.sinhVien')} rules={[...rules.required]}>
						<SelectSinhVienDebounce
							disabled={edit}
							onChange={(value, option) => {
								const rawData = option?.rawData;
								form.setFieldsValue({
									ssoId: value,
									maSinhVien: rawData?.ma || rawData?.maSinhVien || '',
									hoTen: rawData?.ten || rawData?.hoTen || '',
									khoaSinhVien: rawData?.khoaSinhVien?.ten || rawData?.maKhoaSinhVien || '',
									maKhoa: rawData?.maKhoaSinhVien || rawData?.khoaSinhVien?.ma || '',
									tenKhoa: rawData?.khoaSinhVien?.ten || '',
									maNganh: rawData?.maNganh || rawData?.nganh?.ma || '',
									tenNganh: rawData?.nganh?.ten || rawData?.tenNganh || '',
									soDienThoai: rawData?.soDienThoai || rawData?.sdt || '',
									email: rawData?.email || '',
								});
							}}
						/>
					</Form.Item>
				</Col>
				<Form.Item name='maSinhVien' hidden rules={[...rules.required]} />
				<Form.Item name='hoTen' hidden rules={[...rules.required]} />
				<Form.Item name='khoaSinhVien' hidden />
				<Form.Item name='maKhoa' hidden />
				<Form.Item name='tenKhoa' hidden />
				<Form.Item name='maNganh' hidden />
				<Form.Item name='tenNganh' hidden />
				<Form.Item name='soDienThoai' hidden />
				<Form.Item name='email' hidden />
				<Col xs={24}>
					<Form.Item
						name='urlMinhChung'
						label={t('kytucxa.danhsachmien.uploadMinhChung')}
						rules={edit ? [] : [{ required: true, message: t('kytucxa.danhsachmien.message.uploadRequired') }]}
					>
						<UploadFile maxCount={1} accept='.pdf,.png,.jpg,.jpeg,.doc,.docx' />
					</Form.Item>
				</Col>
				<Col xs={24}>
					<Form.Item name='ghiChuDuyet' label={t('kytucxa.danhsachmien.ghiChuDuyet')}>
						<Input.TextArea rows={3} placeholder={t('kytucxa.danhsachmien.nhapGhiChuDuyet')} />
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

export default FormSinhVienMienKTX;
