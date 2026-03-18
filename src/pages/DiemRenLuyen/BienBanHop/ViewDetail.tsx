import MyDatePicker from '@/components/MyDatePicker';
import TinyEditor from '@/components/TinyEditor';
import SelectNhanSuDebounce from '@/pages/ToChucNhanSu/NhanSu/SelectNhanSuDebounce';

import {
	ETrangThaiDuyetBienBanHopDiemRenLuyen,
	MapKeyColorTrangThaiDuyetBienBanHopDiemRenLuyen,
} from '@/services/DiemRenLuyen/BienBanHop/constant';
import rules from '@/utils/rules';
import { ArrowLeftOutlined, CheckOutlined, DownloadOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, InputNumber, Modal, Row, Tag } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import SelectDotDiemRenLuyen from '../Dot/Select';
import StepDotChamDiemRenLuyen from '../Dot/Step';
import FormYeuCauChinhSua from './FormYeuCauChinhSua';

const ViewDetailBienBanHopDrl = (props: { tenLop?: string; idLop?: string; getData?: any }) => {
	const intl = useIntl();
	const {
		getAllModel,
		loading,
		record,
		putModel,
		exportBienBanHopModel,
		visibleFormYeuCauChinhSua,
		setVisibleFormYeuCauChinhSua,
	} = useModel('diemrenluyen.bienbanhop');
	const { record: recDot, setRecord: setRecDot } = useModel('diemrenluyen.dot');
	const [form] = Form.useForm();
	const soVangMat = Form.useWatch('soVangMat', form);
	const getData = () => {
		if (props?.tenLop && recDot?._id)
			getAllModel(true, undefined, { tenLopHC: props?.tenLop, dotChamDiemId: recDot?._id });
	};

	useEffect(() => {
		if (record?._id) form.setFieldsValue(record);
	}, [record?._id]);

	useEffect(() => {
		getData();
	}, [props?.tenLop, recDot?._id]);

	const handleGuiBienBanHop = async (trangThaiDuyet: ETrangThaiDuyetBienBanHopDiemRenLuyen) => {
		const payload = {
			...record,
			trangThaiDuyet,
		};
		if (record?._id) {
			putModel(record._id, payload, props.getData);
		}
	};

	const disableForm = true;

	return (
		<>
			<StepDotChamDiemRenLuyen />
			<Form style={{ maxWidth: 1000, margin: '0 auto' }} form={form} labelCol={{ span: 24 }}>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						marginBottom: 12,
					}}
				>
					<div>
						{props.tenLop && (
							<SelectDotDiemRenLuyen
								style={{ width: 300 }}
								value={recDot?._id}
								onChange={(val, option) => {
									const rawData = option?.rawData;
									setRecDot(rawData);
								}}
								isSetRecord={true}
							/>
						)}
						{record?._id && (
							<Button
								style={{ marginLeft: 8 }}
								onClick={() => {
									exportBienBanHopModel(record?._id ?? '', props?.tenLop ?? '', recDot?.tenDot ?? '');
								}}
								loading={loading}
								icon={<DownloadOutlined />}
								type='primary'
							>
								{intl.formatMessage({ id: 'lophanhchinh.bienban.button.taibienban' })}
							</Button>
						)}
					</div>
					<div style={{ fontSize: 16, fontWeight: 'bold' }}>
						{intl.formatMessage({ id: 'lophanhchinh.bienban.trangthai' })}:{' '}
						<Tag
							color={
								MapKeyColorTrangThaiDuyetBienBanHopDiemRenLuyen[
									record?.trangThaiDuyet ?? ETrangThaiDuyetBienBanHopDiemRenLuyen.CHUA_GUI
								]
							}
						>
							{record?.trangThaiDuyet ?? ETrangThaiDuyetBienBanHopDiemRenLuyen.CHUA_GUI}
						</Tag>
					</div>
				</div>
				{record?.trangThaiDuyet === ETrangThaiDuyetBienBanHopDiemRenLuyen.YEU_CAU_CHINH_SUA &&
					record?.noiDungYeuCauChinhSua && (
						<div>
							<b>{intl.formatMessage({ id: 'lophanhchinh.bienban.yccs' })}:</b> {record?.noiDungYeuCauChinhSua ?? ''}
						</div>
					)}
				<Row gutter={[16, 0]}>
					<Col xs={24} sm={24} md={8}>
						<Form.Item
							name='thoiGian'
							label={intl.formatMessage({ id: 'lophanhchinh.bienban.thoigian' })}
							rules={[...rules.required]}
						>
							<MyDatePicker
								disabled={disableForm}
								format={'HH:mm DD/MM/YYYY'}
								placeholder='Thời gian họp'
								showTime={{ showHour: true, showMinute: true }}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} sm={24} md={8}>
						<Form.Item
							name='diaDiem'
							label={intl.formatMessage({ id: 'lophanhchinh.bienban.diadiem' })}
							rules={[...rules.required]}
						>
							<Input
								disabled={disableForm}
								placeholder={intl.formatMessage({ id: 'lophanhchinh.bienban.diadiem.place' })}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} sm={24} md={8}>
						<Form.Item
							name={['chuTri', 'ssoId']}
							label={intl.formatMessage({ id: 'lophanhchinh.bienban.chutri' })}
							rules={[...rules.required]}
						>
							<SelectNhanSuDebounce disabled />
						</Form.Item>
					</Col>
					<Col xs={24} sm={24} md={8}>
						<Form.Item
							name={['thuKy', 'ten']}
							label={intl.formatMessage({ id: 'lophanhchinh.bienban.thuky' })}
							rules={[...rules.required]}
						>
							<Input disabled placeholder={intl.formatMessage({ id: 'lophanhchinh.bienban.thuky.place' })} />
						</Form.Item>
					</Col>
					<Col xs={24} sm={24} md={8}>
						<Form.Item
							name='soCoMat'
							label={intl.formatMessage({ id: 'lophanhchinh.bienban.socomat' })}
							rules={[...rules.required]}
						>
							<InputNumber
								disabled={disableForm}
								style={{ width: '100%' }}
								min={0}
								max={1000}
								placeholder={intl.formatMessage({ id: 'lophanhchinh.bienban.socomat.place' })}
								addonAfter='Sinh viên'
							/>
						</Form.Item>
					</Col>
					<Col xs={24} sm={24} md={8}>
						<Form.Item
							name='soVangMat'
							label={intl.formatMessage({ id: 'lophanhchinh.bienban.sovangmat' })}
							rules={[...rules.required]}
						>
							<InputNumber
								disabled={disableForm}
								style={{ width: '100%' }}
								placeholder={intl.formatMessage({ id: 'lophanhchinh.bienban.sovangmat.place' })}
								min={0}
								max={1000}
								addonAfter='Sinh viên'
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							tooltip={{
								title: intl.formatMessage({ id: 'lophanhchinh.bienban.svvang.tooltip' }),
								overlayStyle: { maxWidth: '340px' },
							}}
							name='sinhVienVang'
							label={intl.formatMessage({ id: 'lophanhchinh.bienban.svvang' })}
							rules={soVangMat && soVangMat > 0 ? [...rules.requiredHtml] : undefined}
						>
							<TinyEditor disabled={disableForm} height={600} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							name='yKien'
							label={intl.formatMessage({ id: 'lophanhchinh.bienban.ykien' })}
							rules={[...rules.required, ...rules.text]}
						>
							<Input.TextArea
								disabled={disableForm}
								placeholder={intl.formatMessage({ id: 'lophanhchinh.bienban.ykien.place' })}
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							name='kienNghiDeXuat'
							label={intl.formatMessage({ id: 'lophanhchinh.bienban.khuyennghi' })}
							rules={[...rules.text]}
						>
							<Input.TextArea
								disabled={disableForm}
								placeholder={intl.formatMessage({ id: 'lophanhchinh.bienban.khuyennghi.place' })}
							/>
						</Form.Item>
					</Col>
				</Row>

				<div
					style={{
						width: '100%',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						gap: 8,
					}}
				>
					{record?._id &&
						[
							ETrangThaiDuyetBienBanHopDiemRenLuyen.DA_DUYET,
							ETrangThaiDuyetBienBanHopDiemRenLuyen.YEU_CAU_CHINH_SUA,
						].includes(record.trangThaiDuyet) && (
							<Button
								icon={<ArrowLeftOutlined />}
								type='primary'
								onClick={() => handleGuiBienBanHop(ETrangThaiDuyetBienBanHopDiemRenLuyen.CHO_DUYET)}
								loading={loading}
							>
								{intl.formatMessage({ id: 'lophanhchinh.bienban.button.chuyenchoduyet' })}
							</Button>
						)}
					{record?._id &&
						[
							ETrangThaiDuyetBienBanHopDiemRenLuyen.CHO_DUYET,
							ETrangThaiDuyetBienBanHopDiemRenLuyen.YEU_CAU_CHINH_SUA,
						].includes(record.trangThaiDuyet) && (
							<>
								<Button
									icon={<CheckOutlined />}
									disabled={record?.trangThaiDuyet === ETrangThaiDuyetBienBanHopDiemRenLuyen.DA_DUYET}
									type='primary'
									onClick={() => handleGuiBienBanHop(ETrangThaiDuyetBienBanHopDiemRenLuyen.DA_DUYET)}
									loading={loading}
								>
									{intl.formatMessage({ id: 'lophanhchinh.bienban.button.xacnhan' })}
								</Button>
								<Button
									icon={<EditOutlined />}
									disabled={record?.trangThaiDuyet === ETrangThaiDuyetBienBanHopDiemRenLuyen.DA_DUYET}
									onClick={() => setVisibleFormYeuCauChinhSua(true)}
									loading={loading}
								>
									{intl.formatMessage({ id: 'lophanhchinh.bienban.button.yccs' })}
								</Button>
							</>
						)}
				</div>
			</Form>
			<Modal
				styles={{ body: { padding: 0 } }}
				open={visibleFormYeuCauChinhSua}
				footer={null}
				onCancel={() => setVisibleFormYeuCauChinhSua(false)}
			>
				<FormYeuCauChinhSua
					getData={() => {
						getData();
						if (props.getData) getData();
					}}
				/>
			</Modal>
		</>
	);
};

export default ViewDetailBienBanHopDrl;
