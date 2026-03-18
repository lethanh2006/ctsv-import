import { Select } from 'antd';
import React, { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectDotKhamSucKhoe = (props: {
	value?: string;
	onChange?: (id: string) => void;
	multiple?: boolean;
	condition?: any;
	allowClear?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
}) => {
	const intl = useIntl();
	const { value, onChange, multiple, condition, allowClear, style, isSetRecord } = props;
	const { danhSach, getAllModel, visibleForm, setRecord } = useModel('hosotheodoisuckhoe.dotkhamsuckhoe');

	useEffect(() => {
		if (!visibleForm)
			getAllModel(isSetRecord, undefined, condition).then(() => {
				if (!isSetRecord) setRecord(undefined);
			});
	}, [visibleForm, JSON.stringify(condition)]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			value={value}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: item._id,
				label: `${item.ten}`,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={intl.formatMessage({ id: 'ketquakhamsuckhoe.select.dot' })}
			allowClear={allowClear ?? false}
			style={{ width: '100%', ...style }}
		/>
	);
};

export default SelectDotKhamSucKhoe;
