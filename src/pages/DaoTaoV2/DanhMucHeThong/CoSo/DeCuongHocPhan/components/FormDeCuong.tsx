import MyDatePicker from '@/components/MyDatePicker';
import TinyEditor from '@/components/TinyEditor';
import FormItemUrlOrUpload from '@/components/Upload/FormItemUrlOrUpload';
import SelectVanBanQuyDinh from '@/pages/DaoTaoV2/DanhMucHeThong/VanBanQuyDinh/components/Select';
import { type HocPhan } from '@/services/DaoTaoV2/DanhMucHeThong/HocPhan/typings';
import { buildUpLoadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, Row, Tabs, message } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import TabTrongSoHocPhan from './TabTrongSoHocPhan';

const FormDeCuong = (props: { afterAddNew: (rec: HocPhan.IDeCuongHocPhan) => void; maHocPhan?: string }) => {
	const [form] = Form.useForm();
	const { afterAddNew, maHocPhan } = props;
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
		setFormSubmiting,
		visibleForm,
	} = useModel('daotaov2.hocphan.decuonghocphan');
	const { record: recHocPhan } = useModel('daotaov2.hocphan.hocphan');
	const [activeKey, setActiveKey] = useState('1');
	const [diemKTHP, setDiemKTHP] = useState<number>(0);

	const getData = () => {
		if (maHocPhan || recHocPhan?.ma) getModel({ maHocPhan: maHocPhan || recHocPhan?.ma });
	};

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
			setDiemKTHP(0);
		} else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: HocPhan.IDeCuongHocPhan) => {
		if (!maHocPhan && !recHocPhan?.ma) {
			console.error('Invalid maHocPhan');
			return;
		}
		if (diemKTHP <= 0) {
			message.error('Trọng số Điểm kết thúc học phần phải lớn hơn 0');
			return;
		}
		if (!!values.url && typeof values.url !== 'string') {
			setFormSubmiting(true);
			await buildUpLoadFile(values, 'url')
				.then((url) => (values.url = url))
				.catch(() => (values.url = null))
				.finally(() => setFormSubmiting(false));
		}

		const payload = { ...values, maHocPhan: maHocPhan || recHocPhan?.ma };
		if (edit) {
			putModel(record?._id ?? '', payload, getData, undefined, false)
				.then((rec) => setRecord(rec))
				.catch((er) => console.log(er));
		} else
			postModel(payload, getData, false)
				.then((rec) => {
					setRecord(rec);
					setEdit(true);
					if (afterAddNew) afterAddNew(rec);
				})
				.catch((er) => console.log(er));
	};

	return (
		<Form form={form} layout='vertical'>
			<Row gutter={[12, 0]}>
				<Col span={12}>
					<Form.Item name='nguoiBienSoan' label='Người biên soạn' rules={[...rules.text, ...rules.length(250)]}>
						<Input placeholder='Nhập người biên soạn' />
					</Form.Item>
				</Col>

				<Col span={12}>
					<Form.Item name='ngayApDung' label='Ngày áp dụng'>
						<MyDatePicker />
					</Form.Item>
				</Col>

				{/* <Col span={12}>
          <Form.Item
            name="soTinChi"
            label="Số tín chỉ"
            rules={[...rules.required, ...rules.number(20, 1, false)]}
          >
            <InputNumber
              min={1}
              max={20}
              step={1}
              placeholder="Nhập số tín chỉ"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col> */}

				<Col span={24} md={12}>
					<Form.Item name='maCanCu' label='Căn cứ pháp lý'>
						<SelectVanBanQuyDinh hasDefault={!edit} selectMa />
					</Form.Item>
				</Col>
				{/* <Col span={24}>
					<Form.Item name='isTinhDiem' label='' valuePropName='checked'>
						<Checkbox>Là học phần tính điểm</Checkbox>
					</Form.Item>
				</Col> */}
				<Col span={24} md={12}>
					<FormItemUrlOrUpload form={form} initValue={record?.url} />
				</Col>
			</Row>

			<div className='fw500' style={{ marginTop: 12 }}>
				Trọng số học phần
			</div>
			<TabTrongSoHocPhan form={form} setDiemKTHP={setDiemKTHP} />

			<Tabs activeKey={activeKey} onChange={(tab) => setActiveKey(tab)}>
				<Tabs.TabPane key='1' tab='Mục tiêu học phần' />
				<Tabs.TabPane key='2' tab='Nội dung học phần' />
			</Tabs>

			{/* Dùng CSS để show/hide các div, tránh trường hợp un-render */}
			<div style={{ display: activeKey === '1' ? 'block' : 'none' }}>
				<Form.Item name='mucTieuHocPhan' label='' initialValue=''>
					<TinyEditor hideMenubar miniToolbar stickyToolbar={false} />
				</Form.Item>
			</div>
			<div style={{ display: activeKey === '2' ? 'block' : 'none' }}>
				<Form.Item name='noiDungTomTat' label='Nội dung tóm tắt' initialValue=''>
					<TinyEditor hideMenubar miniToolbar stickyToolbar={false} />
				</Form.Item>
				<Form.Item name='noiDungChiTiet' label='Nội dung chi tiết' initialValue=''>
					<TinyEditor hideMenubar miniToolbar stickyToolbar={false} />
				</Form.Item>
			</div>

			<div className='form-footer'>
				<Button
					loading={formSubmiting}
					type='primary'
					onClick={() => {
						form
							.validateFields()
							.then(onFinish)
							.catch(() => {
								message.error('Nhập thiếu hoặc sai các trường thông tin');
							});
					}}
				>
					{!edit ? 'Thêm mới & Tiếp tục' : 'Lưu lại'}
				</Button>
				<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
			</div>
		</Form>
	);
};

export default FormDeCuong;
