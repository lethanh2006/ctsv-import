import SelectDonVi from '@/pages/DaoTaoV2/ToChucNhanSu/DonVi/Select';
import { type HocPhan } from '@/services/DaoTaoV2/DanhMucHeThong/HocPhan/typings';
import { getSinhMa } from '@/services/DaoTaoV2/DanhMucHeThong/SinhMaTuDong';
import { ENguonSinhMa } from '@/services/DaoTaoV2/DanhMucHeThong/SinhMaTuDong/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, InputNumber, Row, Switch } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import SelectLoaiHocPhan from '../../LoaiHocPhan/components/Select';
import SelectTrinhDo from '../../TrinhDo/components/Select';

const FormHocPhan = (props: { afterAddNew: (rec: HocPhan.IRecord) => void }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { afterAddNew } = props;
	const {
		record,
		setRecord,
		setVisibleForm,
		edit,
		setEdit,
		postModel,
		putModel,
		getModel,
		formSubmiting,
		visibleForm,
	} = useModel('daotaov2.hocphan.hocphan');
	const { record: recDonVi } = useModel('daotaov2.tochucnhansu.donvi');
	const { record: recTrinhDo } = useModel('daotaov2.danhmuc.trinhdo');
	const maTrinhDoDaoTao = Form.useWatch('maTrinhDoDaoTao', form);
	const maDonVi = Form.useWatch('maDonVi', form);

	const getData = () => getModel({ maDonVi: recDonVi?.maDonVi, maTrinhDoDaoTao: recTrinhDo?.ma });

	const handleSinhMa = async () =>
		getSinhMa({ data: { maDonVi, maTrinhDoDaoTao }, nguon: ENguonSinhMa.HOC_PHAN })
			.then((res) => {
				form.setFieldsValue({ ma: res.data?.data });
			})
			.catch((er) => console.log(er));

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
		else form.setFieldsValue({ maDonVi: recDonVi?.maDonVi, maTrinhDoDaoTao: recTrinhDo?.ma });
	}, [record?._id, visibleForm]);

	useEffect(() => {
		if (!edit && maDonVi && maTrinhDoDaoTao) handleSinhMa();
	}, [maDonVi, maTrinhDoDaoTao]);

	const onFinish = async (values: HocPhan.IRecord) => {
		if (edit) {
			putModel(record?._id ?? '', values, getData, undefined, false)
				.then((rec) => setRecord(rec))
				.catch((er) => console.log(er));
		} else
			postModel(values, getData, false)
				.then((rec) => {
					setRecord(rec);
					setEdit(true);
					if (afterAddNew) afterAddNew(rec);
				})
				.catch((er) => console.log(er));
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<Col span={24} md={8}>
					<Form.Item name='maTrinhDoDaoTao' label='Trình độ đào tạo' rules={[...rules.required]}>
						<SelectTrinhDo selectMa />
					</Form.Item>
				</Col>
				<Col xs={24} md={16}>
					<Form.Item name='maDonVi' label='Đơn vị quản lý' rules={[...rules.required]}>
						<SelectDonVi />
					</Form.Item>
				</Col>

				<Col xs={24} md={8}>
					<Form.Item name='ma' label='Mã học phần' rules={[...rules.required, ...rules.text, ...rules.length(20)]}>
						<Input placeholder='Nhập mã học phần' />
					</Form.Item>
				</Col>
				<Col span={24} md={16}>
					<Form.Item
						name='ten'
						label='Tên học phần (tiếng Việt)'
						rules={[...rules.required, ...rules.text, ...rules.length(250)]}
					>
						<Input placeholder='Nhập tên học phần' />
					</Form.Item>
				</Col>

				<Col span={24} md={8}>
					<Form.Item name='soTinChi' label='Số tín chỉ' rules={[...rules.required, ...rules.number(20, 1, false)]}>
						<InputNumber min={1} max={20} step={1} placeholder='Nhập số tín chỉ' style={{ width: '100%' }} />
					</Form.Item>
				</Col>
				<Col span={24} md={8}>
					<Form.Item name='maLoaiHocPhan' label='Tính chất học phần' rules={[...rules.required]}>
						<SelectLoaiHocPhan selectMa />
					</Form.Item>
				</Col>
				<Col xs={24} md={8}>
					<Form.Item name='tenTiengAnh' label='Tên học phần (tiếng Anh)' rules={[...rules.text, ...rules.length(250)]}>
						<Input placeholder='Nhập tên học phần' />
					</Form.Item>
				</Col>

				<Col span={24} md={16}>
					<Form.Item name='active' label='Trạng thái kích hoạt' valuePropName='checked'>
						<Switch />
					</Form.Item>
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

export default FormHocPhan;
