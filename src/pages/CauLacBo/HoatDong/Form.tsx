import MyDatePicker from '@/components/MyDatePicker';
import TinyEditor from '@/components/TinyEditor';
import UploadFile from '@/components/Upload/UploadFile';
import { ETrangThaiHoatDong } from '@/services/CauLacBo/constant';
import { buildUpLoadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Radio, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormHoatDong = () => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm, getModel } =
		useModel('caulacbo.hoatdong');
	const { record: recordCLB } = useModel('caulacbo.caulacbo');
	const getData = () => {
		getModel({ idCauLacBo: recordCLB?._id });
	};
	const trangThai = Form.useWatch('trangThai', form);

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) {
			form.setFieldsValue({
				...record,
				minhChung: record.fileDinhKem[0],
			});
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		if (!recordCLB?._id) return;

		const minhChung = await buildUpLoadFile(values, 'minhChung');

		const payload = {
			...record,
			...values,
			idCauLacBo: recordCLB._id,
			fileDinhKem: minhChung ? [minhChung] : [],
			minhChung: undefined,
		};
		if (edit) {
			putModel(record?._id ?? '', payload, getData);
		} else {
			postModel(payload, getData);
		}
	};

	return (
		<Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col xs={24} md={24}>
						<Form.Item name='ten' label='Tên hoạt động' rules={[...rules.required, ...rules.text]}>
							<Input.TextArea placeholder='Tên hoạt động' />
						</Form.Item>
					</Col>
					<Col xs={24} md={24}>
						<Form.Item name='trangThai' label='Trạng thái' rules={[...rules.required]}>
							<Radio.Group options={Object.values(ETrangThaiHoatDong).map((item) => ({ value: item, label: item }))} />
						</Form.Item>
					</Col>
					{[ETrangThaiHoatDong.DA_THUC_HIEN, ETrangThaiHoatDong.HUY].includes(trangThai) && (
						<>
							<Col xs={24} md={24}>
								<Form.Item name='ghiChu' label={'Ghi chú (nếu có)'} rules={[...rules.text]}>
									<Input.TextArea placeholder='VD: Lý do hủy hoạt động' />
								</Form.Item>
							</Col>
							<Col xs={24} md={24}>
								<Form.Item
									name='minhChung'
									label='Minh chứng về việc thực hiện/hủy hoạt động'
									rules={[...rules.fileRequired]}
								>
									<UploadFile maxCount={1} />
								</Form.Item>
							</Col>
						</>
					)}
					<Col xs={24} md={24}>
						<Form.Item name='thoiGianDuKien' label='Thời gian dự kiến/Thời gian diễn ra' rules={[...rules.required]}>
							<MyDatePicker
								format={'HH:mm DD/MM/YYYY'}
								picker='time'
								showTime={{ showHour: true, showMinute: true }}
								placeholder='Chọn thời gian'
							/>
						</Form.Item>
					</Col>
					<Col xs={24} md={24}>
						<Form.Item name='noiDung' label='Nội dung chi tiết' rules={[...rules.requiredHtml]}>
							<TinyEditor height={500} />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit ? 'Thêm mới ' : 'Lưu lại'}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormHoatDong;
