import { Divider, Select, Space, Typography } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const { Text } = Typography;

/**
 * Select Căn cứ pháp lý để cho vào FormItem
 */
const SelectCompetency = (props: {
	value?: string | string[];
	onChange?: (val?: string | string[]) => void;
	multiple?: boolean;
	allowClear?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
	condition?: Partial<Competency.IRecord>;
	disabled?: boolean;
}) => {
	const intl = useIntl();
	const { value, onChange, multiple, allowClear, style, isSetRecord, condition, disabled } = props;
	const { danhSach, getAllModel } = useModel('danhmuc.competency');

	useEffect(() => {
		getAllModel(!!isSetRecord, { order: 1 }, { ...condition }, undefined, undefined, undefined, undefined, {
			population: [{ path: 'attributes' }],
		});
	}, [JSON.stringify(condition)]);

	const options = (danhSach || [])
		.filter((item) => {
			if (item.isActive) return true;

			if (multiple && Array.isArray(value)) {
				return value.includes(item._id);
			}

			return item._id === value;
		})
		.map((item) => ({
			key: item._id,
			value: item._id,
			label: item.name,
			rawData: item,
		}));

	const handleSelectAll = () => {
		if (!multiple) return;
		const allIds = danhSach?.filter((item) => item?.isActive === true).map((i) => i._id);
		onChange?.(allIds);
	};

	return (
		<Select
			disabled={disabled}
			mode={multiple ? 'multiple' : undefined}
			allowClear={allowClear}
			value={value}
			onChange={onChange}
			options={options}
			showSearch
			optionFilterProp='label'
			placeholder={intl.formatMessage({ id: 'competency.select.place' })}
			style={{ width: '100%', ...style }}
			dropdownRender={(menu) =>
				multiple ? (
					<>
						<Space
							style={{
								padding: '8px 12px',
								cursor: 'pointer',
								width: '100%',
							}}
							onMouseDown={(e) => e.preventDefault()}
							onClick={handleSelectAll}
						>
							<Text strong>{intl.formatMessage({ id: 'competency.select.all' })}</Text>
						</Space>
						<Divider style={{ margin: '4px 0' }} />
						{menu}
					</>
				) : (
					menu
				)
			}
		/>
	);
};

export default SelectCompetency;
