import { Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const SelectBieuMau = (props: {
	value?: string;
	onChange?: (id: string) => void;
	multiple?: boolean;
	disabled?: boolean;
	allowClear?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
	selectMa?: boolean;
}) => {
	const intl = useIntl();
	const { getAllModel, danhSach, loading } = useModel('diemrenluyen.bieumauvwa');
	const { value, onChange, multiple, allowClear, style, isSetRecord, selectMa, disabled } = props;

	useEffect(() => {
		if (!danhSach.length) getAllModel(isSetRecord);
	}, []);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			disabled={disabled}
			value={value}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: selectMa ? item.ten : item._id,
				label: `${item.ten}`,
			}))}
			showSearch
			optionFilterProp='label'
			allowClear={allowClear ?? false}
			style={{ width: '100%', ...style }}
			loading={loading}
			placeholder={intl.formatMessage({ id: 'dotdanhgia.form.maudanhgia.place' })}
		/>
	);
};

export default SelectBieuMau;
