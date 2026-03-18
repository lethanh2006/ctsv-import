import { Select, Spin } from 'antd';
import type { CSSProperties } from 'react';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectDotKhaiBao = (props: {
	value?: string;
	onChange?: any;
	multiple?: boolean;
	disabled?: boolean;
	loadData?: boolean;
	allowClear?: boolean;
	placeholder?: string;
	style?: CSSProperties;
	idQuyTrinh: string;
	size?: 'small' | 'middle' | 'large' | undefined;
}) => {
	const intl = useIntl();
	const { value, onChange, multiple, loadData, allowClear, placeholder, disabled, style, idQuyTrinh, size } = props;
	const { danhSach, loading, getAllModel } = useModel('quytrinh.dotquytrinh');

	useEffect(() => {
		if (loadData !== false && idQuyTrinh) getAllModel(undefined, undefined, { quyTrinhId: idQuyTrinh });
	}, [idQuyTrinh]);

	return (
		<Select
			size={size}
			notFoundContent={loading ? <Spin spinning={true} /> : undefined}
			mode={multiple ? 'multiple' : undefined}
			value={value}
			disabled={disabled}
			allowClear={allowClear}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: item._id,
				label: `${item?.ten}`,
			}))}
			style={style}
			showSearch
			optionFilterProp='label'
			placeholder={placeholder ?? intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.select.dot' })}
		/>
	);
};

export default SelectDotKhaiBao;
