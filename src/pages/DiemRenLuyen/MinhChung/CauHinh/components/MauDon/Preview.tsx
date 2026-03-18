import { Card, Col, Form, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import FormRender from './FormRender';
// import TableThanhVien from './TableThanhVien';
import { LoaiHinh } from '@/services/FormDong/LoaiHinh/typing';
import { buildUpLoadMultiFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import dayjs from 'dayjs';

const PreviewForm = (props: { isView?: boolean; getData: any; mode: 'quytrinh' | 'loaihinh' }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record: recordLoaiHinh } = useModel('formdong.loaihinh');
	const { record } = useModel('diemrenluyen.minhchung.cauhinh');
	const { recordQuyTrinhForm, visibleForm, edit } = useModel('quytrinh.quanlyquytrinh');

	const [formValues, setFormValues] = useState<any>({
		...recordQuyTrinhForm,
		...recordQuyTrinhForm?.thongTinKhaiBao,
		vaiTro: recordQuyTrinhForm?.nguoiKhaiBao?.danhSachVaiTro,
		thoiGian: [dayjs(recordQuyTrinhForm?.thongTinThoiGian?.start), dayjs(recordQuyTrinhForm?.thongTinThoiGian?.end)],
	});

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (recordQuyTrinhForm?._id)
			form.setFieldsValue({
				...recordQuyTrinhForm,
				...recordQuyTrinhForm?.thongTinKhaiBao,
				vaiTro: recordQuyTrinhForm?.nguoiKhaiBao?.danhSachVaiTro,
				thoiGian: [
					dayjs(recordQuyTrinhForm?.thongTinThoiGian?.start),
					dayjs(recordQuyTrinhForm?.thongTinThoiGian?.end),
				],
			});
	}, [recordQuyTrinhForm?._id, visibleForm]);

	const handleFinish = async () => {
		for (const item in formValues) {
			const value = formValues[item];
			if (value?.fileList?.length) {
				formValues[item] = await buildUpLoadMultiFile(formValues, item);
			}
		}
	};

	return (
		<Card
			title={
				props.mode === 'loaihinh'
					? `${
							!edit
								? intl.formatMessage({ id: 'global.button.themmoi' })
								: intl.formatMessage({ id: 'global.button.chinhsua' })
						} ${record?.ten}`
					: record?.tenMinhChung
			}
		>
			<Form
				labelCol={{ span: 24 }}
				form={form}
				onValuesChange={(changedValues, values) => {
					setFormValues(values);
				}}
				onFinish={async (values) => {
					if (!record) return;
					const isTrung = false;
					if (record.searchKey1) {
						// isTrung = await searchSanPhamModel(values?.[record.searchKey1], recordQuyTrinhForm?._id ?? '');
					}
					if (isTrung) return;
					handleFinish();
				}}
			>
				<Row gutter={[12, 0]}>
					{record?.isDanhMucDiemQuyDoi && (
						<Col span={24}>
							<Form.Item
								name={'diemQuyDoi'}
								label={record?.tenDanhMucQuyDoi ?? intl.formatMessage({ id: 'minhchung.khaibao.hangmuc' })}
								rules={[...rules.required]}
							>
								<Select
									placeholder={record?.tenDanhMucQuyDoi ?? intl.formatMessage({ id: 'minhchung.khaibao.chonhangmuc' })}
									options={record?.danhMucDiemQuyDoi?.map((val) => ({
										value: val?.diemQuyDoi,
										label: `${val?.tieuDe}`,
									}))}
								/>
							</Form.Item>
						</Col>
					)}
					{recordLoaiHinh?.cauHinhLoaiHinh?.map((item: LoaiHinh.TruongThongTin | LoaiHinh.Cot) => (
						<FormRender form={form} formValues={formValues} key={item.ma} cauHinh={item} />
					))}
				</Row>
			</Form>
		</Card>
	);
};

export default PreviewForm;
