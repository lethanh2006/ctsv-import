import MyDatePicker from '@/components/MyDatePicker';
import type { TheChat } from '@/services/TienIch/TheChat/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import SelectDanhMucTheChat from '../../DanhMuc/components/Select';
import FormItemKhoaNganhTheChat from '../KhoaNganh/FormItem';
import SelectHocKy from '@/pages/DaoTaoV2/HocKy/HocKy/components/SelectHocKy';
import moment from 'moment';

const FormDotTheChat = (props: { afterAddNew?: (rec: TheChat.IDotDanhGiaTheChat) => void; getData?: () => void }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { afterAddNew, getData } = props;
	const { initialState } = useModel('@@initialState');
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { record, setRecord, setVisibleForm, edit, setEdit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('tienich.thechat.dot');
	const thoiGianBatDau = Form.useWatch('thoiGianBatDau', form);

	const fullName = initialState?.currentUser?.family_name
		? `${initialState?.currentUser.family_name} ${initialState?.currentUser?.given_name ?? ''}`
		: initialState?.currentUser?.name ?? initialState?.currentUser?.preferred_username ?? '';

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
			return;
		}

		if (record?._id) {
			form.setFieldsValue({
				...record,
				danhMucTheChat: record.danhMucTheChat?.map((i) => i.maDanhMuc),
				danhSachKhoaNganh: record.danhSachKhoaNganh,
			});
		} else {
			form.setFieldsValue({
				maHocKy: recHocKy?.ma,
			});
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		const randomCode = Math.floor(100000 + Math.random() * 900000).toString();

		const payload: TheChat.IDotDanhGiaTheChat = {
			...values,
			ma: randomCode,
			danhMucTheChat: values.danhMucTheChat?.map((maDanhMuc: string) => ({ maDanhMuc })) ?? [],
			danhSachKhoaNganh: values?.danhSachKhoaNganh ?? [],
			nguoiTaosoId: record?.nguoiTaosoId ?? initialState?.currentUser?.ssoId ?? '',
			tenNguoiTao: record?.tenNguoiTao ?? fullName ?? '',
		};

		if (edit) {
			await putModel(record?._id ?? '', payload, getData, undefined, false).catch((er) => console.log(er));
		} else {
			await postModel(payload, getData, false)
				.then((rec) => {
					setRecord(rec);
					setEdit(true);
					afterAddNew?.(rec);
				})
				.catch((er) => console.log(er));
		}
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<Col span={24} md={12}>
					<Form.Item name='maHocKy' label='Học kỳ' rules={[...rules.required]}>
						<SelectHocKy selectMa />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item name='tenDot' label='Tên đợt' rules={[...rules.required, ...rules.text, ...rules.length(250)]}>
						<Input placeholder='Nhập tên đợt' />
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item name='danhMucTheChat' label='Danh sách tiêu chí' rules={[...rules.required]}>
						<SelectDanhMucTheChat selectMa multiple />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item name='thoiGianBatDau' label='Thời gian bắt đầu' rules={[...rules.required]}>
						<MyDatePicker showTime={{ showHour: true, showMinute: true }} format='HH:mm DD/MM/YYYY' />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item
						name='thoiGianKetThuc'
						label='Thời gian kết thúc'
						rules={[...rules.required, ...rules.sauNgay(moment(thoiGianBatDau))]}
					>
						<MyDatePicker
							showTime={{ showHour: true, showMinute: true }}
							format='HH:mm DD/MM/YYYY'
							disabledDate={(cur) => (thoiGianBatDau ? moment(cur).isBefore(thoiGianBatDau, 'd') : false)}
						/>
					</Form.Item>
				</Col>
				{/* ✅ danhSachKhoaNganh giờ chỉ là mảng [{maKhoaNganh, tenKhoaNganh}] */}
				<Col xs={24}>
					<Form.Item name='danhSachKhoaNganh' label={<div className='fw500'>Danh sách khóa ngành áp dụng</div>}>
						<FormItemKhoaNganhTheChat />
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item name='moTa' label='Ghi chú'>
						<Input.TextArea rows={2} placeholder='Nhập ghi chú' />
					</Form.Item>
				</Col>
			</Row>

			<div className='form-footer'>
				<Button loading={formSubmiting} htmlType='submit' type='primary'>
					{!edit
						? intl.formatMessage({ id: 'global.button.themmoi' })
						: intl.formatMessage({ id: 'global.button.luulai' })}
				</Button>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>
		</Form>
	);
};

export default FormDotTheChat;
