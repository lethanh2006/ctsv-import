import TinyEditor from '@/components/TinyEditor';
import FormItemUrlOrUpload from '@/components/Upload/FormItemUrlOrUpload';
import SelectVanBanQuyDinh from '@/pages/DaoTaoV2/DanhMucHeThong/VanBanQuyDinh/components/Select';
import { type ChuongTrinhDaoTao } from '@/services/DaoTaoV2/DanhMucHeThong/ChuongTrinhDaoTao/typings';
import {
	ELoaiChuongTrinhDaoTao,
	ETrangThaiCtdt,
	colorTrangThaiCtdt,
	trangThaiCtdt,
} from '@/services/DaoTaoV2/DanhMucHeThong/constant';
import { buildUpLoadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, InputNumber, Row, Tabs, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import SelectNganhCoSo from '../../Nganh/components/SelectNganh';
import SelectTrinhDo from '../../TrinhDo/components/Select';

const FormChuongTrinhDaoTao = (props: {
	afterAddNew: (rec: ChuongTrinhDaoTao.IRecord) => void;
	isKeHoach?: boolean;
	trangThai?: ETrangThaiCtdt;
}) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { afterAddNew, isKeHoach, trangThai } = props;
	const {
		record,
		setRecord,
		setEdit,
		setVisibleForm,
		edit,
		postModel,
		putModel,
		getModel,
		formSubmiting,
		setFormSubmiting,
		visibleForm,
	} = useModel('daotaov2.chuongtrinhdaotao.chuongtrinh');
	const [activeKey, setActiveKey] = useState('1');
	const maTrinhDo = Form.useWatch('maTrinhDoDaoTao', form);
	const maNganh = Form.useWatch('maNganh', form);
	const namBanHanh = Form.useWatch('namBanHanh', form);
	const isDisabled = !!record?.trangThai && record?.trangThai !== ETrangThaiCtdt.CONG_BO;

	const getData = () => getModel({ loai: isKeHoach ? ELoaiChuongTrinhDaoTao.KE_HOACH : ELoaiChuongTrinhDaoTao.CHUAN });

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	useEffect(() => {
		if (!edit && maNganh && namBanHanh) form.setFieldsValue({ ma: `${maNganh}_${namBanHanh}` });
	}, [maNganh, namBanHanh]);

	const onFinish = async (values: ChuongTrinhDaoTao.IRecord) => {
		if (!!values.url && typeof values.url !== 'string') {
			setFormSubmiting(true);
			await buildUpLoadFile(values, 'url')
				.then((url) => (values.url = url))
				.catch(() => (values.url = null))
				.finally(() => setFormSubmiting(false));
		}
		if (edit) {
			putModel(record?._id ?? '', values, getData, undefined, false)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(
				{
					...values,
					loai: isKeHoach ? ELoaiChuongTrinhDaoTao.KE_HOACH : ELoaiChuongTrinhDaoTao.CHUAN,
					trangThai: trangThai ?? ETrangThaiCtdt.CONG_BO,
				},
				getData,
				false,
			)
				.then((rec) => {
					setRecord(rec);
					setEdit(true);
					if (afterAddNew) afterAddNew(rec);
				})
				.catch((er) => console.log(er));
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical' disabled={isDisabled}>
			<Row gutter={[12, 0]}>
				{isKeHoach ? (
					<>
						<Col span={24} md={12}>
							<Form.Item label='Chương trình đào tạo chuẩn'>
								<Input value={record?.chuongTrinhDaoTaoChuan?.ten} disabled />
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item label='Khóa sinh viên'>
								<Input value={record?.khoaSinhVien?.ten} disabled />
							</Form.Item>
						</Col>
					</>
				) : record?.trangThai ? (
					<Col span={24}>
						<div style={{ marginBottom: 12 }}>
							Trạng thái: <Tag color={colorTrangThaiCtdt[record?.trangThai]}>{trangThaiCtdt[record?.trangThai]}</Tag>
						</div>
					</Col>
				) : null}

				<Col span={12} md={8}>
					<Form.Item name='maTrinhDoDaoTao' label='Trình độ đào tạo' rules={[...rules.required]}>
						<SelectTrinhDo hasDefault={!edit} selectMa disabled={edit || isKeHoach} />
					</Form.Item>
				</Col>
				<Col span={12} md={8}>
					<Form.Item name='maNganh' label='Ngành đào tạo' rules={[...rules.required]}>
						<SelectNganhCoSo condition={{ maTrinhDo }} selectMa disabled={!maTrinhDo || edit || isKeHoach} />
					</Form.Item>
				</Col>
				<Col span={12} md={8}>
					<Form.Item
						name='namBanHanh'
						label='Năm ban hành'
						rules={[...rules.number(3000, 2000, false), ...rules.required]}
					>
						<InputNumber placeholder='Nhập năm ban hành' style={{ width: '100%' }} />
					</Form.Item>
				</Col>
				<Col span={12} md={8}>
					<Form.Item name='ma' label='Mã chương trình' rules={[...rules.text, ...rules.length(50), ...rules.required]}>
						<Input placeholder='Nhập mã chương trình' />
					</Form.Item>
				</Col>

				<Col span={24} md={8}>
					<Form.Item
						name='ten'
						label='Tên chương trình (tiếng Việt)'
						rules={[...rules.required, ...rules.text, ...rules.length(250)]}
					>
						<Input placeholder='Nhập tên chương trình (tiếng Việt)' />
					</Form.Item>
				</Col>
				<Col span={24} md={8}>
					<Form.Item
						name='tenTiengAnh'
						label='Tên chương trình (tiếng Anh)'
						rules={[...rules.text, ...rules.length(250)]}
					>
						<Input placeholder='Nhập tên chương trình (tiếng Anh)' />
					</Form.Item>
				</Col>

				<Col span={24} md={8}>
					<Form.Item name='thoiGianDaoTao' label='Thời gian đào tạo (năm)' rules={[...rules.number(10, 0)]}>
						<InputNumber placeholder='Nhập thời gian đào tạo' min={0} max={10} style={{ width: '100%' }} />
					</Form.Item>
				</Col>
				{/* <Col span={24} md={8}>
					<Form.Item
						name='tongSoTinChi'
						label='Khối lượng kiến thức toàn khóa'
						rules={[...rules.required, ...rules.number(200, 0, false)]}
					>
						<InputNumber placeholder='Nhập số tín chỉ' min={0} max={200} style={{ width: '100%' }} />
					</Form.Item>
				</Col> */}

				{/* <Col span={24} md={8}>
					<Form.Item name='maLoaiChungChiList' label='Chứng chỉ chuẩn đầu ra'>
						<SelectLoaiChungChi multiple selectMa />
					</Form.Item>
				</Col> */}

				<Col span={24} md={8}>
					<Form.Item name='canCuId' label='Căn cứ pháp lý'>
						<SelectVanBanQuyDinh hasDefault={!edit} />
					</Form.Item>
				</Col>

				<Col span={24} md={8}>
					<FormItemUrlOrUpload form={form} initValue={record?.url} />
				</Col>
			</Row>

			<Tabs activeKey={activeKey} onChange={(tab) => setActiveKey(tab)}>
				<Tabs.TabPane key='1' tab='Mục tiêu đào tạo' />
				<Tabs.TabPane key='2' tab='Chuẩn đầu vào' />
				<Tabs.TabPane key='3' tab='Chuẩn đầu ra' />
				<Tabs.TabPane key='4' tab='Vị trí việc làm sau tốt nghiệp' />
			</Tabs>

			{/* Dùng CSS để show/hide các div, tránh trường hợp un-render */}
			<div style={{ display: activeKey === '1' ? 'block' : 'none' }}>
				<Form.Item name='mucTieuDaoTao' label='' initialValue=''>
					<TinyEditor hideMenubar miniToolbar disabled={isDisabled} stickyToolbar={false} />
				</Form.Item>
			</div>
			<div style={{ display: activeKey === '2' ? 'block' : 'none' }}>
				<Form.Item name='chuanDauVao' label='' initialValue=''>
					<TinyEditor hideMenubar miniToolbar disabled={isDisabled} stickyToolbar={false} />
				</Form.Item>
			</div>
			<div style={{ display: activeKey === '3' ? 'block' : 'none' }}>
				<Form.Item name='chuanDauRa' label='' initialValue=''>
					<TinyEditor hideMenubar miniToolbar disabled={isDisabled} stickyToolbar={false} />
				</Form.Item>
			</div>
			<div style={{ display: activeKey === '4' ? 'block' : 'none' }}>
				<Form.Item name='viTriLamViec' label='' initialValue=''>
					<TinyEditor hideMenubar miniToolbar disabled={isDisabled} stickyToolbar={false} />
				</Form.Item>
			</div>

			{!isDisabled ? (
				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit
							? `${intl.formatMessage({ id: 'global.button.themmoi' })}`
							: `${intl.formatMessage({ id: 'global.button.luulai' })}`}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			) : null}
		</Form>
	);
};

export default FormChuongTrinhDaoTao;
