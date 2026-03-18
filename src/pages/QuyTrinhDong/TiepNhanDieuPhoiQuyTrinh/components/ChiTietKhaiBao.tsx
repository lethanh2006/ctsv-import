import ViewResult from '@/pages/QuyTrinhDong/TiepNhanDieuPhoiQuyTrinh/components/ViewResult';
import type { TrangThaiTiepNhan } from '@/services/QuyTrinhDong/TiepNhanDeuPhoi/constants';
import {
	MapColorTrangThaiTiepNhan,
	TrangThaiKhaiBao,
	TrangThaiTiepNhanDon,
} from '@/services/QuyTrinhDong/TiepNhanDeuPhoi/constants';
import { chuyenVienTiepNhanDuyet } from '@/services/QuyTrinhDong/TiepNhanDeuPhoi/donquytrinh';
import type { KhaiBaoQuyTrinh } from '@/services/QuyTrinhDong/TiepNhanDeuPhoi/typing';
import { CheckOutlined, CloseOutlined, UndoOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, message, Modal, Row, Spin, Steps, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ThongTinTiepNhan from './thongTinTiepNhan';
const { TextArea } = Input;
const { Step } = Steps;
interface IProps {
	dataQuyTrinh?: any;
	type?: 'dieu_phoi' | 'tiep_nhan';
}
const ChiTietKhaiBao = (props: IProps) => {
	const { dataQuyTrinh } = props;
	const [currentStep, setCurrentStep] = useState<number>(0);
	const [loadingForm, setLoadingForm] = useState<boolean>(false);
	const [visibleDuyet, setVisibleDuyet] = useState<boolean>(false);
	const [currentTypeDuyet, setCurrentTypeDuyet] = useState<TrangThaiTiepNhanDon>(TrangThaiTiepNhanDon.DUYET);
	const { setDataQuyTrinh, setCurrent, setCurrentFormKhaiBao, current, setVisibleForm } =
		useModel('quytrinh.donquytrinh');
	const onChange = (val: number) => {
		setCurrentStep(val);
	};

	useEffect(() => {
		setDataQuyTrinh(dataQuyTrinh);
		setCurrent(dataQuyTrinh?.danhSachBuocXuLy?.[0]);
		const arr = dataQuyTrinh?.quyTrinh?.danhSachFormKhaiBao;
		const obj = arr?.find((item: { ma: any }) => item?.ma === dataQuyTrinh?.danhSachBuocXuLy?.[0]?.maFormKhaiBao);
		setCurrentFormKhaiBao(obj);
	}, []);
	const handleSubmitDon = async (values: any) => {
		try {
			const payload = {
				maBuoc: current?.ma,
				trangThaiTiepNhan: currentTypeDuyet,
				ghiChu: values?.ghiChu,
				// maBoPhanXuLyBuocSau: 'string',
			};
			const res = await chuyenVienTiepNhanDuyet(dataQuyTrinh?._id, payload);
			if (res) {
				message.success('Xử lý thành công');
				setVisibleDuyet(false);
			}
		} catch (e) {
			console.log(e);
		}
	};
	const renderDescription = (value: any) => {
		// if (current) {
		return (
			<>
				<div style={{ marginBottom: 8 }}>
					<Tag color={MapColorTrangThaiTiepNhan?.[value?.trangThaiTiepNhan as TrangThaiTiepNhan] ?? 'yellow'}>
						{value?.trangThaiTiepNhan}
					</Tag>
				</div>
				<div style={{ marginBottom: 8 }}>
					<Tag color={value?.coKhaiBao ? 'green' : 'yellow'}>
						{value?.coKhaiBao ? TrangThaiKhaiBao.DA_KHAI_BAO : TrangThaiKhaiBao.CHUA_KHAI_BAO}
					</Tag>
				</div>
				{/*{value?.daDienThongTin === false && (*/}
				{/*	<Button*/}
				{/*		onClick={() => {*/}
				{/*			// const arr = dataQuyTrinh?.quyTrinh?.danhSachFormKhaiBao;*/}
				{/*			// const obj = arr?.find((item) => item?.ma === current?.maFormKhaiBao);*/}
				{/*			// console.log('objjj', obj);*/}
				{/*			// setCurrentFormKhaiBao(obj);*/}
				{/*			// setVisibleFormKhaiBaoQuyTrinh(true);*/}
				{/*		}}*/}
				{/*	>*/}
				{/*		Hoàn thiện thông tin*/}
				{/*	</Button>*/}
				{/*)}*/}
			</>
		);
		// }
	};

	return (
		<>
			<Spin spinning={loadingForm}>
				<Row gutter={[16, 16]}>
					<Col xs={24} sm={24} md={6} lg={6} xl={6}>
						<Steps direction={'vertical'} current={currentStep} onChange={onChange}>
							{dataQuyTrinh?.danhSachBuocXuLy?.map((value) => {
								return (
									<Step
										key={value.ten}
										description={renderDescription(value)}
										// disabled={!edit}
										title={value?.ten}
										onClick={() => {
											setCurrent(value);
										}}
									/>
								);
							})}
						</Steps>
					</Col>
					<Col xs={24} sm={24} md={18} lg={18} xl={18}>
						<div style={{ marginBottom: 16 }}>
							<ThongTinTiepNhan data={current as KhaiBaoQuyTrinh.IBuocXuLy} />
						</div>
						<div>
							{dataQuyTrinh?.danhSachKhaiBao?.map((val: any) => {
								return <ViewResult danhSachKhaiBao={val} />;
							})}
						</div>
					</Col>
					{props?.type === 'tiep_nhan' && (
						<Col xs={24} sm={24} md={24} lg={24} xl={24}>
							<div style={{ display: 'flex', justifyContent: 'center' }}>
								<Button
									style={{ marginRight: 8 }}
									type={'primary'}
									icon={<CheckOutlined />}
									onClick={() => {
										setCurrentTypeDuyet(TrangThaiTiepNhanDon.DUYET);
										setVisibleDuyet(true);
									}}
								>
									Duyệt
								</Button>
								<Button
									style={{ marginRight: 8 }}
									danger
									icon={<CloseOutlined />}
									onClick={() => {
										setCurrentTypeDuyet(TrangThaiTiepNhanDon.KHONG_DUYET);
										setVisibleDuyet(true);
									}}
								>
									Không duyệt
								</Button>
								<Button
									style={{ marginRight: 8 }}
									icon={<UndoOutlined />}
									onClick={() => {
										setCurrentTypeDuyet(TrangThaiTiepNhanDon.CHINH_SUA_LAI);
										setVisibleDuyet(true);
									}}
								>
									Chỉnh sửa lại
								</Button>
								<Button
									onClick={() => {
										setVisibleForm(false);
									}}
								>
									Đóng
								</Button>
							</div>
						</Col>
					)}
				</Row>
			</Spin>
			<Modal
				title={'Xử lý đơn'}
				open={visibleDuyet}
				onCancel={() => {
					setVisibleDuyet(false);
				}}
				destroyOnClose
				footer={null}
			>
				<Form onFinish={handleSubmitDon} layout={'vertical'}>
					<Form.Item label={'Ghi chú'} name={'ghiChu'}>
						<TextArea rows={4} placeholder='Nhập ghi chú' />
					</Form.Item>
					<Form.Item>
						<div style={{ display: 'flex', justifyContent: 'center' }}>
							<Button style={{ marginRight: 8 }} type={'primary'} htmlType={'submit'}>
								Xác nhận
							</Button>
							<Button
								onClick={() => {
									setVisibleDuyet(false);
								}}
							>
								Đóng
							</Button>
						</div>
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};
export default ChiTietKhaiBao;
