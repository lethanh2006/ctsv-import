import { Select, Spin } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectDonVi = (props: {
	value?: string;
	onChange?: (val: string) => void;
	multiple?: boolean;
	disabled?: boolean;
	style?: React.CSSProperties;
	allowClear?: boolean;
	placeholder?: string;
	selectMa?: boolean;
	readOnly?: boolean;
}) => {
	const intl = useIntl();
	const { value, onChange, multiple, disabled, style, allowClear, placeholder, selectMa, readOnly } = props;
	const { danhSach, getAllModel, loading } = useModel('tochucnhansu.donvi');

	useEffect(() => {
		// Fix cứng khoa
		getAllModel(false, undefined, undefined);
	}, []);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			value={value}
			allowClear={allowClear}
			onChange={onChange}
			disabled={disabled}
			notFoundContent={loading ? <Spin spinning={true} style={{ width: '100%', margin: 10 }} /> : undefined}
			options={danhSach.map((item) => ({
				key: item._id,
				value: selectMa ? item.maDonVi : item._id,
				label: `${item.ten} (${item.maDonVi})`,
			}))}
			removeIcon={readOnly ? null : undefined}
			showSearch
			optionFilterProp='label'
			placeholder={placeholder || intl.formatMessage({ id: 'activity.info.form.unitCode.place' })}
			style={{ width: '100%', ...style, pointerEvents: readOnly ? 'none' : undefined }}
		/>
	);
};

export default SelectDonVi;
