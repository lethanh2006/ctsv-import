import MyDatePicker from '@/components/MyDatePicker';
import SelectNamHoc from '@/pages/DaoTaoV2/NamHoc/NamHoc/components/Select';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Form, Input } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormDotRaSoat = (props: { title?: string; [key: string]: any }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } = useModel(
		'daotaov2.chuongtrinhdaotao.dotrasoat',
	);
	const { title = '' } = props;
	const thoiGianBatDau = Form.useWatch('thoiGianBatDau', form);

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		if (edit) {
			putModel(record?._id ?? '', values)
				.then()
				.catch((er) => console.log(er));
		} else {
			postModel(values)
				.then()
				.catch((er) => console.log(er));
		}
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item name='maNamHoc' label='Năm học' rules={[...rules.required]}>
					<SelectNamHoc selectMa />
				</Form.Item>
				<Form.Item name='ten' label='Tên đợt rà soát' rules={[...rules.required, ...rules.text, ...rules.length(200)]}>
					<Input placeholder='Nhập tên đợt rà soát' />
				</Form.Item>

				<Form.Item name='thoiGianBatDau' label='Thời gian bắt đầu' rules={[...rules.required]}>
					<MyDatePicker />
				</Form.Item>
				<Form.Item
					name='thoiGianKetThuc'
					label='Thời gian kết thúc'
					rules={[...rules.required, ...rules.sauNgay(thoiGianBatDau, 'Thời gian bắt đầu')]}
				>
					<MyDatePicker disabledDate={(cur) => dayjs(cur).isBefore(thoiGianBatDau)} />
				</Form.Item>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit
							? `${intl.formatMessage({ id: 'global.button.themmoi' })}`
							: `${intl.formatMessage({ id: 'global.button.luulai' })}`}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormDotRaSoat;
