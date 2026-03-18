import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import ModalImport from '@/components/Table/Import';
import { type IColumn } from '@/components/Table/typing';
import CardFilterHocPhanHocKy from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/HocPhan/components/CardFilterHocPhan';
import '@/pages/DaoTaoV2/HocKy/SvLopHocPhan/components/style.less';
import SelectDonVi from '@/pages/DaoTaoV2/ToChucNhanSu/DonVi/Select';
import { type LopHocPhan } from '@/services/DaoTaoV2/HocKy/LopHocPhan/typing';
import { ELoaiLopHocPhan } from '@/services/DaoTaoV2/HocKy/constant';
import { DeleteOutlined, EditOutlined, TeamOutlined } from '@ant-design/icons';
import { Button, Card, Popconfirm, Tooltip } from 'antd';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane';
import { useIntl, useModel } from 'umi';
import FilterHocKy from '../HocKy/components/FilterHocKy';
import ModalLopHocPhan from './components/ModalLopHocPhan';
import RenderLichHoc from './components/RenderLichHoc';

const LopHocPhanPage = (props: { fromHocKy?: boolean; isKeHoach?: boolean }) => {
	const intl = useIntl();
	const { fromHocKy, isKeHoach } = props;
	const { getModel, page, limit, deleteModel, getByIdModel, handleEdit } = useModel('daotaov2.hocky.lophocphan');
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { record: recHocPhan, setRecord: setHocPhan } = useModel('daotaov2.hocphan.decuonghphk');
	const { record: recDonVi, setRecord: setDonVi, danhSach: danhSachDonVi } = useModel('daotaov2.tochucnhansu.donvi');
	const [visibleImportSvLhp, setVisibleImportSvLhp] = useState<boolean>(false);
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
	const [paneSize, setPaneSize] = useState('40%');

	const handlePaneSizeChange = (size: any) => {
		setPaneSize(size[0]);
	};

	const getData = () =>
		recHocKy?.ma &&
		getModel({
			maHocKy: recHocKy?.ma,
			loai: ELoaiLopHocPhan.CHINH,
			maHocPhan: recHocPhan?.maHocPhan,
		});

	const onCell = (record: LopHocPhan.IRecord) => ({
		onClick: () => getByIdModel(record._id).then((rec) => handleEdit(rec)),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<LopHocPhan.IRecord>[] = [
		{
			title: 'Mã lớp',
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Sĩ số tối đa',
			dataIndex: 'siSoToiDa',
			width: 80,
			align: 'center',
			filterType: 'number',
			sortable: true,
			hide: !isKeHoach,
			onCell,
		},
		{
			title: 'Sĩ số thực tế',
			dataIndex: 'siSo',
			width: 80,
			align: 'center',
			filterType: 'number',
			sortable: true,
			hide: isKeHoach,
			onCell,
		},
		{
			title: 'Thông tin chi tiết',
			width: 400,
			render: (val, rec) => <RenderLichHoc lopHocPhan={rec} />,
			onCell,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: LopHocPhan.IRecord) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button
							onClick={() => getByIdModel(record._id).then((rec) => handleEdit(rec))}
							type='link'
							icon={<EditOutlined />}
						/>
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getData)}
							title='Bạn có chắc chắn muốn xóa lớp tín chỉ này?'
							placement='topRight'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	return (
		<>
			<Card title={intl.formatMessage({ id: 'kyhoc.lophocphan.title' })}>
				<div className='table-base'>
					<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
						<FilterHocKy isSetHocKy />
						<SelectDonVi
							value={recDonVi?.maDonVi}
							style={{ width: 350 }}
							onChange={(val) => {
								setDonVi(danhSachDonVi.find((item) => item.maDonVi === val));
								setHocPhan(undefined);
							}}
							allowClear
							placeholder='Chọn đơn vị quản lý'
						/>
					</div>
				</div>

				<SplitPane split={isMobile ? 'horizontal' : 'vertical'} onChange={handlePaneSizeChange}>
					<Pane initialSize={paneSize} minSize='20%'>
						<CardFilterHocPhanHocKy />
					</Pane>
					<Pane minSize='40%'>
						<Card
							title={`Danh sách lớp tín chỉ ${recHocPhan?.maHocPhan ?? ''}`}
							headStyle={{ padding: 0 }}
							styles={{ padding: '8px 0 0' }}
							bordered={false}
						>
							<TableBase
								columns={columns}
								// Để params truyền vào export
								params={{
									maHocKy: recHocKy?.ma,
									loai: ELoaiLopHocPhan.CHINH,
									maHocPhan: recHocPhan?.maHocPhan,
								}}
								title='Lớp tín chỉ'
								getData={getData}
								dependencies={[page, limit, recHocKy?.ma, recHocPhan?.maHocPhan]}
								modelName='daotaov2.hocky.lophocphan'
								modelImportName='hocky.lophocphanimport'
								Form={ModalLopHocPhan}
								widthDrawer={1000}
								hideCard
								rowSelection
								deleteMany
								buttons={{
									filter: false,
									reload: !fromHocKy,
									export: true,
									import: true,
									create: !!isKeHoach,
								}}
								otherButtons={
									!isKeHoach
										? [
												<ButtonExtend key='svlhp' onClick={() => setVisibleImportSvLhp(true)} icon={<TeamOutlined />}>
													Nhập DS sinh viên
												</ButtonExtend>,
										  ]
										: []
								}
							/>
						</Card>
					</Pane>
				</SplitPane>
			</Card>

			<ModalImport
				modelName='daotaov2.hocky.sinhvienlophocphan'
				onCancel={() => setVisibleImportSvLhp(false)}
				visible={visibleImportSvLhp}
				onOk={() => {
					getData();
					setVisibleImportSvLhp(false);
				}}
				titleTemplate='Biểu mẫu Sinh viên - Lớp tín chỉ.xlsx'
			/>
		</>
	);
};

export default LopHocPhanPage;
