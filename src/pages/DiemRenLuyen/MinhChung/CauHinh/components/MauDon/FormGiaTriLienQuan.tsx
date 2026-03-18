import { EKieuDuLieu, ELoaiPhepToan } from '@/services/FormDong/LoaiHinh/constants';
import { LoaiHinh } from '@/services/FormDong/LoaiHinh/typing';
import rules from '@/utils/rules';
import { Form, Input, InputNumber, Radio, Select } from 'antd';
import { useIntl, useModel } from 'umi';

const FormGiaTriLienQuan = (props: {
	truongThongTinLienQuan: LoaiHinh.TruongThongTin | LoaiHinh.Cot;
	fieldName?: string;
	loaiPhepToan?: ELoaiPhepToan;
}) => {
	const intl = useIntl();
	let component = null;
	const { danhSach } = useModel('quytrinh.danhmuc');
	const rule = [...rules.required];

	switch (props.truongThongTinLienQuan.kieuDuLieu) {
		case EKieuDuLieu.NUMBER:
			component = (
				<InputNumber
					style={{ width: '100%' }}
					placeholder={intl.formatMessage({ id: 'minhchung.form.placeholder.nhapgiatri' })}
				/>
			);
			break;
		case EKieuDuLieu.DECIMAL:
			component = (
				<InputNumber
					style={{ width: '100%' }}
					placeholder={intl.formatMessage({ id: 'minhchung.form.placeholder.nhapgiatri' })}
				/>
			);
			break;
		case EKieuDuLieu.BOOLEAN:
			component = (
				<Radio.Group
					options={[
						{ value: true, label: intl.formatMessage({ id: 'minhchung.value.co' }) },
						{ value: false, label: intl.formatMessage({ id: 'minhchung.value.khong' }) },
					]}
				/>
			);
			break;
		case EKieuDuLieu.DANHMUC:
			component = (
				<Select
					placeholder={intl.formatMessage({ id: 'minhchung.form.placeholder.chongiatri' })}
					mode={
						!props.loaiPhepToan || [ELoaiPhepToan.NAM_TRONG, ELoaiPhepToan.KHONG_NAM_TRONG].includes(props.loaiPhepToan)
							? 'multiple'
							: undefined
					}
					options={danhSach
						?.find((item) => item.maDanhMuc === props.truongThongTinLienQuan.maDanhMuc)
						?.danhSachGiaTri?.map((item: { value: string }) => ({ value: item.value, label: item.value }))}
				/>
			);
			break;

		case EKieuDuLieu.TEXT:
			component = <Input placeholder={intl.formatMessage({ id: 'minhchung.form.placeholder.nhapgiatri' })} />;
			break;
		default:
			break;
	}

	return (
		<>
			{component ? (
				<Form.Item
					name={props?.fieldName ?? 'giaTriLienQuan'}
					label={intl.formatMessage({ id: 'minhchung.form.giatrilienquan' })}
					rules={rule}
				>
					{component}
				</Form.Item>
			) : null}
		</>
	);
};

export default FormGiaTriLienQuan;
