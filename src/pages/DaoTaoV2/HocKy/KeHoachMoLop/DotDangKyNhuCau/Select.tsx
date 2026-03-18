import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectDotDangKyNhuCau = (props: {
	value?: string;
	onChange?: (val?: string) => void;
	multiple?: boolean;
	allowClear?: boolean;
	style?: React.CSSProperties;
	condition?: { maHocKy?: string };
	isSetRecord?: boolean;
}) => {
	const { value, onChange, multiple, allowClear, style, condition, isSetRecord } = props;
	const { danhSach, getAllModel, visibleForm } = useModel('daotaov2.hocky.dotdangkynhucau');

	useEffect(() => {
		if (!visibleForm) getAllModel(isSetRecord, undefined, { active: true, ...condition });
	}, [visibleForm, JSON.stringify(condition)]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			allowClear={allowClear}
			value={value}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: item._id,
				label: item.ten,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder='Chọn đợt đăng ký nhu cầu'
			style={{ width: '100%', ...style }}
		/>
	);
};

export default SelectDotDangKyNhuCau;
