import { type ELoaiPhienBan } from '@/services/DaoTaoV2/DanhMucHeThong/PhienBan/constant';
import { type PhienBan } from '@/services/DaoTaoV2/DanhMucHeThong/PhienBan/typing';
import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const SelectPhienBan = (props: {
	value?: string;
	onChange?: any;
	isSetRecord?: boolean;
	allowClear?: boolean;
	loaiPhienBan: ELoaiPhienBan;
	condition?: Partial<PhienBan.IRecord>;
	style?: React.CSSProperties;
}) => {
	const { value, onChange, isSetRecord, allowClear, condition, loaiPhienBan, style } = props;
	const { danhSach, getAllModel, visibleForm } = useModel('daotaov2.danhmuc.phienban');

	useEffect(() => {
		if (!visibleForm) getAllModel(isSetRecord, undefined, { ...condition, loaiPhienBan });
	}, [visibleForm, JSON.stringify(condition)]);

	return (
		<Select
			value={value}
			onChange={onChange}
			allowClear={allowClear !== false}
			options={danhSach.map((item) => ({
				key: item._id,
				value: item._id,
				label: item.ten,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder='Chọn phiên bản'
			style={style}
		/>
	);
};

export default SelectPhienBan;
