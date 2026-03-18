import { EOperatorType } from '@/components/Table/constant';
import { Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectKhoaNganh = (props: {
	value?: string;
	onChange?: (val: any) => void;
	multiple?: boolean;
	namHoc?: number;
	condition?: { maKhoaSinhVien?: string };
	allowClear?: boolean;
	disabled?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
}) => {
	const intl = useIntl();
	const { value, onChange, multiple, namHoc, disabled, allowClear, style, isSetRecord, condition } = props;
	const { danhSach, getAllModel, visibleForm } = useModel('daotaov2.namhoc.khoanganh');

	useEffect(() => {
		if (!visibleForm)
			if (namHoc)
				getAllModel(false, { maKhoaSinhVien: -1 }, undefined, [
					{
						active: true,
						field: 'namBatDau',
						operator: EOperatorType.LESS_EQUAL,
						values: [namHoc],
					},
					{
						active: true,
						field: 'namKetThuc',
						operator: EOperatorType.GREAT_EQUAL,
						values: [namHoc],
					},
				]);
			else getAllModel(isSetRecord, { maKhoaSinhVien: -1 }, condition);
	}, [visibleForm, namHoc, JSON.stringify(condition)]);

	return (
		<Select
			value={value}
			disabled={disabled}
			onChange={onChange}
			mode={multiple ? 'multiple' : undefined}
			options={danhSach.map((item) => ({
				key: item._id,
				value: item.ma,
				label: `${item?.ten} (${item?.ma})`,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={intl.formatMessage({ id: 'dotkhamsuckhoe.step.khoanganh.form.tennganh.place' })}
			allowClear={allowClear ?? false}
			style={{ width: '100%', ...style }}
		/>
	);
};

export default SelectKhoaNganh;
