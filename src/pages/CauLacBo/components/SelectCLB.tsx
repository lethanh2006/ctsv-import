import type { HocKy } from '@/services/DaoTaoV2/HocKy/HocKy/typing';
import { Select } from 'antd';
import React, { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const SelectCLB = (props: {
	value?: string;
	onChange?: (id: string) => void;
	multiple?: boolean;
	condition?: Partial<HocKy.IRecord>;
	disabled?: boolean;
	allowClear?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
	keyValue?: string;
	placeHolder?: string;
}) => {
	const intl = useIntl();
	const { value, onChange, multiple, condition, allowClear, style, isSetRecord, keyValue, disabled, placeHolder } =
		props;
	const { danhSach, getAllModel, visibleForm, loading } = useModel('caulacbo.caulacbo');

	useEffect(() => {
		if (!visibleForm) getAllModel(!!isSetRecord, undefined, condition);
	}, [visibleForm, JSON.stringify(condition)]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			disabled={disabled}
			value={value}
			onChange={onChange}
			options={danhSach.map((item: any) => ({
				key: item._id,
				value: keyValue ? item[keyValue] : item._id,
				label: `${item.ten}`,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={placeHolder || intl.formatMessage({ id: 'tuansinhhoatcongdan.select.clb' })}
			allowClear={allowClear ?? false}
			style={{ width: '100%', ...style }}
			loading={loading}
		/>
	);
};

export default SelectCLB;
