import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectTietHoc = (props: {
	value?: string;
	onChange?: any;
	multiple?: boolean;
	loadData?: boolean;
	maNhomTietHoc?: string;
}) => {
	const { value, onChange, multiple, loadData, maNhomTietHoc } = props;
	const { danhSach, getAllModel, visibleForm } = useModel('daotaov2.danhmuc.tiethoc');

	useEffect(() => {
		if (loadData !== false && !visibleForm) getAllModel(false, undefined, { maNhomTietHoc });
	}, [visibleForm, loadData, maNhomTietHoc]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			value={value}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: item._id,
				label: `Tiết ${item.tietHoc} (${item?.nhomTietHoc?.ten})`,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder='Chọn tiết học'
		/>
	);
};

export default SelectTietHoc;
