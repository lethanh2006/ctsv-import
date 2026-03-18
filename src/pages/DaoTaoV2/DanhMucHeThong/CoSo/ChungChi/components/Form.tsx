import { EPhuongThucTinhDiem } from '@/services/DaoTaoV2/DanhMucHeThong/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Checkbox, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import SelectLoaiChungChi from '../../LoaiChungChi/components/Select';
import SelectNgoaiNgu from '../../NgoaiNgu/components/Select';

const FormChungChi = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('daotaov2.danhmuc.chungchi');
	const {
		danhSach: danhSachLoaiChungChi,
		setRecord: setRecLoaiChungChi,
		record: recLoaiChungChi,
	} = useModel('daotaov2.danhmuc.loaichungchi');
	const { title } = props;
	const chungChiThoiHan: boolean = Form.useWatch('chungChiCoThoiHan', form);
	const phuongThucTinhDiem: EPhuongThucTinhDiem = Form.useWatch('phuongThucTinhDiem', form);
	const maLoaiChungChi = Form.useWatch('maLoaiChungChi', form);

	useEffect(() => {
		const findLoaiChungChi = danhSachLoaiChungChi.find((item) => item.ma === maLoaiChungChi);
		setRecLoaiChungChi(findLoaiChungChi);
	}, [maLoaiChungChi]);

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) {
			const data = {
				...record,
				bac: record?.bac?.map((item) => item.ten) || [],
			};
			form.setFieldsValue(data);
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		if (phuongThucTinhDiem === EPhuongThucTinhDiem.BAC && values.bac)
			values.bac = values.bac.map((item: string, index: number) => ({
				order: index,
				ten: item,
			}));

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
				<Row gutter={[12, 0]}>
					<Col xs={24} md={12}>
						<Form.Item name='maLoaiChungChi' label='Loại chứng chỉ' rules={[...rules.required]}>
							<SelectLoaiChungChi selectMa />
						</Form.Item>
					</Col>
					{recLoaiChungChi?.isNgoaiNgu ? (
						<Col xs={24} md={12}>
							<Form.Item name='maNgonNgu' label='Ngoại ngữ' rules={[...rules.required]}>
								<SelectNgoaiNgu selectMa />
							</Form.Item>
						</Col>
					) : null}
				</Row>

				<Row gutter={[12, 0]}>
					<Col xs={24} md={12}>
						<Form.Item name='ma' label='Mã chứng chỉ' rules={[...rules.required, ...rules.text, ...rules.length(20)]}>
							<Input placeholder='Nhập mã chứng chỉ' disabled={edit} />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item
							name='ten'
							label='Tên chứng chỉ'
							rules={[...rules.required, ...rules.text, ...rules.length(250)]}
						>
							<Input placeholder='Nhập tên chứng chỉ' />
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={[12, 0]}>
					<Col xs={24} md={12}>
						<Form.Item name='phuongThucTinhDiem' label='Phương thức tính điểm' rules={[...rules.required]}>
							<Select
								placeholder='Phương thức tính điểm'
								options={Object.values(EPhuongThucTinhDiem).map((item) => ({
									key: item,
									label: item,
									value: item,
								}))}
							/>
						</Form.Item>
					</Col>

					{phuongThucTinhDiem === EPhuongThucTinhDiem.DIEM ? (
						<>
							<Col xs={24} md={12}>
								<Form.Item name='min' label='Tối thiểu' rules={[...rules.required]}>
									<InputNumber style={{ width: '100%' }} min={0} placeholder='Nhập điểm tối thiểu' />
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item name='max' label='Tối đa' rules={[...rules.required]}>
									<InputNumber style={{ width: '100%' }} min={0} max={990} placeholder='Nhập điểm tối đa' />
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item name='step' label='Bước nhảy' rules={[...rules.required]}>
									<InputNumber style={{ width: '100%' }} min={0} placeholder='Nhập bước nhảy' />
								</Form.Item>
							</Col>
						</>
					) : phuongThucTinhDiem === EPhuongThucTinhDiem.BAC ? (
						<Col xs={24} md={12}>
							<Form.Item name='bac' label='Bậc chứng chỉ' rules={[...rules.required]}>
								<Select
									mode='tags'
									placeholder='Nhập bậc chứng chỉ'
									options={record?.bac?.map((item) => ({
										key: item.ten,
										label: item.ten,
										value: item.ten,
									}))}
								/>
							</Form.Item>
						</Col>
					) : null}
				</Row>

				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col xs={24} md={12}>
						<Form.Item name='chungChiCoThoiHan' valuePropName='checked'>
							<Checkbox>Chứng chỉ có thời hạn</Checkbox>
						</Form.Item>
					</Col>
					{chungChiThoiHan ? (
						<Col xs={24} md={12}>
							<Form.Item name='thoiHanChungChi' label='Thời hạn chứng chỉ (năm)' rules={[...rules.required]}>
								<InputNumber style={{ width: '100%' }} min={0} placeholder='Nhập thời hạn chứng chỉ' />
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

export default FormChungChi;
