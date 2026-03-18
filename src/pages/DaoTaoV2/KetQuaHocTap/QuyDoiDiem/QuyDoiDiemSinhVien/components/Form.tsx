import SelectHocPhanSinhVien from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/ChuongTrinhDaoTao/components/SelectHocPhanSinhVien';
import SelectSinhVienDebounce from '@/pages/DaoTaoV2/SinhVien/component/Select';

import type { DotQuyDoiDiem } from '@/services/DaoTaoV2/KetQuaHocTap/DotQuyDoiDiem/typing';
import { ETrangThaiSinhVienDot, colorTrangThaiSinhVienDot } from '@/services/DaoTaoV2/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Descriptions, Form, InputNumber, Row, Tag } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import FormItemMinhChungQuyDoi from '../../MinhChungQuyDoi/FormItemMinhChung';

const FormQuyDoiDiemSinhVien = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { title, getData } = props;
	const { formSubmiting, visibleForm, setVisibleForm, edit, postSinhVienQuyDoiModel, record, isView, putModel } =
		useModel('daotaov2.ketquahoctap.quydoidiem.quydoidiemsinhvien');
	const { record: recDot } = useModel('daotaov2.ketquahoctap.quydoidiem.dotquydoidiem');
	const { danhSach: danhSachSinhVien } = useModel('daotaov2.sinhvien.sinhvien');
	const ssoIdSinhVien = Form.useWatch('sinhVienSsoId', form);

	useEffect(() => {
		if (!visibleForm || isView) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm, isView]);

	const onChangeSinhVien = (ssoId?: string) => {
		const ns = danhSachSinhVien.find((item) => item.ssoId === ssoId);
		form.setFieldsValue({
			maSinhVien: ns?.ma,
			hoTen: ns?.ten,
		});
	};

	const onFinish = async (values: DotQuyDoiDiem.IQuyDoiDiemSinhVien) => {
		const data = {
			thongTinQuyDoiDiemSinhVien: {
				sinhVienSsoId: values.sinhVienSsoId,
				maHocPhan: values.maHocPhan,
				maSinhVien: values.maSinhVien,
				hoTen: values.hoTen,
				diemHe10: values.diemHe10,
			},
			danhSachMinhChung: values.danhSachMinhChungQuyDoi,
		};

		if (edit) {
			putModel(record?._id ?? '', values)
				.then(() => {
					if (getData) getData();
					setVisibleForm(false);
				})
				.catch((rec) => console.log(rec));
		} else {
			postSinhVienQuyDoiModel(recDot?._id ?? '', data)
				.then(() => {
					if (getData) getData();
					setVisibleForm(false);
				})
				.catch((rec) => console.log(rec));
		}
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : isView ? 'Chi tiết' : 'Thêm mới'} ${title?.toLocaleLowerCase() ?? ''}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					{isView ? (
						<Col xs={24}>
							<Descriptions column={{ xs: 1, sm: 1, md: 2 }}>
								<Descriptions.Item label='Tên sinh viên'>{record?.hoTen ?? ''}</Descriptions.Item>
								<Descriptions.Item label='Mã sinh viên'>{record?.maSinhVien ?? ''}</Descriptions.Item>
								<Descriptions.Item label='Học phần quy đổi'>
									{record?.maHocPhan ?? ''} - {record?.hocPhan.ten ?? ''} - {record?.hocPhan.soTinChi ?? ''}TC
								</Descriptions.Item>
								<Descriptions.Item label='Kết quả quy đổi'>
									{record?.diemHe10 ? `${record.diemHe10} điểm` : ''}
								</Descriptions.Item>

								{record?.trangThai === ETrangThaiSinhVienDot.DA_RA_QUYET_DINH ? (
									<>
										<Descriptions.Item label='Số quyết định'>{record?.soQuyetDinh}</Descriptions.Item>
										<Descriptions.Item label='Ngày ban hành'>
											{record.thoiGianBanHanh ? dayjs(record?.thoiGianBanHanh).format('DD/MM/YYYY') : ''}
										</Descriptions.Item>
									</>
								) : null}

								<Descriptions.Item label='Ý kiến phòng ban' span={2}>
									{record?.hoTenNguoiChoYKien ? (
										<>
											{record?.hoTenNguoiChoYKien}: {record?.ghiChu ?? <i>Không có ý kiến</i>}
											{record.thoiGianChoYKien
												? ` (${dayjs(record.thoiGianChoYKien).format('HH:mm DD/MM/YYYY')})`
												: ''}
										</>
									) : (
										<Tag color='blue'>Chưa cho ý kiến</Tag>
									)}
								</Descriptions.Item>
								<Descriptions.Item label='Trạng thái'>
									<Tag color={colorTrangThaiSinhVienDot[record?.trangThai as ETrangThaiSinhVienDot]}>
										{record?.trangThai ?? ''}
									</Tag>
								</Descriptions.Item>
							</Descriptions>
						</Col>
					) : (
						<>
							<Col xs={24} md={12}>
								<Form.Item name='sinhVienSsoId' label='Sinh viên' rules={[...rules.required]}>
									<SelectSinhVienDebounce onChange={(val) => onChangeSinhVien(val?.toString())} disabled={edit} />
								</Form.Item>
								<Form.Item name='maSinhVien' hidden />
								<Form.Item name='hoTen' hidden />
							</Col>

							<Col xs={24} md={12}>
								<Form.Item name='maHocPhan' label='Học phần quy đổi' rules={[...rules.required]}>
									<SelectHocPhanSinhVien ssoId={ssoIdSinhVien} selectMa disabled={!ssoIdSinhVien} />
								</Form.Item>
							</Col>

							<Col xs={24} md={12}>
								<Form.Item
									name='diemHe10'
									label='Điểm được quy đổi (hệ 10)'
									extra='Điểm hệ 4, điểm chữ được hệ thống tính tự động'
								>
									<InputNumber
										style={{ width: '100%' }}
										placeholder='Nhập số điểm được quy đổi (hệ 10)'
										min={0}
										max={10}
										step={0.25}
									/>
								</Form.Item>
							</Col>
						</>
					)}

					<Col xs={24}>
						<Form.Item name='danhSachMinhChungQuyDoi' rules={[...rules.required]}>
							<FormItemMinhChungQuyDoi getData={getData} />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button hidden={isView} loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit
							? `${intl.formatMessage({ id: 'global.button.themmoi' })}`
							: `${intl.formatMessage({ id: 'global.button.luulai' })}`}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>
						{isView ? 'Đóng' : intl.formatMessage({ id: 'global.button.huy' })}
					</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormQuyDoiDiemSinhVien;
