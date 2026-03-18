import { Button, Card, Col, Form, Row } from 'antd';
import SelectSinhVienDebounce from '@/pages/DaoTaoV2/SinhVien/component/Select';
import type { SinhVien } from '@/services/DaoTaoV2/SinhVien/typings';
import MyDatePicker from '@/components/MyDatePicker';
import { useModel } from 'umi';
import { useEffect, useState } from 'react';
import { resetFieldsForm } from '@/utils/utils';
import dayjs from 'dayjs';
import rules from '@/utils/rules';
import { ETrangThaiThamGia } from '@/services/SuKienV2/constant';

const FormThemMoiSinhVien = (props: { getData?: () => void; type?: 'Đăng ký' | 'Tham gia' }) => {
	const [form] = Form.useForm();
	const { edit, putModel, postModel, record, setVisibleForm, visibleForm, getModel } = useModel('sinhviensukien');
	const { record: recSuKien } = useModel('sukienv2');
	const { getOneModel: getOneDotDRL } = useModel('diemrenluyen.dot');
	const [dataDotHienTai, setDataDotHienTai] = useState<DotChamDiemRenLuyen.IRecord>();

	const getDataDot = async () => {
		try {
			getOneDotDRL({
				'thoiGianTiepNhanMinhChung.thoiGianBatDau': { $lte: dayjs().toISOString() },
				'thoiGianTiepNhanMinhChung.thoiGianKetThuc': { $gte: dayjs().toISOString() },
			}).then((res) => {
				setDataDotHienTai(res);
			});
		} catch (e) {
			console.log(e);
		}
	};

	const onFinish = async (values: any) => {
		try {
			const payload = {
				...values,
				idSuKien: recSuKien?._id,
				loaiQR: props?.type ?? 'Đăng ký',
				trangThaiThamGia: ETrangThaiThamGia.XAC_NHAN,
				idDotChamDiem: dataDotHienTai?._id,
			};

			if (edit) {
				putModel(record?._id ?? '', { ...payload }, () => {
					if (props?.getData) {
						props?.getData();
					} else getModel();
				});
			} else {
				postModel({ ...payload }, () => {
					if (props?.getData) {
						props?.getData();
					} else getModel();
				});
			}
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form, { thoiGian: dayjs().toISOString() });
		else if (record?._id) form.setFieldsValue({ ...record, thoiGian: record?.thoiGian ?? dayjs().toISOString() });
	}, [visibleForm]);

	useEffect(() => {
		if (props?.type === 'Tham gia') {
			getDataDot();
		}
	}, [props?.type]);

	return (
		<Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
			<Form form={form} layout={'vertical'} onFinish={onFinish}>
				<Row gutter={[12, 12]}>
					<Col span={24}>
						<Form.Item name='tenSv' hidden />
						<Form.Item name='maSv' hidden />
						<Form.Item name='ssoId' label='Sinh viên' rules={[...rules.required]}>
							<SelectSinhVienDebounce
								onChange={(val, option) => {
									const rawData: SinhVien.IRecord = option?.rawData as SinhVien.IRecord;
									form.setFieldsValue({
										tenSv: rawData?.ten,
										maSv: rawData?.ma,
									});
								}}
							/>
						</Form.Item>
					</Col>
					{props?.type === 'Đăng ký' && (
						<>
							<Col span={24}>
								<Form.Item name={'thoiGian'} label={'Thời gian đăng ký'} rules={[...rules.required]}>
									<MyDatePicker format={'HH:mm DD/MM/YYYY'} showTime={{ showHour: true, showMinute: true }} />
								</Form.Item>
							</Col>
						</>
					)}
					{props?.type === 'Tham gia' && (
						<>
							<Col span={12}>
								<Form.Item name={'thoiGianCheckIn'} label={'Thời gian checkin'} rules={[...rules.required]}>
									<MyDatePicker format={'HH:mm DD/MM/YYYY'} showTime={{ showHour: true, showMinute: true }} />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item name={'thoiGianCheckOut'} label={'Thời gian checkout'}>
									<MyDatePicker format={'HH:mm DD/MM/YYYY'} showTime={{ showHour: true, showMinute: true }} />
								</Form.Item>
							</Col>
						</>
					)}
				</Row>
				<Form.Item>
					<div className='form-footer'>
						<Button type={'primary'} htmlType={'submit'}>
							{edit ? 'Lưu' : 'Thêm mới'}
						</Button>
						<Button
							onClick={() => {
								setVisibleForm(false);
							}}
						>
							Đóng
						</Button>
					</div>
				</Form.Item>
			</Form>
		</Card>
	);
};
export default FormThemMoiSinhVien;
