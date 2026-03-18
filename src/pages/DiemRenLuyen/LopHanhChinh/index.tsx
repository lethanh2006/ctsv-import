import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type LopHanhChinh } from '@/services/DaoTaoV2/NamHoc/LopHanhChinh/typings';
import { ExportOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Select, Tag, Tooltip } from 'antd';
import { history, useIntl, useModel } from 'umi';

import SelectNganhCoSo from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/Nganh/components/SelectNganh';
import FilterKhoaSinhVien from '@/pages/DaoTaoV2/NamHoc/KhoaSinhVien/components/FilterKhoaSinhVien';
import SelectKhoaSinhVien from '@/pages/DaoTaoV2/SinhVien/KhoaSinhVien/SelectKhoaSinhVien';
import {
	ETrangThaiDuyetBienBanHopDiemRenLuyen,
	MapKeyColorTrangThaiDuyetBienBanHopDiemRenLuyen,
} from '@/services/DiemRenLuyen/BienBanHop/constant';
import SelectDotDiemRenLuyen from '../Dot/Select';

const LopHanhChinhPage = () => {
	const intl = useIntl();
	const { getModel, page, limit, setCondition, condition } = useModel('daotaov2.namhoc.lophanhchinh');
	const { record: recKhoa } = useModel('daotaov2.namhoc.khoasinhvien');
	const { record: recNganh } = useModel('daotaov2.danhmuc.nganhdaotao');
	const { record: recordDot, setRecord: setRecortdDot } = useModel('diemrenluyen.dot');
	const { exportThongKeModel, loading } = useModel('diemrenluyen.phieudiemrenluyen');

	const getData = () => {
		if (recordDot?._id)
			getModel(
				{ maKhoaSinhVien: recKhoa?.ma, maNganh: recNganh?.ma },
				undefined,
				undefined,
				undefined,
				undefined,
				`phieu-diem-ren-luyen/page/lop-hanh-chinh-bien-ban/${recordDot?._id}`,
				undefined,
				true,
				true,
			);
	};

	const onCell = (record: LopHanhChinh.IRecord) => ({
		onClick: () => history.push(`/diem-ren-luyen/lop-hanh-chinh/${record._id}`),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<LopHanhChinh.IRecord & { trangThaiDuyet: ETrangThaiDuyetBienBanHopDiemRenLuyen }>[] = [
		{
			title: intl.formatMessage({ id: 'lophanhchinh.column.tenlop' }),
			dataIndex: 'ten',
			width: 120,
			filterType: 'string',
			sortable: true,
			onCell,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'lophanhchinh.column.khoa' }),
			width: 120,
			dataIndex: 'maKhoaSinhVien',
			align: 'center',
			render: (val, rec) => (
				<div
				// onClick={() => {
				// 	setMaKhoaSinhVien(rec?.maKhoaSinhVien);
				// 	setVisibleKhoaSv(true);
				// }}
				>
					{rec?.khoaSinhVien?.ten}
				</div>
			),
			filterType: 'customselect',
			filterCustomSelect: <SelectKhoaSinhVien multiple selectMa />,
		},
		{
			title: intl.formatMessage({ id: 'lophanhchinh.column.nganh' }),
			width: 180,
			dataIndex: 'maNganh',
			render: (val, rec) => `${rec?.nganh?.dmNganh?.ten ?? ''} - ${rec?.nganh?.ma ?? ''}`,
			filterType: 'customselect',
			filterCustomSelect: <SelectNganhCoSo multiple selectMa />,
			onCell,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'lophanhchinh.column.trangthai' }),
			dataIndex: 'trangThaiDuyet',
			width: 100,
			align: 'center',
			onCell,
			// filterData: Object.values(ETrangThaiDuyetBienBanHopDiemRenLuyen),
			render: (val: ETrangThaiDuyetBienBanHopDiemRenLuyen) => (
				<Tag color={MapKeyColorTrangThaiDuyetBienBanHopDiemRenLuyen[val]}>{val}</Tag>
			),
		},
		{
			title: intl.formatMessage({ id: 'lophanhchinh.column.thaotac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: LopHanhChinh.IRecord) => (
				<>
					<Tooltip title={intl.formatMessage({ id: 'global.button.chitiet' })}>
						<Button
							onClick={() => history.push(`/diem-ren-luyen/lop-hanh-chinh/${record._id}`)}
							type='link'
							icon={<EyeOutlined />}
						/>
					</Tooltip>
					<Tooltip title={intl.formatMessage({ id: 'lophanhchinh.button.xuatthongke' })}>
						<Button
							loading={loading}
							onClick={() => exportThongKeModel(recordDot?._id ?? '', record.ten)}
							type='link'
							icon={<ExportOutlined />}
						/>
					</Tooltip>
				</>
			),
		},
	];

	return (
		<>
			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, recKhoa?.ma, recNganh?.ma, recordDot?._id]}
				modelName='daotaov2.namhoc.lophanhchinh'
				title={intl.formatMessage({ id: 'namhoc.lophanhchinh.title' })}
				widthDrawer={1200}
				buttons={{ create: false }}
				otherButtons={[
					<FilterKhoaSinhVien key={'filter'} hasSelectNganh allowClear />,
					<SelectDotDiemRenLuyen
						key={'filterDot'}
						style={{ width: 300 }}
						value={recordDot?._id}
						onChange={(val, option) => {
							const rawData = option?.rawData;
							setRecortdDot(rawData);
						}}
						isSetRecord={true}
					/>,
					<Select
						allowClear
						style={{ width: 200 }}
						placeholder='Lọc theo trạng thái'
						key={'filterTrangThai'}
						onChange={(val) => setCondition({ ...condition, trangThaiDuyet: val })}
						options={Object.values(ETrangThaiDuyetBienBanHopDiemRenLuyen).map((item) => ({ value: item, label: item }))}
					/>,
					<Button
						key={'export'}
						loading={loading}
						onClick={() => exportThongKeModel(recordDot?._id ?? '')}
						type='primary'
						icon={<ExportOutlined />}
					>
						{intl.formatMessage({ id: 'lophanhchinh.button.xuatkq' })}
					</Button>,
				]}
			/>
		</>
	);
};

export default LopHanhChinhPage;
