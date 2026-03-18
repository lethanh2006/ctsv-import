import FormQuyetDinh from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/QuyetDinh/components/Form';
import { ELoaiQuyetDinh } from '@/services/DaoTaoV2/DanhMucHeThong/constant';
import { ETrangThaiSinhVienDot } from '@/services/DaoTaoV2/constant';
import { buildUpLoadFile } from '@/services/uploadFile';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Row } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import FormTableSinhVien from './FormTableSV';

const FormQuyetDinhSinhVien = (props: {
	isThoiHoc?: boolean;
	getData?: () => void;
	title?: string;
	[key: string]: any;
}) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { isThoiHoc, getData, title } = props;
	const {
		postManySinhVienQuyetDinhModel,
		duyetQuyetDinhModel,
		formSubmiting,
		setFormSubmiting,
		setSelectedIds,
		visibleForm,
		setVisibleForm,
		selectedIds,
	} = useModel(isThoiHoc ? 'quyetdinh.thoihoc' : 'quyetdinh.baoluu');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else form.setFieldsValue({ quyetDinh: { loai: isThoiHoc ? ELoaiQuyetDinh.THOI_HOC : ELoaiQuyetDinh.BAO_LUU } });
	}, [visibleForm]);

	const onFinish = async (values: any) => {
		if (!!values.quyetDinh.url && typeof values.quyetDinh.url !== 'string') {
			setFormSubmiting(true);
			await buildUpLoadFile(values.quyetDinh, 'url')
				.then((url) => (values.quyetDinh.url = url))
				.catch(() => (values.quyetDinh.url = null))
				.finally(() => setFormSubmiting(false));
		}

		const data = {
			...values,
			quyetDinh: {
				...values.quyetDinh,
				ngayBanHanh: dayjs(values.quyetDinh.ngayBanHanh).startOf('D'),
			},
			trangThai: ETrangThaiSinhVienDot.DA_RA_QUYET_DINH,
		};

		if (selectedIds?.length)
			duyetQuyetDinhModel(data)
				.then(() => {
					if (getData) getData();
					setVisibleForm(false);
				})
				.catch((er) => console.log(er));
		else
			postManySinhVienQuyetDinhModel(data)
				.then(() => {
					if (getData) getData();
					setVisibleForm(false);
					setSelectedIds([]);
				})
				.catch((er) => console.log(er));
	};

	return (
		<Card title={`Ra quyết định ${title ?? ''}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<FormQuyetDinh isSinhVien />

					<Col xs={24} md={24}>
						<FormTableSinhVien form={form} isThoiHoc={isThoiHoc ?? false} />
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						Xác nhận
					</Button>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormQuyetDinhSinhVien;
