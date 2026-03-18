import DeCuongHocPhanPage from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/DeCuongHocPhan';
import SelectHocPhan from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/HocPhan/components/SelectHocPhan';
import type { HocPhan } from '@/services/DaoTaoV2/DanhMucHeThong/HocPhan/typings';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Descriptions, Form, InputNumber, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import FormItemSiSo from './FormItemSiSo';

const FormDeCuongHocPhanHK = () => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm, getModel } =
		useModel('daotaov2.hocphan.decuonghphk');
	const { danhSach: danhSachHocPhan, setRecord: setHocPhan, record: recHocPhan } = useModel('daotaov2.hocphan.hocphan');
	const { selectedIds, setSelectedIds } = useModel('daotaov2.hocphan.decuonghocphan');

	const getData = () => recHocKy?.ma && getModel({ maHocKy: recHocKy.ma });

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) {
			form.setFieldsValue(record);
			setSelectedIds(record.deCuongId ? [record.deCuongId] : []);
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: HocPhan.IDeCuongHocPhanHocKy) => {
		// if (!selectedIds?.length) {
		// 	message.warning('Chưa chọn đề cương học phần');
		// 	return;
		// }
		values.deCuongId = selectedIds?.[0];

		if (edit) {
			putModel(record?._id ?? '', values, getData).catch((er) => console.log(er));
		} else postModel({ ...values, maHocKy: recHocKy?.ma, active: true }, getData).catch((er) => console.log(er));
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} thông số học phần học kỳ`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				{edit ? (
					<Descriptions column={{ xs: 1, sm: 1, md: 2 }}>
						<Descriptions.Item label='Học kỳ'>{recHocKy?.ten ?? record?.maHocKy}</Descriptions.Item>
						<Descriptions.Item label='Học phần'>{record?.tenHocPhan}</Descriptions.Item>
						<Descriptions.Item label='Mã học phần'>{record?.maHocPhan}</Descriptions.Item>
						<Descriptions.Item label='Số tín chỉ'>{record?.soTinChi ?? '--'} tín</Descriptions.Item>
						<Descriptions.Item label='Số nhu cầu dự kiến'>{record?.soNhuCauDuKien ?? '--'}</Descriptions.Item>
					</Descriptions>
				) : (
					<Col span={24}>
						<Form.Item name='maHocPhan' label='Học phần' rules={[...rules.required]}>
							<SelectHocPhan selectMa onChange={(val) => setHocPhan(danhSachHocPhan.find((item) => item.ma === val))} />
						</Form.Item>
					</Col>
				)}
				<FormItemSiSo />

				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col span={12}>
						<Form.Item name='soNhuCauKeHoach' label='Số nhu cầu kế hoạch'>
							<InputNumber style={{ width: '100%' }} min={0} max={2000} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<div style={{ marginBottom: 8 }}>Đề cương học phần</div>
					</Col>
					<Col xs={24}>
						<DeCuongHocPhanPage maHocPhan={edit ? record?.maHocPhan : recHocPhan?.ma} isFormItem />
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
		</Card>
	);
};

export default FormDeCuongHocPhanHK;
