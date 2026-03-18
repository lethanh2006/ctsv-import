import SelectNganh from '@/pages/DaoTaoV2/DanhMucHeThong/Bo/Nganh/components/SelectNganh';
import SelectVanBanQuyDinh from '@/pages/DaoTaoV2/DanhMucHeThong/VanBanQuyDinh/components/Select';
import SelectDonVi from '@/pages/DaoTaoV2/ToChucNhanSu/DonVi/Select';
import type { NganhDaoTao } from '@/services/DaoTaoV2/DanhMucHeThong/Nganh/typings';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import SelectTrinhDo from '../../TrinhDo/components/Select';

const FormNganhCoSo = (props: { afterAddNew?: (rec: NganhDaoTao.IRecordCoSo) => void }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const {
		record,
		edit,
		postModel,
		putModel,
		getModel,
		setEdit,
		setRecord,
		formSubmiting,
		setVisibleForm,
		visibleForm,
	} = useModel('daotaov2.danhmuc.nganhdaotao');
	const { danhSach: danhSachTrinhDo } = useModel('daotaov2.danhmuc.trinhdo');
	const { danhSach: danhSachDmNganh } = useModel('daotaov2.danhmuc.dmnganh');
	const [maDmTrinhDo, setMaDmTrinhDo] = useState<string>();
	const { afterAddNew } = props;

	const getData = () => getModel({ maNganhGoc: null });

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);

		setMaDmTrinhDo(record?.trinhDo?.maDmTrinhDo);
	}, [record?._id, visibleForm]);

	const onChangeTrinhDo = (maTrinhDo?: string) => {
		form.setFieldsValue({ maDmNganh: undefined });
		const dm = danhSachTrinhDo.find((item) => item.ma === maTrinhDo);
		setMaDmTrinhDo(dm?.maDmTrinhDo);
	};

	const onChangeDmNganh = (val: string) => {
		const dm = danhSachDmNganh.find((item) => item.ma === val);
		form.setFieldsValue({ ten: dm?.ten, ma: dm?.ma });
	};

	const onFinish = async (values: NganhDaoTao.IRecordCoSo) => {
		if (edit) {
			putModel(record?._id ?? '', values, getData, undefined, false)
				.then()
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
				<Col span={24} md={12}>
					<Form.Item name='maTrinhDo' label='Trình độ đào tạo' rules={[...rules.required]}>
						<SelectTrinhDo selectMa onChange={(val) => onChangeTrinhDo(val as string)} />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item name='maDmNganh' label='Danh mục ngành' rules={[...rules.required]}>
						<SelectNganh maDmTrinhDo={maDmTrinhDo} disabled={!maDmTrinhDo} onChange={onChangeDmNganh} selectMa />
					</Form.Item>
				</Col>

				<Col span={24} md={12}>
					<Form.Item name='ten' label='Tên ngành' rules={[...rules.text, ...rules.required, ...rules.length(250)]}>
						<Input placeholder='Nhập tên ngành' />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item name='tenTiengAnh' label='Tên ngành (Tiếng Anh)' rules={[...rules.text, ...rules.length(250)]}>
						<Input placeholder='Nhập tên ngành (Tiếng Anh)' />
					</Form.Item>
				</Col>

				<Col span={24} md={8}>
					<Form.Item name='ma' label='Mã nội bộ' rules={[...rules.text, ...rules.length(20)]}>
						<Input placeholder='Nhập mã nội bộ' />
					</Form.Item>
				</Col>
				<Col span={24} md={8}>
					<Form.Item name='maDonVi' label='Đơn vị'>
						<SelectDonVi />
					</Form.Item>
				</Col>

				<Col xs={24} md={8}>
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
	);
};

export default FormNganhCoSo;
