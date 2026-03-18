import type { ThoiKhoaBieu } from '@/services/DaoTaoV2/HocKy/ThoiKhoaBieu/typing';
import {
	ETrangThaiGiamSat,
	ETrangThaiLopDiemDanh,
	colorTrangThaiLopDiemDanh,
	trangThaiGiamSat,
	trangThaiLopDiemDanh,
} from '@/services/DaoTaoV2/HocKy/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Form, Input, Segmented, Tag } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormGiamSatGiangDuong = (props: any) => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, formSubmiting, giamSatGiangDayModel, visibleForm, isView } =
		useModel('daotaov2.hocky.thoikhoabieu');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const getData = () => props.getData && props.getData();

	const onFinish = async (values: ThoiKhoaBieu.IRecord) => {
		if (values.trangThaiGiamSat === ETrangThaiGiamSat.CHUA_GIAM_SAT) {
			form.setFields([{ name: 'trangThaiGiamSat', errors: ['Chưa chọn trạng thái'] }]);
			return;
		}
		if (record?._id)
			giamSatGiangDayModel(record?._id, values, getData)
				.then()
				.catch((er) => console.log(er));
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical' disabled={isView}>
			<div style={{ marginBottom: 12 }}>
				<div style={{ marginBottom: 8 }}>
					Giảng viên điểm danh:{' '}
					{
						<Tag color={colorTrangThaiLopDiemDanh[record?.trangThaiDiemDanh ?? ETrangThaiLopDiemDanh.CHUA_DIEM_DANH]}>
							{trangThaiLopDiemDanh[record?.trangThaiDiemDanh ?? ETrangThaiLopDiemDanh.CHUA_DIEM_DANH]}
						</Tag>
					}
				</div>
				{record?.nhomDiemDanh?._id ? (
					<div style={{ marginBottom: 8 }}>
						Thông tin điểm danh: {record.nhomDiemDanh.tongDiemDanhCoMat ?? 0} / {record.nhomDiemDanh.tongDiemDanh ?? 0}{' '}
						(có mặt / tổng số)
					</div>
				) : null}

				<Form.Item name='trangThaiGiamSat' label='Trạng thái giám sát'>
					<Segmented
						options={Object.values(ETrangThaiGiamSat).map((item) => ({
							key: item,
							value: item,
							label: trangThaiGiamSat[item],
							disabled: item === ETrangThaiGiamSat.CHUA_GIAM_SAT,
						}))}
					/>
				</Form.Item>

				<Form.Item name='ghiChuGiamSat' label='Ghi chú' rules={[...rules.text, ...rules.length(5000)]}>
					<Input.TextArea rows={3} />
				</Form.Item>
			</div>

			{!isView ? (
				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						Lưu lại
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Huỷ</Button>
				</div>
			) : null}
		</Form>
	);
};

export default FormGiamSatGiangDuong;
