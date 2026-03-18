import { ELoaiLopHocPhan } from '@/services/DaoTaoV2/HocKy/constant';
import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectLopHocPhan = (props: {
	value?: string;
	onChange?: (val?: string) => void;
	multiple?: boolean;
	disabled?: boolean;
	condition: { maHocKy?: string };
	allowClear?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
	selectMa?: boolean;
}) => {
	const { value, onChange, multiple, condition, allowClear, style, isSetRecord, disabled, selectMa } = props;
	const { danhSach, visibleForm, getAllModel, loading } = useModel('daotaov2.hocky.lopthuchanh');

	useEffect(() => {
		if (!visibleForm) getAllModel(isSetRecord, undefined, { ...condition, loai: ELoaiLopHocPhan.CHINH });
	}, [visibleForm, JSON.stringify(condition)]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			value={value}
			onChange={onChange}
			disabled={disabled}
			options={danhSach.map((item) => ({
				key: item._id,
				value: selectMa ? item.ten : item._id,
				label: `${item.ten}${item.hocPhan?.ten ? ` (${item.hocPhan.ten})` : ''}`,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder='Chọn lớp tín chỉ'
			allowClear={allowClear ?? false}
			style={{ width: '100%', ...style }}
			loading={loading}
		/>
	);
};

export default SelectLopHocPhan;
