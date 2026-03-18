import FormQuyetDinh from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/QuyetDinh/components/Form';
import { ELoaiQuyetDinh } from '@/services/DaoTaoV2/DanhMucHeThong/constant';
import type { DotQuyDoiDiem } from '@/services/DaoTaoV2/KetQuaHocTap/DotQuyDoiDiem/typing';
import { buildUpLoadFile } from '@/services/uploadFile';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Modal, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import TableSVQuyDoi from './TableSVQuyDoi';

const ModalQuyetDinhQuyDoiDiem = (props: {
	visibleForm: boolean;
	setVisibleForm: (val: boolean) => void;
	getData?: () => void;
}) => {
	const { getData, visibleForm, setVisibleForm } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record: recDot } = useModel('daotaov2.ketquahoctap.quydoidiem.dotquydoidiem');
	const { formSubmiting, setFormSubmiting, raQuyetDinhQuyDoiDiemModel, selectedIds, danhSach, setSelectedIds } =
		useModel('daotaov2.ketquahoctap.quydoidiem.quydoidiemsinhvien');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else form.setFieldsValue({ quyetDinh: { loai: ELoaiQuyetDinh.QUY_DOI_DIEM } });
	}, [visibleForm]);

	const onFinish = async (values: DotQuyDoiDiem.TRaQuyetDinhQuyDoiDiem) => {
		if (!!values.quyetDinh.url && typeof values.quyetDinh.url !== 'string') {
			setFormSubmiting(true);
			await buildUpLoadFile(values.quyetDinh, 'url')
				.then((url) => (values.quyetDinh.url = url))
				.catch(() => (values.quyetDinh.url = null))
				.finally(() => setFormSubmiting(false));
		}

		const sinhVien = danhSach?.filter((item) => selectedIds?.includes(item._id));

		const data = {
			...values,
			danhSachSinhVien: sinhVien.map((item) => ({
				sinhVienSsoId: item.sinhVienSsoId,
				maHocPhan: item.maHocPhan,
			})),
		};

		raQuyetDinhQuyDoiDiemModel(recDot?._id ?? '', data)
			.then(() => {
				if (getData) getData();
				setVisibleForm(false);
				setSelectedIds([]);
			})
			.catch((er) => console.log(er));
	};

	return (
		<Modal
			title='Ra quyết định quy đổi điểm'
			width={1000}
			open={visibleForm}
			onCancel={() => setVisibleForm(false)}
			footer={null}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<FormQuyetDinh isSinhVien />

					<Col xs={24} md={24}>
						<TableSVQuyDoi />
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						Xác nhận
					</Button>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalQuyetDinhQuyDoiDiem;
