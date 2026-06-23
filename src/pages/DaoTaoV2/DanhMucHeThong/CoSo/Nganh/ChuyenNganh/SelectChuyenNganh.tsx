import { ELoaiNganhChuyenNganh } from '@/services/DaoTaoV2/DanhMucHeThong/constant';
import { Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectChuyenNganh = (props: {
	value?: string;
	onChange?: (val: string | null) => void;
	multiple?: boolean;
	allowClear?: boolean;
	disabled?: boolean;
	maNganh?: string;
	selectMa?: boolean;
	loai?: ELoaiNganhChuyenNganh;
}) => {
	const intl = useIntl();
	const { value, multiple, allowClear, disabled, maNganh, selectMa, loai } = props;
	const { danhSach, getAllModel } = useModel('daotaov2.danhmuc.nganhdaotao');

	useEffect(() => {
		getAllModel(false, undefined, {
			loai: loai ?? ELoaiNganhChuyenNganh.CHUYEN_NGANH,
			maNganhGoc: maNganh ?? undefined,
		});
	}, [maNganh]);

	const onChange = (val: string) => {
		if (props.onChange)
			if (val) props.onChange(val);
			else props.onChange(null);
	};

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			disabled={disabled}
			value={value}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: selectMa ? item.ma : item._id,
				label: `${item.ten} (${item.ma})`,
			}))}
			style={{ width: '100%' }}
			showSearch
			optionFilterProp='label'
			placeholder={intl.formatMessage({
				id: loai === ELoaiNganhChuyenNganh.CHUYEN_NGANH_PHU ? 'Thuộc chuyên ngành phụ' : 'Thuộc chuyên ngành',
			})}
			allowClear={allowClear ?? false}
		/>
	);
};

export default SelectChuyenNganh;
