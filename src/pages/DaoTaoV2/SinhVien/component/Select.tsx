import { EOperatorType } from '@/components/Table/constant';
import { Empty, Select, Spin } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

const SelectSinhVienDebounce = (props: {
	value?: string | string[];
	onChange?: (val: string | string[], option: any) => void;
	multiple?: boolean;
	disabled?: boolean;
	style?: React.CSSProperties;
	selectMa?: boolean;
	isView?: boolean;
}): any => {
	const intl = useIntl();
	const { value, onChange, multiple, disabled, style, selectMa } = props;
	const { danhSach, getModel, loading, searchSinhVienModel } = useModel('daotaov2.sinhvien.sinhvien');
	const [keyword, setKeyword] = useState<string>();

	useEffect(() => {
		// Nếu trong danh sách đã có 1 giá trị trong `value` rồi thì ko get lại data nữa
		// Nhưng `có thể` bug khi lần đầu render

		// const gotData = danhSach.some((item) =>
		// 	Array.isArray(value)
		// 		? value.includes(selectMa ? item.ma : item.ssoId)
		// 		: value === selectMa
		// 		? item.ma
		// 		: item.ssoId,
		// );

		if (keyword) searchSinhVienModel(keyword);
		else
			getModel(
				undefined,
				value
					? [
							{
								active: true,
								field: selectMa ? 'ma' : 'ssoId',
								values: Array.isArray(value) ? value : [value],
								operator: EOperatorType.INCLUDE,
							},
						]
					: undefined,
				undefined,
				1,
				20,
			);
	}, [keyword, value]);

	const searchDebounceSinhVien = _.debounce((val) => {
		setKeyword(val);
	}, 800);

	const dataView = danhSach.find((item) => item.ssoId === value);

	return props.isView ? (
		`${dataView?.ten ?? ''} - ${dataView?.ma ?? ''}`
	) : (
		<Select
			mode={multiple ? 'multiple' : undefined}
			allowClear
			value={value}
			onChange={onChange}
			disabled={disabled}
			onSearch={(val) => searchDebounceSinhVien(val)}
			notFoundContent={
				loading ? (
					<Spin
						spinning={true}
						tip={intl.formatMessage({ id: 'activitiesmanagement.student.column.hoten.loading' })}
						style={{ width: '100%', margin: 10 }}
					/>
				) : (
					<Empty
						image={Empty.PRESENTED_IMAGE_SIMPLE}
						description={intl.formatMessage({ id: 'activitiesmanagement.student.column.hoten.description' })}
					/>
				)
			}
			options={danhSach.map((item) => ({
				key: item?.ssoId,
				value: selectMa ? item.ma : item?.ssoId,
				label: `${item.ten} - ${item.ma} - ${item?.khoaSinhVien?.ten}`,
				rawData: item,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={intl.formatMessage({ id: 'activitiesmanagement.student.column.hotensinhvien.select' })}
			style={{ width: '100%', ...style }}
			showArrow
		/>
	);
};

export default SelectSinhVienDebounce;
