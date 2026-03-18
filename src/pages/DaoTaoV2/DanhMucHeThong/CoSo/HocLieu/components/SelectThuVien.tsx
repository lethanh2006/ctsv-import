import { getHocLieuThuVien } from '@/services/DaoTaoV2/DanhMucHeThong/HocPhan';
import { Empty, Select, Spin } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';

const SelectHocLieuThuVien = (props: {
	value?: any;
	onChange?: (item?: HocLieu.IRecordThuVien) => void;
	disabled?: boolean;
}) => {
	const { value, onChange, disabled } = props;
	const [danhSach, setDanhSach] = useState<HocLieu.IRecordThuVien[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [nhanDe, setNhanDe] = useState<string>('');

	useEffect(() => {
		if (!nhanDe) return;
		setLoading(true);
		getHocLieuThuVien({ conditions: [{ FieldCode: 'nhande', Keyword: nhanDe }], Limit: '50', Page: '1' })
			.then((res) => setDanhSach(res.data?.data?.SearchResult?.results ?? []))
			.finally(() => setLoading(false));
	}, [nhanDe]);

	const searchDebounceSinhVien = _.debounce((val) => {
		setNhanDe(val);
	}, 800);

	const onChangeHocLieu = (id: number) => {
		if (onChange) onChange(danhSach.find((item) => item.ID === id));
	};

	return (
		<Select
			disabled={disabled}
			value={value}
			onChange={onChangeHocLieu}
			onSearch={(val) => searchDebounceSinhVien(val)}
			notFoundContent={
				loading ? (
					<Spin spinning={true} tip='Đang tìm kiếm...' style={{ width: '100%', margin: 10 }} />
				) : (
					<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có dữ liệu, hãy thử nhập từ khóa khác!' />
				)
			}
			options={danhSach.map((item) => ({
				key: item.ID,
				value: item.ID,
				label: `${item.product_title ?? ''} - ${item.author ?? ''}`,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={'Tìm học liệu thư viện (nhập tên để tìm kiếm)'}
		/>
	);
};

export default SelectHocLieuThuVien;
