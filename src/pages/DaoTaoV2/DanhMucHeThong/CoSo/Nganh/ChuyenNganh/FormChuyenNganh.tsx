import SelectVanBanQuyDinh from '@/pages/DaoTaoV2/DanhMucHeThong/VanBanQuyDinh/components/Select';
import rules from '@/utils/rules';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import SelectNganhCoSo from '../components/SelectNganh';
import { type TFilter } from '@/components/Table/typing';
import { EOperatorType } from '@/components/Table/constant';
import { resetFieldsForm } from '@/utils/utils';

const FormChuyenNganh = () => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, getModel, setVisibleForm, postModel, edit, putModel, formSubmiting, visibleForm } =
		useModel('daotaov2.danhmuc.chuyennganh');
	const { record: recNganh } = useModel('daotaov2.danhmuc.nganhdaotao');
	const { pathname } = window.location;
	const arrPathName = pathname?.split('/') ?? [];
	const isChuyenNganh = arrPathName.includes('chuyen-nganh');

	const getData = () => {
		const filter: TFilter<NganhDaoTao.IRecordCoSo> = {
			field: 'maNganhGoc',
			operator: isChuyenNganh ? EOperatorType.NOT_NULL : EOperatorType.INCLUDE,
			values: recNganh?.ma && !isChuyenNganh ? [recNganh.ma] : [''],
			active: true,
		};
		getModel(undefined, [filter]);
	};

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: NganhDaoTao.IRecordCoSo) => {
		if (edit) {
			putModel(record?._id ?? '', values, getData)
				.then()
				.catch((er) => console.log(er));
		} else {
			const valuesFinal = { ...values, maNganhGoc: recNganh?.ma };
			postModel(!isChuyenNganh ? valuesFinal : values, getData)
				.then()
				.catch((er) => console.log(er));
		}
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} chuyên ngành đào tạo`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					{isChuyenNganh ? (
						<Col xs={24}>
							<Form.Item name='maNganhGoc' label='Ngành đào tạo' rules={[...rules.required]}>
								<SelectNganhCoSo selectMa />
							</Form.Item>
						</Col>
					) : null}
					<Col xs={24}>
						<Form.Item
							name='ma'
							label='Mã chuyên ngành'
							rules={[...rules.required, ...rules.text, ...rules.length(20)]}
						>
							<Input placeholder='Nhập mã chuyên ngành' />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item
							name='ten'
							label='Tên chuyên ngành'
							rules={[...rules.required, ...rules.text, ...rules.length(250)]}
						>
							<Input placeholder='Nhập tên chuyên ngành' />
						</Form.Item>
					</Col>

					<Col xs={24}>
						<Form.Item name='maCanCuPhapLy' label='Căn cứ pháp lý'>
							<SelectVanBanQuyDinh hasDefault={!edit} selectMa />
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
		</Card>
	);
};

export default FormChuyenNganh;
