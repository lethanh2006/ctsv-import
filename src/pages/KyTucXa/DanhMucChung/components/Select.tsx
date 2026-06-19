import { KyTucXa } from '@/services/KyTucXa/typing';
import { Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const SelectLoaiDanhMucChung = (props: {
	value?: string;
	onChange?: (val?: string) => void;
	multiple?: boolean;
	allowClear?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
	condition?: Partial<KyTucXa.ILoaiDanhMucChung>;
	selectMa?: boolean;
	disabled?: boolean;
}) => {
	const intl = useIntl();
	const { value, onChange, multiple, allowClear, style, condition, selectMa, disabled } = props;
	const { danhSach, getAllLoaiDanhMucChungPublicModel } = useModel('kytucxa.loaidanhmucchung');

	useEffect(() => {
		getAllLoaiDanhMucChungPublicModel();
	}, []);

	const danhSachFilter = danhSach?.filter((item) => item?.ma === 'TIEN_ICH_PHONG' || item?.ma === 'LOAI_PHONG_KTX');

	return (
		<Select
			disabled={disabled}
			mode={multiple ? 'multiple' : undefined}
			allowClear={allowClear}
			value={value}
			onChange={onChange}
			options={danhSachFilter.map((item) => ({
				key: item._id,
				value: selectMa ? item.ma : item._id,
				label: item.ten,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={intl.formatMessage({ id: 'kytucxa.danhmucchung.chonmaloai' })}
			style={{ width: '100%', ...style }}
			showArrow
		/>
	);
};

export default SelectLoaiDanhMucChung;
