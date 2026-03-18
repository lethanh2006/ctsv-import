import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import SelectHocPhan from '../../HocPhan/components/SelectHocPhan';

const FormHocPhanCTDT = (props: any) => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, getModel, formSubmiting, visibleForm } = useModel(
		'chuongtrinhdaotao.hocphanctdt',
	);
	const { record: recKhoi } = useModel('daotaov2.chuongtrinhdaotao.khoihocphanctdt');
	const { danhSach: danhSachHocPhan } = useModel('daotaov2.hocphan.hocphan');
	const { title } = props;

	const getData = () => getModel({ khoiHpCtId: recKhoi?._id });

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id)
			form.setFieldsValue({
				...record,
				// Map dữ liệu danh sách học phần => mã để cho vào select multiple
				maHocPhanTienQuyet: record.dsHocPhanTienQuyet?.map((item) => item.ma),
				maHocPhanTruoc: record.dsHocPhanTruoc?.map((item) => item.ma),
				maHocPhanSongHanh: record.dsHocPhanSongHanh?.map((item) => item.ma),
			});
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		const { maHocPhanTienQuyet, maHocPhanTruoc, maHocPhanSongHanh, ...val } = values;
		// Map từ danh sách mã => ds object để lưu
		val.dsHocPhanTienQuyet = danhSachHocPhan.filter((item) => maHocPhanTienQuyet?.includes(item.ma));
		val.dsHocPhanTruoc = danhSachHocPhan.filter((item) => maHocPhanTruoc?.includes(item.ma));
		val.dsHocPhanSongHanh = danhSachHocPhan.filter((item) => maHocPhanSongHanh?.includes(item.ma));

		if (edit) {
			putModel(record?._id ?? '', val, getData)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel({ ...val, khoiHpCtId: recKhoi?._id ?? '' }, getData)
				.then()
				.catch((er) => console.log(er));
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col xs={24}>
						<Form.Item name='maHocPhan' label='Học phần' rules={[...rules.required]}>
							<SelectHocPhan selectMa />
						</Form.Item>
					</Col>

					<Col xs={24}>
						<Form.Item name='maHocPhanTienQuyet' label='Học phần tiên quyết'>
							<SelectHocPhan allowClear loadData={false} selectMa multiple />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item name='maHocPhanTruoc' label='Học phần trước'>
							<SelectHocPhan allowClear loadData={false} selectMa multiple />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item name='maHocPhanSongHanh' label='Học phần song hành'>
							<SelectHocPhan allowClear loadData={false} selectMa multiple />
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

export default FormHocPhanCTDT;
