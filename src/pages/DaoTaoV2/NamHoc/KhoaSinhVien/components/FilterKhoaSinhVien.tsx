import SelectNganhCoSo from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/Nganh/components/SelectNganh';
import FilterTrinhDoHinhThuc from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/TrinhDo/components/Filter';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import SelectKhoaSinhVien from './Select';

const FilterKhoaSinhVien = (props: {
	width?: number;
	allowClear?: boolean;
	hideExpand?: boolean;
	hasSelectNganh?: boolean;
	children?: React.ReactNode;
}) => {
	const intl = useIntl();
	const { record: recKhoa, danhSach: danhSachKhoa, setRecord: setKhoa } = useModel('daotaov2.namhoc.khoasinhvien');
	const { record: recNganh, danhSach: danhSachNganh, setRecord: setNganh } = useModel('daotaov2.danhmuc.nganhdaotao');
	const { record: recTrinhDo } = useModel('daotaov2.danhmuc.trinhdo');
	const { record: recHinhThuc } = useModel('daotaov2.danhmuc.hinhthucdaotao');
	const [visibleOption, setVisibleOption] = useState(false);
	const width = props.width ?? 200;

	return (
		<div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
			{visibleOption ? (
				<>
					<Tooltip title={intl.formatMessage({ id: 'lophanhchinh.filterkhoanganh.an' })}>
						<Button icon={<MinusOutlined />} onClick={() => setVisibleOption(false)} type='dashed' />
					</Tooltip>
					<FilterTrinhDoHinhThuc width={width} allowClear={props.allowClear} />
				</>
			) : !props.hideExpand ? (
				<Tooltip title={intl.formatMessage({ id: 'lophanhchinh.filterkhoanganh.morong' })}>
					<Button icon={<PlusOutlined />} onClick={() => setVisibleOption(true)} type='dashed' />
				</Tooltip>
			) : null}

			<SelectKhoaSinhVien
				style={{ width }}
				allowClear={props.allowClear}
				condition={{ maHinhThucDaoTao: recHinhThuc?.ma, maTrinhDoDaoTao: recTrinhDo?.ma }}
				value={recKhoa?.ma}
				onChange={(val) => setKhoa(danhSachKhoa.find((item) => item.ma === val))}
				isSetRecord
				selectMa
			/>

			{props.hasSelectNganh ? (
				<SelectNganhCoSo
					style={{ width: 250 }}
					allowClear={props.allowClear}
					maKhoaSinhVien={recKhoa?.ma}
					value={recNganh?.ma}
					selectMa
					onChange={(val) => setNganh(danhSachNganh.find((item) => item.ma === val))}
				/>
			) : null}

			{props.children}
		</div>
	);
};

export default FilterKhoaSinhVien;
