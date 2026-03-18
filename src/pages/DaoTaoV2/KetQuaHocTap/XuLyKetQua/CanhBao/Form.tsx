import SelectSinhVienDebounce from '@/pages/DaoTaoV2/SinhVien/component/Select';
import { type XetHocVu } from '@/services/DaoTaoV2/KetQuaHocTap/XetHocVu/typing';
import { ELoaiThoiHoc } from '@/services/DaoTaoV2/KetQuaHocTap/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormCanhBaoHocTap = (props: any) => {
	const { title, isThoiHoc } = props;
	const intl = useIntl();
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm, getModel } = useModel(
		isThoiHoc ? 'daotaov2.ketquahoctap.xethocvu.thoihoc' : 'daotaov2.ketquahoctap.xethocvu.canhbao',
	);
	const [form] = Form.useForm();

	const getData = () => getModel({ maHocKy: recHocKy?.ma });

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: XetHocVu.IRecord) => {
		if (edit) {
			putModel(record?._id ?? '', values, getData)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel({ ...values, maHocKy: recHocKy?.ma ?? '' }, getData)
				.then()
				.catch((er) => console.log(er));
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col span={24}>
						<Form.Item label='Học kỳ'>
							<Input value={recHocKy?.ten} disabled />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item label='Sinh viên' name='sinhVienSsoId' rules={[...rules.required]}>
							<SelectSinhVienDebounce />
						</Form.Item>
					</Col>

					{isThoiHoc ? (
						<Col span={24}>
							<Form.Item label='Loại thôi học' name='loaiThoiHoc' rules={[...rules.required]}>
								<Select
									placeholder='Chọn loại thôi học'
									options={Object.values(ELoaiThoiHoc).map((item) => ({ key: item, value: item, label: item }))}
								/>
							</Form.Item>
						</Col>
					) : null}
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
		</Card>
	);
};

export default FormCanhBaoHocTap;
