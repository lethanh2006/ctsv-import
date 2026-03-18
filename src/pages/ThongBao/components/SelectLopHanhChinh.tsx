import { EOperatorType } from '@/components/Table/constant';
import { Empty, Select, Spin } from 'antd';
import _ from 'lodash';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectLopHanhChinhDebounce = (props: {
	value?: string;
	onChange?: any;
	multiple?: boolean;
	disabled?: boolean;
	selectMa?: boolean;
	allowClear?: boolean;
}) => {
	const intl = useIntl();
	const { value, onChange, multiple, disabled, selectMa, allowClear } = props;
	const { danhSach, getModel, setFilters, filters, loading } = useModel('daotaov2.namhoc.lophanhchinh');

	useEffect(() => {
		// Nếu trong danh sách đã có 1 giá trị trong `value` rồi thì ko get lại data nữa
		// Nhưng `có thể` bug khi lần đầu render
		const gotData = danhSach.some((item) =>
			Array.isArray(value)
				? value.includes(selectMa ? item.ten : item._id)
				: value === (selectMa ? item.ten : item._id),
		);
		getModel(
			undefined,
			(!filters || !filters.length) && value && !gotData
				? [
						{
							active: true,
							field: selectMa ? 'ten' : '_id',
							values: Array.isArray(value) ? value : [value],
							operator: EOperatorType.INCLUDE,
						},
					]
				: undefined,
			undefined,
			1,
			20,
		);
	}, [filters, value]);

	const searchDebounceLopHanhChinh = _.debounce((val) => {
		setFilters([{ active: true, field: 'ten', values: [val], operator: EOperatorType.CONTAIN }]);
	}, 800);

	return (
		<div style={{ display: 'flex', gap: 8 }}>
			<Select
				mode={multiple ? 'multiple' : undefined}
				value={value}
				onChange={onChange}
				disabled={disabled}
				notFoundContent={
					loading ? (
						<Spin
							spinning={true}
							tip={intl.formatMessage({ id: 'thongbao.select.lophanhchinh.timkiem' })}
							style={{ width: '100%', margin: 10 }}
						/>
					) : (
						<Empty
							image={Empty.PRESENTED_IMAGE_SIMPLE}
							description={intl.formatMessage({ id: 'thongbao.select.lophanhchinh.khongco' })}
						/>
					)
				}
				onSearch={(val) => searchDebounceLopHanhChinh(val)}
				options={danhSach.map((item) => ({
					key: item._id,
					value: selectMa ? item.ten : item._id,
					label: `${item.ten}`,
				}))}
				showSearch
				optionFilterProp='label'
				placeholder={intl.formatMessage({ id: 'thongbao.select.lophanhchinh.chonlophanhchinh' })}
				allowClear={allowClear}
			/>
		</div>
	);
};

export default SelectLopHanhChinhDebounce;
