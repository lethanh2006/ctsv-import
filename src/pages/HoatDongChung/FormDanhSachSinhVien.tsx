import { TrangThaiThamGia } from '@/services/HoatDongChung/constants';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Form } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import SelectSinhVienDebounce from '../DaoTaoV2/SinhVien/component/Select';

const FormDanhSachSinhVien = (props: { getData: any; hoatDongCtsvId: string; trangThai: string }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, formSubmiting, visibleForm } = useModel('danhsachsinhvienhoatdong');

	const { danhSach: danhSachSinhVien } = useModel('daotaov2.sinhvien.sinhvien');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
	}, [record?._id, visibleForm]);
	const onFinish = async (values: any) => {
		const recSinhVien = danhSachSinhVien.find((item) => item.ssoId === values?.ssoId);
		const payload = {
			...values,
			ma: recSinhVien?.ma,
			ten: recSinhVien?.ten,
			maNganh: recSinhVien?.nganh?.ma,
			tenNganh: recSinhVien?.nganh?.ten,
			hoatDongCtsvId: props.hoatDongCtsvId,
			trangThaiThamGia: props.trangThai === 'tham-gia' ? TrangThaiThamGia.THAM_GIA : undefined,
		};
		postModel(payload, props.getData, undefined, intl.formatMessage({ id: 'global.message.themmoithanhcong' }));
	};

	return (
		<Card
			title={
				edit
					? intl.formatMessage({ id: 'tuansinhhoatcongdan.dssv.form.chinhsua' })
					: intl.formatMessage({ id: 'tuansinhhoatcongdan.dssv.form.themmoi' })
			}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item
					name='ssoId'
					label={intl.formatMessage({ id: 'tuansinhhoatcongdan.dssv.form.sinhvien' })}
					rules={[...rules.required]}
				>
					<SelectSinhVienDebounce />
				</Form.Item>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{intl.formatMessage({ id: 'global.button.themmoi' })}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormDanhSachSinhVien;
