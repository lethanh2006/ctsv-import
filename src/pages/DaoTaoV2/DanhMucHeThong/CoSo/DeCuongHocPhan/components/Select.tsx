import { EOperatorType } from '@/components/Table/constant';
import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Select học phần riêng, ko dùng model hocphan
 */
const SelectDeCuong = (props: {
	maHocPhan: string;
	value?: string;
	onChange?: (val: string) => void;
	multiple?: boolean;
	disabled?: boolean;
	allowClear?: boolean;
	loadData?: boolean;
	selectMa?: boolean;
	style?: React.CSSProperties;
	maHocPhanList?: string[];
}) => {
	const { value, onChange, multiple, allowClear, selectMa, disabled, style, maHocPhan, loadData, maHocPhanList } =
		props;
	const { getAllModel, visibleForm, danhSachRieng, setDanhSachRieng } = useModel('daotaov2.hocphan.decuonghocphan');

	useEffect(() => {
		if (!visibleForm && maHocPhan && loadData !== false)
			getAllModel(
				false,
				undefined,
				undefined,
				[
					{
						active: true,
						field: 'maHocPhan',
						values: maHocPhanList && maHocPhanList.length ? maHocPhanList : [maHocPhan],
						operator: EOperatorType.INCLUDE,
					},
				],
				undefined,
				false,
			).then((ds) => setDanhSachRieng(ds));
	}, [maHocPhan, loadData, visibleForm, JSON.stringify(maHocPhanList)]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			disabled={disabled}
			value={value}
			onChange={onChange}
			options={danhSachRieng
				.filter((item) => item.maHocPhan === maHocPhan)
				.map((item) => ({
					key: item._id,
					value: selectMa ? item.ma : item._id,
					label: item.ma,
				}))}
			showSearch
			optionFilterProp='label'
			placeholder='Chọn phiên bản đề cương'
			style={{ width: '100%', ...style }}
			allowClear={allowClear ?? false}
		/>
	);
};

export default SelectDeCuong;
