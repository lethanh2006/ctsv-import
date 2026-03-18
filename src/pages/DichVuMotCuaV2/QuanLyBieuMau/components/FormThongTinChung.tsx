import TinyEditor from '@/components/TinyEditor';
import UploadFile from '@/components/Upload/UploadFile';
import SelectHinhThuc from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/HinhThuc/components/Select';
import SelectKhoanThu from '@/pages/DichVuMotCuaV2/KhoanThu/Select';
import SelectMucThu from '@/pages/DichVuMotCuaV2/MucThu/Select';
import { uploadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { renderFileListUrlWithName } from '@/utils/utils';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const FormThongTinChung = () => {
	const [form] = Form.useForm();
	const [conditionMucThu, setConditionMucThu] = useState<any>();
	const { loading, edit, setCurrent, record: recordDichVu, setRecord } = useModel('dvmc.dichvumotcuav2');

	const { danhSach, setRecord: setRecordProduct, record: recordProduct } = useModel('dvmc.khoanthu');

	const [phamVi, setPhamVi] = useState<string>(recordDichVu?.phamVi ?? '');
	const { record } = useModel('dvmc.thanhtoan');
	// const { danhSach } = useModel('donvi');
	// const { danhSachHinhThucDaoTao } = useModel('namhoc.lophanhchinh');
	// set kiểm tra xem đơn có được tạo lịch hẹn hay không
	const [taoLichHen, setTaoLichHen] = useState<boolean>(recordDichVu?.traKetQua ?? false);

	useEffect(() => {
		form.setFieldsValue({
			mucLePhi: recordDichVu?.mucLePhi || record?.currentPrice?.unitAmount,
			donViTinh: recordDichVu?.donViTinh || record?.unitLabel || recordProduct?.unitLabel,
		});
	}, [record]);

	const [yeuCauTraPhi, setYeuCauTraPhi] = useState<boolean>(recordDichVu?.thongTinThuTuc?.yeuCauTraPhi ?? false);

	const [choPhepGuiNhieuLan, setChoPhepGuiNhieuLan] = useState<boolean>(
		recordDichVu?.thongTinThuTuc?.choPhepGuiNhieuLan ?? false,
	);

	const [tinhTienTheoSoLuong, setTinhTienTheoSoLuong] = useState<boolean>(
		recordDichVu?.thongTinThuTuc?.tinhTienTheoSoLuong ?? false,
	);

	const buildUpLoadFile = async (values: any, name: string) => {
		if (values?.[name]?.fileList?.[0]?.originFileObj) {
			const response = await uploadFile({
				file: values?.[name]?.fileList?.[0]?.originFileObj,
				// filename: values?.[name]?.fileList?.[0]?.name?.split('.')?.[0] ?? 'fileName',
				public: '1',
			});
			return {
				...response?.data?.data?.file,
				url: response?.data?.data?.url,
			};
		} else return values?.[name]?.fileList?.[0]?.url ? recordDichVu?.[name] : {};
	};

	// @ts-ignore
	return (
		<Card title={edit ? 'Chỉnh sửa thông tin chung' : 'Thêm mới thông tin chung'}>
			<Form
				scrollToFirstError
				labelCol={{ span: 24 }}
				onFinish={async (values) => {
					console.log('value', values);
					values.fileMau = await buildUpLoadFile(values, 'fileMau');
					values.fileTraLoi = await buildUpLoadFile(values, 'fileTraLoi');
					setRecord({
						...recordDichVu,
						...values,
						thongTinThuTuc: {
							...values?.thongTinThuTuc,
							yeuCauTraPhi,
							tinhTienTheoSoLuong,
							choPhepGuiNhieuLan,
							maLePhi: record?.code,
							idNguonThu: recordProduct?.nguonThu,
							// idKhoanThu:danhSach?.find((items)=>{return items?._id===values?.idKhoanThu})?.name,
							coQuanCoThamQuyen:
								values?.thongTinThuTuc?.coQuanCoThamQuyen?.length > 0
									? values?.thongTinThuTuc?.coQuanCoThamQuyen?.join(', ')
									: undefined,
						},
						thongTinHoSo: values?.thongTinHoSo ?? '',
						thongTinQuyTrinh: values?.thongTinQuyTrinh ?? '',
						thongTinYeuCau: values?.thongTinYeuCau ?? '',
						ten: values?.ten,
						ghiChu: values?.ghiChu,
						moTa: values?.moTa,
						thoiHanBatDauThaoTac: values?.thoiHanBatDauThaoTac,
						traKetQua: taoLichHen ? true : false,
					});
					setCurrent(1);
				}}
				form={form}
			>
				<h3 style={{ fontWeight: 'bold' }}>Thông tin thủ tục</h3>
				<Row gutter={[20, 0]}>
					<Col xs={24}>
						<Form.Item
							name='ten'
							label='Tên biểu mẫu'
							initialValue={recordDichVu?.ten}
							rules={[...rules.required, ...rules.text, ...rules.length(100)]}
						>
							<Input placeholder='Tên biểu mẫu' />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item
							name='ghiChu'
							label='Ghi chú'
							initialValue={recordDichVu?.ghiChu}
							rules={[...rules.text, ...rules.length(200)]}
						>
							<Input.TextArea placeholder='Ghi chú' />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item
							name='moTa'
							label='Mô tả'
							initialValue={recordDichVu?.moTa}
							rules={[...rules.text, ...rules.length(512)]}
						>
							<Input.TextArea placeholder='Mô tả' />
						</Form.Item>
					</Col>
					<Col md={12}>
						<Form.Item
							// rules={[...rules.fileName]}
							name='fileMau'
							label='Biểu mẫu đơn'
							initialValue={
								recordDichVu?.fileMau?.url
									? renderFileListUrlWithName(recordDichVu?.fileMau?.url, recordDichVu?.fileMau?.filename)
									: { fileList: [] }
							}
						>
							<UploadFile
								otherProps={{
									maxCount: 1,
									accept: '.docx',
									multiple: false,
									showUploadList: { showDownloadIcon: false },
								}}
							/>
						</Form.Item>
					</Col>
					<Col md={12}>
						<Form.Item
							// rules={[...rules.fileName]}
							name='fileTraLoi'
							label='Biểu mẫu kết quả'
							initialValue={
								recordDichVu?.fileTraLoi?.url
									? renderFileListUrlWithName(recordDichVu?.fileTraLoi?.url, recordDichVu?.fileTraLoi?.filename)
									: { fileList: [] }
							}
						>
							<UploadFile
								otherProps={{
									maxCount: 1,
									accept: '.docx',
									multiple: false,
									showUploadList: { showDownloadIcon: false },
								}}
							/>
						</Form.Item>
					</Col>

					<>
						<Col md={12}>
							<Form.Item
								initialValue={recordDichVu?.phamVi ?? 'Tất cả'}
								rules={[...rules.required]}
								name='phamVi'
								label='Phạm vi'
							>
								<Select onChange={(val: string) => setPhamVi(val)} placeholder='Phạm vi'>
									{/*{['Tất cả', 'Hình thức đào tạo'].map((item) => (*/}
									{/*  <Select.Option key={item} value={item}>*/}
									{/*    {item}*/}
									{/*  </Select.Option>*/}
									{/*))}*/}
									{['Tất cả'].map((item) => (
										<Select.Option key={item} value={item}>
											{item}
										</Select.Option>
									))}
								</Select>
							</Form.Item>
						</Col>

						{phamVi === 'Hình thức đào tạo' && (
							<Col md={12}>
								<Form.Item
									initialValue={recordDichVu?.hinhThucDaoTaoId}
									rules={[...rules.required]}
									name='hinhThucDaoTaoId'
									label='Hình thức đào tạo'
								>
									{/*<Select placeholder="Hình thức đào tạo">*/}
									{/*  /!*{danhSachHinhThucDaoTao?.map((item) => (*!/*/}
									{/*  /!*  <Select.Option key={item._id} value={item._id}>*!/*/}
									{/*  /!*    {item.danhMucHTDT.ten}*!/*/}
									{/*  /!*  </Select.Option>*!/*/}
									{/*  /!*))}*!/*/}
									{/*</Select>*/}
									<SelectHinhThuc />
								</Form.Item>
							</Col>
						)}
					</>

					<Col md={12}>
						<Form.Item
							name={['thongTinThuTuc', 'maThuTuc']}
							label='Mã thủ tục'
							initialValue={recordDichVu?.thongTinThuTuc?.maThuTuc}
							rules={[...rules.text, ...rules.length(200)]}
						>
							<Input placeholder='Mã thủ tục' />
						</Form.Item>
					</Col>
					<Col md={12}>
						<Form.Item
							name={['thongTinThuTuc', 'linhVuc']}
							label='Lĩnh vực'
							initialValue={recordDichVu?.thongTinThuTuc?.linhVuc}
							rules={[...rules.text, ...rules.length(200)]}
						>
							<Input placeholder='Lĩnh vực' />
						</Form.Item>
					</Col>
					<Col md={12}>
						<Form.Item
							name={['thongTinThuTuc', 'capDo']}
							label='Cấp độ'
							initialValue={recordDichVu?.thongTinThuTuc?.capDo}
							rules={[...rules.text, ...rules.length(200)]}
						>
							<Input placeholder='Cấp độ' />
						</Form.Item>
					</Col>
					<Col md={12}>
						<Form.Item
							name={['thongTinThuTuc', 'thoiHanGiaiQuyet']}
							label='Thời hạn giải quyết'
							initialValue={recordDichVu?.thongTinThuTuc?.thoiHanGiaiQuyet}
							rules={[...rules.text, ...rules.length(200)]}
						>
							<Input placeholder='Thời hạn giải quyết' />
						</Form.Item>
					</Col>

					{/*<Col md={12}>*/}
					{/*  <Form.Item*/}
					{/*    name={['thongTinThuTuc', 'coQuanCoThamQuyen']}*/}
					{/*    label="Cơ quan có thẩm quyền"*/}
					{/*    initialValue={recordDichVu?.thongTinThuTuc?.coQuanCoThamQuyen?.split(', ')}*/}
					{/*  >*/}
					{/*    <Select placeholder="Cơ quan có thẩm quyền" allowClear showSearch mode="multiple">*/}
					{/*      /!*{danhSach?.map((item: DonVi.Record) => (*!/*/}
					{/*      /!*  <Select.Option key={item._id} value={item.ten}>*!/*/}
					{/*      /!*    {item?.ten}*!/*/}
					{/*      /!*  </Select.Option>*!/*/}
					{/*      /!*))}*!/*/}
					{/*    </Select>*/}
					{/*  </Form.Item>*/}
					{/*</Col>*/}
					<Col md={12}>
						<Form.Item
							name={['thongTinThuTuc', 'phamViPhucVu']}
							label='Phạm vi phục vụ'
							initialValue={recordDichVu?.thongTinThuTuc?.phamViPhucVu}
							rules={[...rules.text, ...rules.length(200)]}
						>
							<Input placeholder='Phạm vi phục vụ' />
						</Form.Item>
					</Col>
					<Col md={12}>
						<Form.Item
							name={['thongTinThuTuc', 'ketQuaThucHien']}
							label='Kết quả thực hiện'
							initialValue={recordDichVu?.thongTinThuTuc?.ketQuaThucHien}
							rules={[...rules.text, ...rules.length(200)]}
						>
							<Input placeholder='Kết quả thực hiện' />
						</Form.Item>
					</Col>
					<Col md={12}>
						<Form.Item
							name={['thongTinThuTuc', 'mauBieu']}
							label='Mẫu biểu'
							initialValue={recordDichVu?.thongTinThuTuc?.mauBieu}
							rules={[...rules.text, ...rules.length(200)]}
						>
							<Input placeholder='Mẫu biểu' />
						</Form.Item>
					</Col>
					{/*<Col md={12}>*/}
					{/*  <Form.Item*/}
					{/*    name={'thoiHanBatDauThaoTac'}*/}
					{/*    label="Thời hạn bắt đầu thao tác"*/}
					{/*    initialValue={recordDichVu?.thoiHanBatDauThaoTac ?? 'Bắt đầu thao tác'}*/}
					{/*    rules={[...rules.required]}*/}
					{/*  >*/}
					{/*    <Select onChange={(val: string) => {}} placeholder="Thời hạn bắt đầu thao tác">*/}
					{/*      <Select.Option value={'Bắt đầu thao tác'}>Bắt đầu thao tác</Select.Option>*/}
					{/*      <Select.Option value={'Bắt đầu xử lý'}>Bắt đầu xử lý</Select.Option>*/}
					{/*    </Select>*/}
					{/*  </Form.Item>*/}
					{/*</Col>*/}
					{/*<Col md={12}>*/}
					{/*  <Form.Item*/}
					{/*    name={'maDichVu'}*/}
					{/*    label="Mã dịch vụ"*/}
					{/*    initialValue={recordDichVu?.maDichVu}*/}
					{/*    rules={[...rules.text, ...rules.length(200)]}*/}
					{/*  >*/}
					{/*    <Input placeholder="Mã dịch vụ" />*/}
					{/*  </Form.Item>*/}
					{/*</Col>*/}
					<Col xs={24}>
						<Form.Item
							name={['thongTinThuTuc', 'luuY']}
							label='Lưu ý'
							initialValue={recordDichVu?.thongTinThuTuc?.luuY}
							rules={[...rules.text, ...rules.length(200)]}
						>
							<Input placeholder='Lưu ý' />
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={[20, 0]}>
					<Col md={8}>
						<Form.Item
							name={['thongTinThuTuc', 'yeuCauTraPhi']}
							initialValue={recordDichVu?.thongTinThuTuc?.yeuCauTraPhi}
						>
							<Checkbox
								checked={yeuCauTraPhi}
								onChange={(e) => {
									setYeuCauTraPhi(e.target.checked);
								}}
							/>{' '}
							Yêu cầu trả phí
						</Form.Item>
					</Col>

					<Col md={8}>
						<Form.Item
							name={['thongTinThuTuc', 'choPhepGuiNhieuLan']}
							initialValue={recordDichVu?.thongTinThuTuc?.choPhepGuiNhieuLan}
						>
							<Checkbox
								checked={choPhepGuiNhieuLan}
								onChange={(e) => {
									setChoPhepGuiNhieuLan(e.target.checked);
								}}
							/>{' '}
							Cho phép gửi đơn nhiều lần
						</Form.Item>
					</Col>
					<Col md={8}>
						<Checkbox
							onChange={(e) => {
								setTaoLichHen(e.target.checked);
							}}
							checked={taoLichHen}
						>
							Tạo lịch hẹn trả đơn
						</Checkbox>
					</Col>
					{yeuCauTraPhi && (
						<>
							<Col span={24}>
								<Form.Item
									name={['thongTinThuTuc', 'tinhTienTheoSoLuong']}
									initialValue={recordDichVu?.thongTinThuTuc?.tinhTienTheoSoLuong}
								>
									<Checkbox
										checked={tinhTienTheoSoLuong}
										onChange={(e) => {
											setTinhTienTheoSoLuong(e.target.checked);
										}}
									/>{' '}
									Tính tiền theo số lượng
								</Form.Item>
							</Col>
							<Col md={8}>
								<Form.Item
									name={['thongTinThuTuc', 'idKhoanThu']}
									label='Chọn lệ phí'
									rules={[...rules.required]}
									initialValue={recordDichVu?.thongTinThuTuc?.idKhoanThu}
								>
									{/*<Select*/}
									{/*  onChange={(val) => {*/}
									{/*    const recordProdTemp = danhSach.find((item) => item._id === val);*/}
									{/*    if (val) {*/}
									{/*      setRecordProduct(recordProdTemp);*/}
									{/*      setConditionMucThu({ product: val, active: true })*/}
									{/*    }*/}
									{/*    form.setFieldsValue({*/}
									{/*      maLePhi: undefined,*/}
									{/*      donViTinh: recordProdTemp?.unitLabel,*/}
									{/*    });*/}
									{/*  }}*/}
									{/*  placeholder="Chọn lệ phí"*/}
									{/*  options={danhSach.map((item) => ({ label: item.name, value: item._id }))}*/}
									{/*/>*/}
									<SelectKhoanThu
										onChange={(val) => {
											const recordProdTemp = danhSach.find((item) => item._id === val);
											if (val) {
												setRecordProduct(recordProdTemp);
												setConditionMucThu({ product: val, active: true });
											}
											form.setFieldsValue({
												maLePhi: undefined,
												donViTinh: recordProdTemp?.unitLabel,
											});
										}}
										initCondition={{ 'metaData.service': 'DVMC' }}
									/>
								</Form.Item>
							</Col>

							<Col md={8}>
								<Form.Item
									initialValue={recordDichVu?.thongTinThuTuc?.idMucThu}
									rules={[...rules.required]}
									name={['thongTinThuTuc', 'idMucThu']}
									label='Chọn mức giá'
								>
									{/*<Select*/}
									{/*  notFoundContent={loadingMucThu && <Spin spinning />}*/}
									{/*  placeholder="Chọn mức giá"*/}
									{/*  options={danhSachMucThu?.map((item) => ({*/}
									{/*    label: `${currencyFormat(item.unitAmount)} ${item.currency}`,*/}
									{/*    value: item._id,*/}
									{/*  }))}*/}
									{/*/>*/}
									<SelectMucThu condition={conditionMucThu} isGetId />
								</Form.Item>
							</Col>

							<Col md={8}>
								<Form.Item
									name='donViTinh'
									label='Đơn vị tính'
									initialValue={recordProduct?.unitLabel}
									rules={[...rules.required]}
								>
									<Input placeholder='Hãy chọn mức lệ phí' readOnly />
								</Form.Item>
							</Col>
						</>
					)}
					{taoLichHen && (
						<Col md={24}>
							<Form.Item
								name='soNgayHen'
								label='Số ngày hẹn'
								rules={[...rules.required, ...rules.number(10000, 1)]}
								initialValue={recordDichVu?.soNgayHen}
							>
								<InputNumber style={{ width: '100%' }} placeholder='Nhập số ngày hẹn' min={1} max={10000} />
							</Form.Item>
						</Col>
					)}
					<Col span={24}>
						<Form.Item
							name='cauTraLoiMacDinh'
							label='Câu trả lời mặc định'
							rules={[...rules.text]}
							initialValue={recordDichVu?.cauTraLoiMacDinh}
						>
							<Input.TextArea placeholder='Câu trả lời mặc định' />
						</Form.Item>
					</Col>
					{/*<Col md={24}>*/}
					{/*  <Form.Item*/}
					{/*    name={['thongTinThuTuc', 'donViThucHien']}*/}
					{/*    label="Đơn vị thực hiện"*/}
					{/*    initialValue={recordDichVu?.thongTinThuTuc?.donViThucHien}*/}
					{/*    rules={[...rules.text, ...rules.length(200)]}*/}
					{/*  >*/}
					{/*    /!*<Input placeholder="Đơn vị thực hiện" />*!/*/}
					{/*    <TinyEditor height={300}/>*/}
					{/*  </Form.Item>*/}
					{/*</Col>*/}
				</Row>
				<h3 style={{ fontWeight: 'bold' }}>Đơn vị thực hiện</h3>
				<Row>
					<Col md={24}>
						<Form.Item
							name={['thongTinThuTuc', 'donViThucHien']}
							label=''
							initialValue={recordDichVu?.thongTinThuTuc?.donViThucHien}
							rules={[...rules.text, ...rules.length(550)]}
						>
							{/*<Input placeholder="Đơn vị thực hiện" />*/}
							<TinyEditor height={300} stickyToolbar={false} />
						</Form.Item>
					</Col>
				</Row>
				<h3 style={{ fontWeight: 'bold' }}>Thông tin hồ sơ</h3>
				<Row>
					<Col span={24}>
						<Form.Item
							name='thongTinHoSo'
							label=''
							initialValue={recordDichVu?.thongTinHoSo ?? ''}
							// rules={[...rules.text]}
						>
							<TinyEditor height={350} stickyToolbar={false} />
						</Form.Item>
					</Col>
				</Row>
				<h3 style={{ fontWeight: 'bold' }}>Quy trình thực hiện</h3>
				<Row>
					<Col span={24}>
						<Form.Item
							name='thongTinQuyTrinh'
							label=''
							initialValue={recordDichVu?.thongTinQuyTrinh ?? ''}
							// rules={[...rules.text]}
						>
							<TinyEditor height={350} stickyToolbar={false} />
						</Form.Item>
					</Col>
				</Row>
				<h3 style={{ fontWeight: 'bold' }}>Yêu cầu</h3>
				<Row>
					<Col span={24}>
						<Form.Item
							name='thongTinYeuCau'
							label=''
							initialValue={recordDichVu?.thongTinYeuCau ?? ''}
							// rules={[...rules.text]}
						>
							<TinyEditor height={350} stickyToolbar={false} />
						</Form.Item>
					</Col>
				</Row>

				<Form.Item style={{ textAlign: 'center', marginBottom: 0, position: 'fixed', top: 14, right: 48 }}>
					<Button
						icon={<ArrowRightOutlined />}
						loading={loading}
						style={{ marginRight: 8 }}
						htmlType='submit'
						type='primary'
					>
						Tiếp theo
					</Button>
				</Form.Item>
			</Form>
		</Card>
	);
};

export default FormThongTinChung;
