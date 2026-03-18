import type { KhoaSinhVien } from '@/services/DaoTaoV2/NamHoc/KhoaSinhVien/typings';
import { Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectKhoaSinhVien = (props: {
	value?: string;
	onChange?: (val: string | string[] | null) => void;
	multiple?: boolean;
	condition?: Partial<KhoaSinhVien.IRecord>;
	allowClear?: boolean;
	disabled?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
	selectMa?: boolean;
	loadData?: boolean;
	placeholder?: string;
}) => {
	const intl = useIntl();
	const {
		value,
		onChange,
		multiple,
		condition,
		allowClear,
		disabled,
		style,
		isSetRecord,
		selectMa,
		loadData,
		placeholder,
	} = props;
	const { danhSach, getAllModel, visibleForm, loading } = useModel('daotaov2.namhoc.khoasinhvien');

	useEffect(() => {
		if (!visibleForm && loadData !== false) getAllModel(isSetRecord, { namHocBatDau: -1 }, condition);
	}, [visibleForm, JSON.stringify(condition)]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			value={value}
			onChange={onChange}
			disabled={disabled}
			options={danhSach.map((item) => ({
				key: item.ma ?? item._id,
				value: selectMa ? item.ma : item._id,
				label: item.ten,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={placeholder ?? intl.formatMessage({ id: 'lophanhchinh.filterkhoanganh.select.khoasv' })}
			allowClear={allowClear ?? false}
			style={{ width: '100%', ...style }}
			showArrow
			loading={loading}
		/>
	);
};

export default SelectKhoaSinhVien;
