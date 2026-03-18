import MyDatePicker from '@/components/MyDatePicker';
import SelectNhomTietHoc from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/NhomTietHoc/components/SelectNhomTietHoc';
import SelectNamHoc from '@/pages/DaoTaoV2/NamHoc/NamHoc/components/Select';
import { postHocKyValidate, putHocKyValidate } from '@/services/DaoTaoV2/HocKy/HocKy';
import { type HocKy } from '@/services/DaoTaoV2/HocKy/HocKy/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Checkbox, Col, Form, Input, InputNumber, Modal, Row, Space, Switch } from 'antd';
import _ from 'lodash';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormHocKy = (props: { fromNamHoc?: boolean; afterAddNew: (rec: HocKy.IRecord) => void }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { fromNamHoc, afterAddNew } = props;
	const {
		record,
		visibleForm,
		setVisibleForm,
		edit,
		postModel,
		putModel,
		getModel,
		formSubmiting,
		getAllService,
		setFormSubmiting,
		setRecord,
		setEdit,
	} = useModel('daotaov2.hocky.hocky');
	const { record: recNamHoc, setRecord: setNam, danhSach: danhSachNam } = useModel('daotaov2.namhoc.namhoc');
	const thuTuKy = Form.useWatch('soThuTu', form);

	//#region Functions

	// Thay đổi năm học => Gợi ý thứ tự kỳ tiếp theo
	const onChangeNamHoc = (id?: string) => {
		getAllService({ condition: { namHocId: id } }).then((res) => {
			const soThuTu = (_.maxBy(res.data?.data, (item: HocKy.IRecord) => item.soThuTu)?.soThuTu ?? 0) + 1;
			form.setFieldsValue({ soThuTu });
		});
		form.setFieldsValue({ namHoc: recNamHoc });
		// form.validateFields(['thoiGianBatDau']);
	};

	const getData = () => getModel(fromNamHoc ? { namHocId: recNamHoc?._id } : undefined);
	//#endregion

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form, { namHoc: recNamHoc, namHocId: recNamHoc?._id });
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	// Tự động điền tên kỳ học khi thay đổi năm học, thứ tự kỳ
	useEffect(() => {
		// const inputName = form.getFieldValue('ten');
		//&& !record?.ten && !inputName
		if (!edit && recNamHoc?.ten && thuTuKy) {
			const ten = `Học kỳ ${thuTuKy} ${recNamHoc.ten}`;
			form.setFieldsValue({ ten });
		}
	}, [recNamHoc?.ten, thuTuKy]);

	useEffect(() => {
		if (!edit && recNamHoc?._id && visibleForm) {
			form.setFieldsValue({ namHocId: recNamHoc._id });
			onChangeNamHoc(recNamHoc._id);
		}
	}, [recNamHoc?._id, visibleForm]);

	const doPostModel = (values: HocKy.IRecord) =>
		postModel(values, getData, false)
			.then((rec) => {
				setRecord(rec);
				setEdit(true);
				if (afterAddNew) afterAddNew(rec);
			})
			.catch((er) => console.log(er));

	const doPutModel = (values: HocKy.IRecord) =>
		putModel(record?._id ?? '', values, getData, undefined, false)
			.then()
			.catch((er) => console.log(er));

	const onFinish = async (values: HocKy.IRecord) => {
		// validate trước khi thêm mới hoặc chỉnh sửa
		if (edit) {
			setFormSubmiting(true);
			const res = await putHocKyValidate({ ...values, _id: record?._id ?? '' })
				.then()
				.finally(() => setFormSubmiting(false));
			if (res.data?.data) doPutModel(values);
			else
				Modal.confirm({
					title: 'Bạn có chắc muốn chỉnh sửa kỳ học này?',
					content: 'Lưu ý: Việc chỉnh sửa Kỳ học này sẽ ảnh hưởng tới các thông tin khác',
					onOk: () => doPutModel(values),
				});
		} else {
			values.namHocId = fromNamHoc ? recNamHoc?._id ?? '' : values.namHocId;
			setFormSubmiting(true);
			const res = await postHocKyValidate(values)
				.then()
				.finally(() => setFormSubmiting(false));
			if (res.data?.data) doPostModel(values);
			else
				Modal.confirm({
					title: 'Bạn có chắc muốn thêm mới kỳ học này?',
					content: 'Lưu ý: Việc thêm mới Kỳ học này sẽ ảnh hưởng tới các thông tin khác',
					onOk: () => doPostModel(values),
				});
		}
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]}>
				{!fromNamHoc ? (
					<Col span={24} md={8}>
						<Form.Item name='namHocId' label='Năm học' rules={[...rules.required]}>
							<SelectNamHoc onChange={(val) => setNam(danhSachNam.find((item) => item._id === val))} disabled={edit} />
						</Form.Item>
					</Col>
				) : null}

				{/* <Col span={24} md={8}>
						<Form.Item label='Trình độ đào tạo' name='maTrinhDoDaoTao' rules={[...rules.required]}>
							<SelectTrinhDo selectMa />
						</Form.Item>
					</Col>
					<Col span={24} md={8}>
						<Form.Item label='Hình thức đào tạo' name='maHinhThucDaoTao' rules={[...rules.required]}>
							<SelectHinhThuc selectMa />
						</Form.Item>
					</Col> */}
				<Col span={12} md={8}>
					<Form.Item
						name='soThuTu'
						label='Thứ tự kỳ trong năm'
						rules={[...rules.required, ...rules.number(5, 1, false)]}
					>
						<InputNumber placeholder='Số thứ tự' min={1} max={5} style={{ width: '100%' }} />
					</Form.Item>
				</Col>

				<Col span={24} md={8}>
					<Form.Item name='ten' label='Tên kỳ học' rules={[...rules.required, ...rules.text, ...rules.length(250)]}>
						<Input placeholder='Nhập tên kỳ học' />
					</Form.Item>
				</Col>

				<Col span={24} md={8}>
					<Form.Item
						name='thoiGianBatDau'
						label='Thời gian bắt đầu'
						rules={[
							...rules.required,
							...rules.sauNgay(
								edit ? record?.namHoc?.thoiGianBatDau : recNamHoc?.thoiGianBatDau,
								'ngày bắt đầu năm học',
							),
						]}
					>
						<MyDatePicker
							disabledDate={(cur) =>
								dayjs(cur).isBefore(edit ? record?.namHoc?.thoiGianBatDau : recNamHoc?.thoiGianBatDau, 'd')
							}
							// disabled={edit}
						/>
					</Form.Item>
				</Col>

				<Col span={24} md={8}>
					<Form.Item name='soTuan' label='Số tuần' rules={[...rules.required, ...rules.number(50, 1, false)]}>
						<InputNumber placeholder='Số tuần' min={1} max={50} style={{ width: '100%' }} />
					</Form.Item>
				</Col>
				{/* <Col span={24} md={8}>
            <Form.Item
              label="Sĩ số lớp tín chỉ tối đa dự kiến"
              name="sySoDuKienBatBuoc"
              rules={[...rules.required, ...rules.number(200, 1, false)]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={1}
                max={200}
                step={1}
                placeholder="Nhập số sinh viên"
              />
            </Form.Item>
          </Col> */}
				<Col span={24} md={8}>
					<Form.Item label='Nhóm tiết học' name='maNhomTietHoc'>
						<SelectNhomTietHoc hasDefault selectMa />
					</Form.Item>
				</Col>
			</Row>

			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<Col span={24} md={8}>
					<Form.Item name='isKyChinh' valuePropName='checked'>
						<Checkbox>Là kỳ chính</Checkbox>
					</Form.Item>
				</Col>
				<Col span={24} md={8}>
					<Form.Item name='isToChucDangKyNhuCau' valuePropName='checked'>
						<Checkbox>Tổ chức đăng ký nhu cầu</Checkbox>
					</Form.Item>
				</Col>
				<Col span={24} md={8}>
					<Space style={{ height: 32 }}>
						<Form.Item name='active' valuePropName='checked' noStyle>
							<Switch size='small' />
						</Form.Item>
						Hoạt động
					</Space>
				</Col>
			</Row>

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

export default FormHocKy;
