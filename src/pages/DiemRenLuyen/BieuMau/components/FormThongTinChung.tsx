import { ELoaiBieuMau, ELoaiDoiTuong } from '@/services/KhaoSat/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Form, Input, Switch } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

const FormThongTinChungKhaoSat = (props: { afterAddNew?: () => void }) => {
	const [form] = Form.useForm();
	const { formSubmiting, record, setRecord, setVisibleForm, visibleForm } = useModel('khaosat.bieumau');
	const [camKet, setCamKet] = useState<boolean | undefined>(record?.coCamKet);
	const intl = useIntl();

	const onFinish = async (values: any) => {
		setRecord({
			...record,
			...values,
			doiTuong: ELoaiDoiTuong.TAT_CA,
			loai: ELoaiBieuMau.CHAM_DIEM_REN_LUYEN,
		});
		if (props.afterAddNew) props.afterAddNew();
	};

	useEffect(() => {
		if (visibleForm) {
			form.setFieldsValue({ ...record, loai: record?.loai ?? ELoaiBieuMau.KHAO_SAT });
		} else {
			resetFieldsForm(form, { loai: ELoaiBieuMau.KHAO_SAT });
		}
	}, [visibleForm, record]);

	return (
		<Form layout='vertical' onFinish={onFinish} form={form}>
			{/*<Form.Item*/}
			{/*	name='loai'*/}
			{/*	label='Loại biểu mẫu'*/}
			{/*	rules={[...rules.required, ...rules.text, ...rules.length(250)]}*/}
			{/*	initialValue={record?.loai}*/}
			{/*>*/}
			{/*	<Select options={Object.values(ELoaiBieuMau).map((item) => ({ value: item, key: item, label: item }))} />*/}
			{/*</Form.Item>*/}
			<Form.Item
				name='tieuDe'
				label={intl.formatMessage({ id: 'bieumau.column.tieude' })}
				rules={[...rules.required, ...rules.text, ...rules.length(250)]}
				initialValue={record?.tieuDe}
			>
				<Input placeholder={intl.formatMessage({ id: 'bieumau.title.nhaptieude' })} />
			</Form.Item>
			<Form.Item
				name='moTa'
				label={intl.formatMessage({ id: 'bieumau.column.mota' })}
				rules={[...rules.length(2000)]}
				initialValue={record?.moTa}
			>
				<Input.TextArea rows={3} placeholder={intl.formatMessage({ id: 'bieumau.title.nhapmota' })} />
			</Form.Item>

			<Form.Item
				name='coCamKet'
				label={intl.formatMessage({ id: 'bieumau.cocamket' })}
				initialValue={record?.coCamKet}
				valuePropName='checked'
			>
				<Switch onChange={(val) => setCamKet(val)} />
			</Form.Item>

			{camKet && (
				<Form.Item
					rules={[...rules.required]}
					name='noiDungCamKet'
					label={intl.formatMessage({ id: 'bieumau.noidungcamket' })}
					initialValue={record?.noiDungCamKet}
				>
					<Input placeholder={intl.formatMessage({ id: 'bieumau.noidungcamket' })} />
				</Form.Item>
			)}

			<div className='form-footer'>
				<Button loading={formSubmiting} htmlType='submit' type='primary'>
					{intl.formatMessage({ id: 'global.button.tieptheo' })}
				</Button>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>
		</Form>
	);
};

export default FormThongTinChungKhaoSat;
