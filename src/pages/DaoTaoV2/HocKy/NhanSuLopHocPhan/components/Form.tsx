import SelectNhanSuDebounce from '@/pages/DaoTaoV2/ToChucNhanSu/NhanSu/Select';
import { type LopHocPhan } from '@/services/DaoTaoV2/HocKy/LopHocPhan/typing';
import { ELoaiPhanCongGiangDay, loaiPhanCongGiangDay } from '@/services/DaoTaoV2/HocKy/constant';
import { ELoaiHoSoNhanSu } from '@/services/DaoTaoV2/ToChucNhanSu/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row, Segmented } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormNsLopHocPhan = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, getModel, formSubmiting, visibleForm } = useModel(
		'daotaov2.hocky.nhansulophocphan',
	);
	const { record: recLopHocPhan } = useModel('daotaov2.hocky.lophocphan');
	const { danhSach: danhSachNhanSu } = useModel('daotaov2.tochucnhansu.nhansu');
	const { title } = props;
	const loaiNhanSu: ELoaiPhanCongGiangDay = Form.useWatch('loai', form) ?? ELoaiPhanCongGiangDay.CAN_BO;

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form, { loai: ELoaiPhanCongGiangDay.CAN_BO });
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const getData = () => getModel({ lopHocPhanId: recLopHocPhan?._id });

	const onFinish = async (values: LopHocPhan.IRecordNhanSuLopHP) => {
		if (edit) {
			putModel(record?._id ?? '', values, getData)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(
				{
					...values,
					lopHocPhanId: recLopHocPhan?._id ?? '',
				},
				getData,
			)
				.then()
				.catch((er) => console.log(er));
	};

	const onChangeNhanSu = (val: string) => {
		const ns = danhSachNhanSu.find((item) => item.ssoId === val);
		form.setFieldsValue({ maNhanSu: ns?.maCanBo, tenNhanSu: ns?.hoTen });
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col xs={24}>
						<Form.Item label='Lớp tín chỉ'>
							<Input disabled value={recLopHocPhan?.ten} />
						</Form.Item>
					</Col>

					<Col xs={24}>
						<Form.Item
							name='loai'
							label='Loại nhân sự'
							rules={[...rules.required]}
							initialValue={ELoaiPhanCongGiangDay.CAN_BO}
						>
							<Segmented
								options={Object.values(ELoaiPhanCongGiangDay).map((value) => ({
									value,
									label: loaiPhanCongGiangDay[value],
								}))}
							/>
						</Form.Item>
					</Col>

					<Col xs={24}>
						<Form.Item
							name='nhanSuSsoId'
							label='Nhân sự'
							// rules={[...rules.required]}
							// extra='Chọn từ danh sách giảng viên thuộc Bộ môn quản lý học phần'
						>
							{/* <SelectGiangVienDeCuong
                condition={{ deCuongId: recLopHocPhan?.hocPhan?.deCuongHienTaiId }}
              /> */}
							<SelectNhanSuDebounce
								maDonVi={recLopHocPhan?.hocPhan?.maDonVi}
								condition={{
									loaiHoSo:
										loaiNhanSu === ELoaiPhanCongGiangDay.THINH_GIANG
											? ELoaiHoSoNhanSu.THINH_GIANG
											: ELoaiHoSoNhanSu.CAN_BO,
								}}
								onChange={(val) => onChangeNhanSu(val as string)}
							/>
						</Form.Item>
					</Col>

					<Col xs={24}>
						<Form.Item
							name='maNhanSu'
							label='Mã giảng viên'
							rules={[...rules.required, ...rules.text, ...rules.length(20)]}
						>
							<Input placeholder='Nhập mã giảng viên' />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item
							name='tenNhanSu'
							label='Tên giảng viên'
							rules={[...rules.required, ...rules.text, ...rules.length(100)]}
						>
							<Input placeholder='Nhập tên giảng viên' />
						</Form.Item>
					</Col>

					{loaiNhanSu === ELoaiPhanCongGiangDay.THINH_GIANG ? (
						<Col xs={24}>
							<Form.Item
								name='ghiChuThinhGiang'
								label='Ghi chú thỉnh giảng'
								rules={[...rules.text, ...rules.length(1000)]}
							>
								<Input.TextArea placeholder='Nhập ghi chú' />
							</Form.Item>
						</Col>
					) : null}
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

export default FormNsLopHocPhan;
