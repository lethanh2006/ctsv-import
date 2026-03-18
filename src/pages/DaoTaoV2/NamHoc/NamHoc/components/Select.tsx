import { Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectNamHoc = (props: {
	value?: string;
	onChange?: (val?: string) => void;
	multiple?: boolean;
	allowClear?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
	hasDefault?: boolean;
	selectMa?: boolean;
	disabled?: boolean;
}) => {
	const intl = useIntl();
	const { value, onChange, multiple, allowClear, style, isSetRecord, disabled, hasDefault, selectMa } = props;
	const { danhSach, getAllModel, visibleForm } = useModel('daotaov2.namhoc.namhoc');

	useEffect(() => {
		if (!visibleForm && !danhSach.length)
			getAllModel(isSetRecord, { ma: -1 }).then((res) => {
				if (hasDefault && onChange) onChange(selectMa ? res?.[0]?.ma : res?.[0]?._id);
			});
	}, [visibleForm]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			allowClear={allowClear}
			disabled={disabled}
			value={value}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: selectMa ? item.ma : item._id,
				label: item.ten,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={intl.formatMessage({ id: 'lophanhchinh.step.cvht.select.namhoc' })}
			style={{ width: '100%', ...style }}
			showArrow
		/>
	);
};

export default SelectNamHoc;
