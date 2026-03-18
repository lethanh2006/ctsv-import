import type { HocKy } from '@/services/DaoTaoV2/HocKy/HocKy/typing';
import { Select } from 'antd';
import React, { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectHocKy = (props: {
	value?: string;
	onChange?: (id: string) => void;
	multiple?: boolean;
	condition?: Partial<HocKy.IRecord>;
	disabled?: boolean;
	allowClear?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
	selectMa?: boolean;
}) => {
	const intl = useIntl();
	const { value, onChange, multiple, condition, allowClear, style, isSetRecord, selectMa, disabled } = props;
	const { danhSach, getAllModel, visibleForm, loading } = useModel('daotaov2.hocky.hocky');

	useEffect(() => {
		if (!visibleForm) getAllModel(!!isSetRecord, { ma: -1 }, condition);
	}, [visibleForm, JSON.stringify(condition)]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			disabled={disabled}
			value={value}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: selectMa ? item.ma : item._id,
				label: `${item.ten}`,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={intl.formatMessage({ id: 'dotkhamsuckhoe.select.hocky' })}
			allowClear={allowClear ?? false}
			style={{ width: '100%', ...style }}
			loading={loading}
		/>
	);
};

export default SelectHocKy;
