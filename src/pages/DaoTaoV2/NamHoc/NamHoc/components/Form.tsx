import type { NamHoc } from '@/services/DaoTaoV2/NamHoc/NamHoc/typings';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Form } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import FormNamHocDetail from '../ChiTiet/FormNamHoc';

const FormNamHoc = (props: { afterAddNew: (rec: NamHoc.IRecord) => void }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setRecord, setEdit, visibleForm, setVisibleForm, edit, postFullModel, putModel, formSubmiting } =
		useModel('daotaov2.namhoc.namhoc');
	const { afterAddNew } = props;
	// const soKyChinh = Form.useWatch('soKyChinh', form) ?? 0;
	// const soKyPhu = Form.useWatch('soKyPhu', form) ?? 0;

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		if (edit) {
			putModel(record?._id ?? '', values, undefined, undefined, false)
				.then()
				.catch((er) => console.log(er));
		} else {
			const { hocKyDtoList, ...namHocDto } = values;
			postFullModel({ namHocDto, hocKyDtoList }, undefined, false)
				.then((rec) => {
					setRecord(rec);
					setEdit(true);
					if (afterAddNew) afterAddNew(rec);
				})
				.catch((er) => console.log(er));
		}
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<FormNamHocDetail form={form} />

			{/* {!edit && (soKyChinh || soKyPhu) ? (
				<>
					<Divider>Cấu hình thông tin các kỳ học</Divider>
					<Row gutter={[12, 0]}>
						<Form.List name='hocKyDtoList'>
							{() =>
								_.range(1, soKyChinh + soKyPhu + 1).map((ky, index) => (
									<Col key={ky} span={24}>
										<Row gutter={[12, 0]}>
											<Form.Item hidden name={[index, 'soThuTu']} initialValue={ky} />
											<Form.Item hidden name={[index, 'isKyChinh']} initialValue={ky <= soKyChinh} />
											<Col span={24} style={{ display: 'flex', alignItems: 'center' }}>
												<div className='fw500'>
													Kỳ {ky > soKyChinh ? 'phụ' : 'chính'} {ky > soKyChinh ? ky - soKyChinh : ky}:
												</div>
											</Col>
											<Col span={12} md={12}>
												<Form.Item
													name={[index, 'thoiGianBatDau']}
													label='Thời gian bắt đầu'
													rules={[...rules.required, ...rules.sauNgay(thoiGianBatDau, 'ngày bắt đầu năm học')]}
												>
													<MyDatePicker disabledDate={(cur) => dayjs(cur).isBefore(thoiGianBatDau, 'd')} />
												</Form.Item>
											</Col>
											<Col span={12} md={12}>
												<Form.Item
													name={[index, 'soTuan']}
													label='Số tuần dự kiến'
													rules={[...rules.required, ...rules.number(50, 1, false)]}
												>
													<InputNumber placeholder='Số tuần' min={1} max={50} style={{ width: '100%' }} />
												</Form.Item>
											</Col>
										</Row>
									</Col>
								))
							}
						</Form.List>
					</Row>
				</>
			) : null} */}

			<div className='form-footer'>
				<Button loading={formSubmiting} htmlType='submit' type='primary'>
					{!edit
						? `${intl.formatMessage({ id: 'global.button.themmoi' })}`
						: `${intl.formatMessage({ id: 'global.button.luulai' })}`}
				</Button>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>
		</Form>
	);
};

export default FormNamHoc;
