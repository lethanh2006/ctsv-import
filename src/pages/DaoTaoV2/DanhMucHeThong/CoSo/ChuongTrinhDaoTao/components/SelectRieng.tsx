import type { ChuongTrinhDaoTao } from '@/services/DaoTaoV2/DanhMucHeThong/ChuongTrinhDaoTao/typings';
import { ELoaiChuongTrinhDaoTao, ETrangThaiCtdt } from '@/services/DaoTaoV2/DanhMucHeThong/constant';
import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectChuongTrinhRieng = (props: {
	value?: string;
	onChange?: any;
	multiple?: boolean;
	disabled?: boolean;
	condition?: Partial<ChuongTrinhDaoTao.IRecord>;
	selectMa?: boolean;
	style?: React.CSSProperties;
}) => {
	const { value, onChange, multiple, disabled, condition, selectMa, style } = props;
	const { getAllService } = useModel('daotaov2.chuongtrinhdaotao.chuongtrinh');
	const [danhSach, setDanhSach] = useState<ChuongTrinhDaoTao.IRecord[]>([]);

	useEffect(() => {
		getAllService({
			condition: { loai: ELoaiChuongTrinhDaoTao.CHUAN, trangThai: ETrangThaiCtdt.CONG_BO, ...condition },
		}).then((res) => {
			setDanhSach(res.data?.data);
		});
	}, [JSON.stringify(condition)]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			value={value}
			onChange={onChange}
			disabled={disabled}
			options={danhSach.map((item) => ({
				key: item._id,
				value: selectMa ? item.ma : item._id,
				label: item.ten,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder='Chọn chương trình đào tạo'
			style={{ width: '100%', ...style }}
			showArrow
		/>
	);
};

export default SelectChuongTrinhRieng;
