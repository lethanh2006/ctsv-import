import SelectHinhThuc from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/HinhThuc/components/Select';
import { EPhamViChuDe } from '@/services/TienIch/TinTuc/constant';
import { Select, Space } from 'antd';
import { useModel } from 'umi';

const FilterPhamVi = (props: { modelName: any }) => {
	const { condition, setCondition } = useModel(props.modelName);

	return (
		<Space wrap style={{ marginBottom: 12 }}>
			<Select
				onChange={(val) => setCondition({ ...condition, phamVi: val, hinhThucDaoTaoId: undefined })}
				style={{ width: 200 }}
				value={condition?.phamVi}
				allowClear
				placeholder='Chọn phạm vi'
				options={Object.values(EPhamViChuDe).map((item) => ({
					key: item,
					value: item,
					label: item,
				}))}
			/>
			<SelectHinhThuc
				allowClear
				style={{ width: 200 }}
				value={condition?.hinhThucDaoTaoId}
				disabled={condition?.phamVi !== EPhamViChuDe.HINH_THUC_DAO_TAO}
				onChange={(val) => setCondition({ ...condition, hinhThucDaoTaoId: val })}
			/>
		</Space>
	);
};

export default FilterPhamVi;
