import type { KhoaSinhVien } from '@/services/DaoTaoV2/NamHoc/KhoaSinhVien/typings';
import { Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectKhoaSinhVien = (props: {
	value?: string;
	onChange?: (val: string) => void;
	multiple?: boolean;
	condition?: Partial<KhoaSinhVien.IRecord>;
	allowClear?: boolean;
	disabled?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
	selectMa?: boolean;
	readOnly?: boolean;
}) => {
	const intl = useIntl();
	const { value, onChange, multiple, condition, allowClear, disabled, style, isSetRecord, selectMa, readOnly } = props;
	const { danhSach, getAllModel, visibleForm } = useModel('daotaov2.namhoc.khoasinhvien');

	useEffect(() => {
		if (!visibleForm) getAllModel(isSetRecord, { namHocBatDau: -1 }, condition);
	}, [visibleForm, JSON.stringify(condition)]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			value={value}
			onChange={onChange}
			disabled={disabled}
			options={danhSach.map((item) => ({
				key: item._id,
				value: selectMa ? item.ma : item._id,
				label: item.ten,
			}))}
			removeIcon={readOnly ? null : undefined}
			showSearch
			optionFilterProp='label'
			placeholder={intl.formatMessage({ id: 'activity.info.form.studentCohortCode.place' })}
			allowClear={allowClear ?? false}
			style={{ width: '100%', pointerEvents: readOnly ? 'none' : undefined, ...style }}
		/>
	);
};

export default SelectKhoaSinhVien;
