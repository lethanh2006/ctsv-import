import { type ChuongTrinhDaoTao } from '@/services/DaoTaoV2/DanhMucHeThong/ChuongTrinhDaoTao/typings';
import { ELoaiHocPhanCTDT } from '@/services/DaoTaoV2/DanhMucHeThong/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Checkbox, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import SelectHocPhan from '../../HocPhan/components/SelectHocPhan';
import SelectKhoiKienThuc from '../../KhoiKienThuc/components/Select';
import SelectChuyenNganh from '../../Nganh/ChuyenNganh/SelectChuyenNganh';

/** Thêm học phần / khối học phần tự chọn / Khối học phần chuyển đổi tương đương */
const FormKhoiHocPhanCTDT = (props: {
	initKhoi?: string;
	initNganh?: string;
	getData: () => void;
	afterInsertOrUpdate: (rec: ChuongTrinhDaoTao.IKhoiHocPhanCTDT & { ghiChu?: string }) => void;
	isKeHoach?: boolean;
	fromChuyenDoi?: boolean;
	onCancel?: () => void;
}) => {
	const [form] = Form.useForm();
	const { initKhoi, initNganh, getData, afterInsertOrUpdate, isKeHoach, fromChuyenDoi, onCancel } = props;
	const {
		record,
		setVisibleForm,
		edit,
		postModel,
		putModel,
		formSubmiting,
		setRecord,
		setEdit,
		visibleForm,
		isClone,
		cloneKhoiHpCtModel,
	} = useModel('daotaov2.chuongtrinhdaotao.khoihocphanctdt');
	const { record: recChuongTrinh } = useModel('daotaov2.chuongtrinhdaotao.chuongtrinh');
	const { danhSach: danhSachHocPhan } = useModel('daotaov2.hocphan.hocphan');
	const loaiHocPhanCtdt = Form.useWatch('loaiHocPhanCtdt', form);

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id)
			form.setFieldsValue({
				...record,
				ten: isClone ? undefined : record.ten,
				maHocPhan: fromChuyenDoi ? undefined : record.maHocPhan,
				// Map dữ liệu danh sách học phần => mã để cho vào select multiple
				maHocPhanTienQuyet: record.dsHocPhanTienQuyet?.map((item) => item.ma),
				maHocPhanTruoc: record.dsHocPhanTruoc?.map((item) => item.ma),
				maHocPhanSongHanh: record.dsHocPhanSongHanh?.map((item) => item.ma),
			});
		else form.setFieldsValue({ maKhoiKienThuc: initKhoi, maChuyenNganh: initNganh });
	}, [record?._id, initKhoi, initNganh, visibleForm]);

	const onFinish = async (values: any) => {
		const { maHocPhanTienQuyet, maHocPhanTruoc, maHocPhanSongHanh, ...val } = values;
		const payload: ChuongTrinhDaoTao.IKhoiHocPhanCTDT = { ...val, maChuongTrinhDaoTao: recChuongTrinh?.ma ?? '' };
		// Map từ danh sách mã => ds object để lưu
		payload.dsHocPhanTienQuyet = danhSachHocPhan.filter((item) => maHocPhanTienQuyet?.includes(item.ma));
		payload.dsHocPhanTruoc = danhSachHocPhan.filter((item) => maHocPhanTruoc?.includes(item.ma));
		payload.dsHocPhanSongHanh = danhSachHocPhan.filter((item) => maHocPhanSongHanh?.includes(item.ma));

		if (fromChuyenDoi) {
			if (afterInsertOrUpdate) afterInsertOrUpdate(payload);
		} else if (isClone)
			cloneKhoiHpCtModel(record?._id ?? '', payload, getData)
				.then((rec) => {
					if (afterInsertOrUpdate) afterInsertOrUpdate(rec);
				})
				.catch((er) => console.log(er));
		else if (edit) {
			putModel(record?._id ?? '', payload, getData, true, false)
				.then((rec) => {
					setRecord(rec);
					if (afterInsertOrUpdate) afterInsertOrUpdate(rec);
				})
				.catch((er) => console.log(er));
		} else
			postModel(payload, getData, false)
				.then((rec) => {
					setRecord(rec);
					setEdit(true);
					if (afterInsertOrUpdate) afterInsertOrUpdate(rec);
				})
				.catch((er) => console.log(er));
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]}>
				<Col span={24} md={12}>
					<Form.Item name='maKhoiKienThuc' label='Khối kiến thức'>
						<SelectKhoiKienThuc hasDefault={!edit} selectMa allowClear />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item name='maChuyenNganh' label='Thuộc chuyên ngành'>
						<SelectChuyenNganh nganh={recChuongTrinh?.maNganh} selectMa allowClear />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item name='loaiHocPhanCtdt' label='Tính chất' rules={[...rules.required]}>
						<Select
							options={Object.values(ELoaiHocPhanCTDT).map((item) => ({
								key: item,
								value: item,
								label: item,
							}))}
							placeholder='Chọn tính chất'
							disabled={edit}
						/>
					</Form.Item>
				</Col>
				{isKeHoach ? (
					<Col span={12} md={6}>
						<Form.Item name='soThuTuKyKeHoach' label='HK kế hoạch'>
							<InputNumber disabled style={{ width: '100%' }} />
						</Form.Item>
					</Col>
				) : null}
				<Col span={isKeHoach ? 12 : 24} md={isKeHoach ? 6 : 12}>
					<Form.Item
						name='soThuTuKy'
						label={isKeHoach ? 'HK thực tế' : 'HK kế hoạch'}
						rules={[...rules.number(20, 0, false), ...rules.required]}
					>
						<InputNumber
							style={{ width: '100%' }}
							min={0}
							max={20}
							placeholder={isKeHoach ? 'HK thực tế' : 'HK kế hoạch'}
						/>
					</Form.Item>
				</Col>
			</Row>

			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				{loaiHocPhanCtdt === ELoaiHocPhanCTDT.BAT_BUOC ? (
					<>
						<Col span={24} md={12}>
							<Form.Item name='maHocPhan' label='Học phần' rules={[...rules.required]}>
								<SelectHocPhan selectMa />
							</Form.Item>
						</Col>

						<Col span={24} md={12}>
							<Form.Item name='maHocPhanTienQuyet' label='Học phần tiên quyết'>
								<SelectHocPhan selectMa allowClear loadData={false} multiple />
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item name='maHocPhanTruoc' label='Học phần trước'>
								<SelectHocPhan selectMa allowClear loadData={false} multiple />
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item name='maHocPhanSongHanh' label='Học phần song hành'>
								<SelectHocPhan selectMa allowClear loadData={false} multiple />
							</Form.Item>
						</Col>
						{/* <Col span={24} md={12}>
							<Form.Item name='tinhChuanDauRa' valuePropName='checked'>
								<Checkbox>Học phần tính chuẩn đầu ra</Checkbox>
							</Form.Item>
						</Col> */}
					</>
				) : loaiHocPhanCtdt === ELoaiHocPhanCTDT.TU_CHON || loaiHocPhanCtdt === ELoaiHocPhanCTDT.TOT_NGHIEP ? (
					<>
						<Col span={24} md={12}>
							<Form.Item
								name='ten'
								label='Tên khối học phần'
								rules={[...rules.required, ...rules.text, ...rules.length(250)]}
							>
								<Input placeholder='Nhập tên khối học phần' />
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item
								name='soTinChiTuChonPhaiHoc'
								label='Số tín chỉ phải học'
								rules={[...rules.number(20, 0, false), ...rules.required]}
							>
								<InputNumber style={{ width: '100%' }} min={0} max={20} placeholder='Số tín chỉ phải học' />
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item name='isTinhSoTinChiTichLuy' valuePropName='checked'>
								<Checkbox>Tính số tín chỉ tích lũy</Checkbox>
							</Form.Item>
						</Col>
						{/* <Col span={24} md={12}>
							<Form.Item name='maLoaiHocPhan' label='Loại học phần' rules={[...rules.required]}>
								<SelectLoaiHocPhan
									selectMa
									condition={
										loaiHocPhanCtdt === ELoaiHocPhanCTDT.TU_CHON ? { khoiTuChon: true } : { khoiTotNghiep: true }
									}
								/>
							</Form.Item>
						</Col> */}
					</>
				) : null}

				{fromChuyenDoi ? (
					<Col span={24}>
						<Form.Item name='ghiChu' label='Ghi chú' rules={[...rules.text, ...rules.length(250)]}>
							<Input.TextArea rows={2} placeholder='Nhập ghi chú' />
						</Form.Item>
					</Col>
				) : null}
			</Row>

			<div className='form-footer'>
				<Button loading={formSubmiting} htmlType='submit' type='primary'>
					{fromChuyenDoi
						? 'Xác nhận'
						: !edit
						? loaiHocPhanCtdt === ELoaiHocPhanCTDT.TU_CHON || loaiHocPhanCtdt === ELoaiHocPhanCTDT.TOT_NGHIEP
							? 'Thêm mới & Tiếp tục'
							: 'Thêm mới'
						: 'Lưu lại'}
				</Button>
				<Button
					onClick={() => {
						setVisibleForm(false);
						if (onCancel) onCancel();
					}}
				>
					Hủy
				</Button>
			</div>
		</Form>
	);
};

export default FormKhoiHocPhanCTDT;
