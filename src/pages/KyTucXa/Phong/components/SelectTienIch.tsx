import { Select } from 'antd';
import React, { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

/**
 * Select amenities for Form.Item
 */
const SelectTienIchKTX = (props: {
	value?: string;
	onChange?: (id: string) => void;
	multiple?: boolean;
	condition?: any;
	allowClear?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
	selectMa?: boolean;
}) => {
	const { value, onChange, multiple, condition, allowClear, style, isSetRecord } = props;
	const { danhSach, getAllModel, setRecord, loading } = useModel('kytucxa.danhmucchung');
	const intl = useIntl();

	useEffect(() => {
		getAllModel(isSetRecord, undefined, condition).then(() => {
			if (!isSetRecord) setRecord(undefined);
		});
	}, [JSON.stringify(condition)]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			value={value}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: item.ma,
				label: `${item.ten}`,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={intl.formatMessage({ id: 'kytucxa.phong.chonTienIch' })}
			allowClear={allowClear ?? false}
			style={{ width: '100%', ...style }}
			loading={loading}
		/>
	);
};

export default SelectTienIchKTX;
