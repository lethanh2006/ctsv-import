import SelectHinhThucKhenThuong from '@/pages/DanhMuc/HinhThucKhenThuong/components/Select';
import SelectLoaiKhenThuong from '@/pages/DanhMuc/LoaiKhenThuong/components/Select';
import SelectSinhVienDebounce from '@/pages/DaoTaoV2/SinhVien/component/Select';
import { type QuyetDinhKhenThuong } from '@/services/KhenThuong/QuyetDinhKhenThuong/typing';
import { ELoaiKhenThuong } from '@/services/KhenThuong/constants';
import { type SinhVien } from '@/services/SinhVien/typings';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { useIntl } from '@umijs/max';
import { Button, Card, Col, Form, Row } from 'antd';
import { useForm, useWatch } from 'antd/lib/form/Form';
import { useEffect } from 'react';
import './styles.less';

export type FormCaNhanValues = {
	loai: ELoaiKhenThuong;
	ssoId: string;
	sinhVien: any;
	// capKhenThuongId: string;
	// capKhenThuong: CapKhenThuong.IRecord;
	loaiKhenThuongId: string;
	loaiKhenThuong: LoaiKhenThuong.IRecord;
	// phuongThucKhenThuongId: string;
	// phuongThucKhenThuong: PhuongThucKhenThuong.IRecord;
	hinhThucKhenThuongId: string;
	hinhThucKhenThuong: HinhThucKhenThuong.IRecord | null;
	anhHuongThoiGianKhenThuong: boolean;
	thoiGianDieuChinh: number;
	daXetDieuChinhTangLuong: boolean;
};

interface Props {
	onFinish: (values: FormCaNhanValues) => void;
	onCancel: () => void;
	isEdit: boolean;
	isCreate: boolean;
	isView: boolean;
	record?: FormCaNhanValues;
	ignoreCacCanBo: QuyetDinhKhenThuong.CaNhan[];
}

export const FormCaNhan = ({ onCancel, onFinish, isEdit, isView, record }: Props) => {
	const intl = useIntl();
	const [form] = useForm<any>();

	const loaiKhenThuongId = useWatch(['loaiKhenThuongId'], form);

	useEffect(() => {
		resetFieldsForm(form, { ...record, loai: ELoaiKhenThuong.CA_NHAN });
	}, [isEdit, isView, record]);

	return (
		<Card
			title={intl.formatMessage({
				id: isView
					? 'kyluatkhenthuong.formcanhan.title.view'
					: isEdit
						? 'kyluatkhenthuong.formcanhan.title.edit'
						: 'kyluatkhenthuong.formcanhan.title.create',
			})}
		>
			<Form id='FormCaNhan' layout='vertical' form={form as any} onFinish={onFinish} disabled={isView}>
				<Form.Item hidden name='loai' />
				<Form.Item hidden name='sinhVien' />
				<Form.Item hidden name='capKhenThuong' />
				<Form.Item hidden name='tenLoaiKhenThuong' />
				<Form.Item hidden name='phuongThucKhenThuong' />
				<Form.Item hidden name='hinhThucKhenThuong' />
				<Row gutter={12}>
					<Col
						span={24}
						// md={12}
					>
						<Form.Item
							name='ssoId'
							label={intl.formatMessage({ id: 'kyluatkhenthuong.formcanhan.id.sinhvien' })}
							rules={[...rules.required]}
						>
							<SelectSinhVienDebounce
								keyValue='ssoId'
								// ignoreCacCanBo={ignoreCacCanBo}
								onChange={(_, option) => {
									const rawData = option?.rawData as SinhVien.IRecord | undefined;
									form.setFields([{ name: 'sinhVien', value: rawData ?? null }]);
								}}
							/>
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item hidden name='loaiKhenThuong' />
						<Form.Item
							name='loaiKhenThuongId'
							label={intl.formatMessage({ id: 'kyluatkhenthuong.formcanhan.id.loaikhenthuong' })}
							rules={[...rules.required]}
						>
							<SelectLoaiKhenThuong
								hasCreate={false}
								onChange={(_, option) => {
									const rawData = option?.rawData as LoaiKhenThuong.IRecord;
									form.setFieldsValue({
										hinhThucKhenThuong: null,
										hinhThucKhenThuongId: null,
										loaiKhenThuong: rawData ?? null,
										anhHuongThoiGianKhenThuong: null,
										thoiGianDieuChinh: null,
									});
								}}
							/>
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='hinhThucKhenThuongId'
							label={intl.formatMessage({ id: 'kyluatkhenthuong.formcanhan.id.hinhthuckhenthuong' })}
							rules={[...rules.required]}
						>
							<SelectHinhThucKhenThuong
								hasCreate={false}
								disable={!loaiKhenThuongId}
								loaiKhenThuongId={loaiKhenThuongId}
								onChange={(_, option) => {
									const rawData = option?.rawData as HinhThucKhenThuong.IRecord | undefined;
									form.setFields([{ name: 'hinhThucKhenThuong', value: rawData ?? null }]);
								}}
							/>
						</Form.Item>
					</Col>
				</Row>
			</Form>
			<div className='form-footer'>
				{!isView && (
					<Button form='FormCaNhan' type='primary' htmlType='submit'>
						{intl.formatMessage({ id: isEdit ? 'global.button.luulai' : 'global.button.themmoi' })}
					</Button>
				)}
				<Button onClick={onCancel}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>
		</Card>
	);
};
