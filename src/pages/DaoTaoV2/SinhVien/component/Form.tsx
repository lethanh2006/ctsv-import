import { exportLyLich } from '@/services/DaoTaoV2/SinhVien';
import { type SinhVien } from '@/services/DaoTaoV2/SinhVien/typings';
import { buildUpLoadFile } from '@/services/uploadFile';
import { resetFieldsForm } from '@/utils/utils';
import { PrinterOutlined } from '@ant-design/icons';
import { Button, Form } from 'antd';
import fileDownload from 'js-file-download';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import FormContentSinhVien from './FormContent';
// import FormContentSinhVien from './FormContent';

const FormSinhVien = (props: {
	afterAddNew?: (rec: SinhVien.IRecord) => void;
	disabledForm?: boolean;
	dotNhapHocId?: string;
	getData?: () => void;
}) => {
	const intl = useIntl();
	const { record, edit, postModel, putModel, formSubmiting, setRecord, setEdit, setFormSubmiting, visibleForm } =
		useModel('daotaov2.sinhvien.sinhvien');
	const { afterAddNew, disabledForm, dotNhapHocId, getData } = props;
	const [form] = Form.useForm();

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: SinhVien.IRecord) => {
		setFormSubmiting(true);
		const url = await buildUpLoadFile(values, 'anhDaiDienUrl');
		values.anhDaiDienUrl = url;
		setFormSubmiting(false);
		values.dotNhapHocId = dotNhapHocId || null;
		values.ten = values?.ten ?? [values?.lastName, values?.firstName].filter(Boolean).join(' ');

		if (edit) {
			putModel(record?._id ?? '', values, undefined, undefined, false)
				.then(() => {
					if (getData) getData();
				})
				.catch((er) => console.log(er));
		} else
			postModel(values, undefined, false)
				.then((rec) => {
					setRecord(rec);
					setEdit(true);
					if (afterAddNew) afterAddNew(rec);
					if (getData) getData();
				})
				.catch((er) => console.log(er));
	};

	const onExport = () => {
		if (record?.ssoId) {
			if (formSubmiting) return;
			setFormSubmiting(true);

			exportLyLich(record?.ssoId)
				.then((res) =>
					fileDownload(
						res.data,
						`${intl.formatMessage({ id: 'sinhvien.preview.hoso.filename' }, { ten: record.ten })}.pdf`,
					),
				)
				.finally(() => setFormSubmiting(false));
		}
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical' disabled={disabledForm}>
			{!disabledForm ? (
				<div className='button-section'>
					{/* <Button
						loading={formSubmiting}
						htmlType='submit'
						type='primary'
						icon={edit ? <SaveOutlined /> : <PlusOutlined />}
					>
						{!edit ? (
							<>{intl.formatMessage({ id: 'sinhvien.button.themmoitieptuc' })}</>
						) : (
							<>{intl.formatMessage({ id: 'sinhvien.button.luulai' })}</>
						)}
					</Button> */}

					{edit ? (
						<Button icon={<PrinterOutlined />} onClick={onExport} loading={formSubmiting}>
							{intl.formatMessage({ id: 'sinhvien.button.inhoso' })}
						</Button>
					) : null}
				</div>
			) : null}

			<FormContentSinhVien form={form} />
		</Form>
	);
};

export default FormSinhVien;
