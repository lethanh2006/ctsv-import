import { EOperatorType } from '@/components/Table/constant';
import { Empty, Select, Spin } from 'antd';
import _ from 'lodash';
import { useEffect } from 'react';
import { useModel } from 'umi';

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
	style?: React.CSSProperties;
	maNganh?: string;
}) => {
	const { value, onChange, multiple, disabled, selectMa, allowClear, style, maNganh } = props;
	const { danhSach, getModel, setFilters, filters, loading } = useModel('daotaov2.namhoc.lophanhchinh');

	useEffect(() => {
		// Nếu trong danh sách đã có 1 giá trị trong `value` rồi thì ko get lại data nữa
		// Nhưng `có thể` bug khi lần đầu render
		const gotData = danhSach.some((item) =>
			Array.isArray(value) ? value.includes(selectMa ? item.ten : item._id) : value === selectMa ? item.ten : item._id,
		);

		getModel(
			{ maNganh: maNganh },
			(!filters || !filters.length) && ((!props.multiple && value) || (props.multiple && value?.length)) && !gotData
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
	}, [filters, value, maNganh]);

	const searchDebounceLopHanhChinh = _.debounce((val) => {
		setFilters([{ active: true, field: 'ten', values: [val], operator: EOperatorType.CONTAIN }]);
	}, 800);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			value={value}
			onChange={onChange}
			disabled={disabled}
			notFoundContent={
				loading ? (
					<Spin spinning={true} tip='Đang tìm kiếm...' style={{ width: '100%', margin: 10 }} />
				) : (
					<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có dữ liệu, hãy thử nhập từ khóa khác!' />
				)
			}
			onSearch={(val) => searchDebounceLopHanhChinh(val)}
			options={danhSach.map((item) => ({
				key: item._id,
				value: selectMa ? item.ten : item._id,
				label: `${item.ten}`,
				rawData: item,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder='Chọn lớp hành chính (tìm kiếm theo tên)'
			showArrow
			style={{ width: '100%', ...style }}
			allowClear={allowClear}
		/>
	);
};

export default SelectLopHanhChinhDebounce;
