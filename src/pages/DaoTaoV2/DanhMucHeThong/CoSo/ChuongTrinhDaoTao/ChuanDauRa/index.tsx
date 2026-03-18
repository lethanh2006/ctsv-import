import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import type { ChuongTrinhDaoTao } from '@/services/DaoTaoV2/DanhMucHeThong/ChuongTrinhDaoTao/typings';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Card, Empty, Popconfirm } from 'antd';
import { useMediaQuery } from 'react-responsive';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane';
import { useModel } from 'umi';
import SelectLoaiChungChi from '../../LoaiChungChi/components/Select';
import { CardFilterCTDT } from './components/CardFilterCTDT';
import Form from './components/Form';
import { useState } from 'react';

const ChuanDauRaPage = () => {
	const { record: recChuongTrinh } = useModel('daotaov2.chuongtrinhdaotao.chuongtrinh');
	const { handleEdit, page, limit, deleteModel, getModel } = useModel('daotaov2.danhmuc.chungchidaura');
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
	const [paneSize, setPaneSize] = useState('40%');

	const handlePaneSizeChange = (size: any) => {
		setPaneSize(size[0]);
	};

	const getData = () => getModel({ maChuongTrinhDaoTao: recChuongTrinh?.ma });

	const columns: IColumn<ChuongTrinhDaoTao.IChungChiCTDT>[] = [
		{
			title: 'Loại chứng chỉ',
			dataIndex: 'loaiChungChi',
			width: 120,
			filterType: 'customselect',
			filterCustomSelect: <SelectLoaiChungChi multiple selectMa />,
			render: (val) => val?.ten,
			sortable: true,
		},
		{
			title: 'Danh sách chứng chỉ',
			width: 200,
			render: (val, rec) =>
				rec.danhSachChungChiCtdtCdr?.map((item) => item.chungChi?.ten ?? item.maChungChi).join(', '),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (rec) => (
				<>
					<ButtonExtend tooltip='Chỉnh sửa' onClick={() => handleEdit(rec)} type='link' icon={<EditOutlined />} />
					<Popconfirm
						onConfirm={() => deleteModel(rec._id, getData)}
						title='Bạn có chắc chắn muốn xóa chuẩn đầu ra này?'
						placement='topRight'
					>
						<ButtonExtend tooltip='Xóa' danger type='link' icon={<DeleteOutlined />} />
					</Popconfirm>
				</>
			),
		},
	];

	return (
		<Card title='Chuẩn đầu ra'>
			<SplitPane split={isMobile ? 'horizontal' : 'vertical'} onChange={handlePaneSizeChange}>
				<Pane initialSize={paneSize} minSize='20%'>
					<CardFilterCTDT />
				</Pane>
				<Pane minSize='40%'>
					{recChuongTrinh?._id ? (
						<Card
							title='Danh sách chứng chỉ'
							styles={{ padding: '8px 0 0' }}
							headStyle={{ padding: 0 }}
							bordered={false}
						>
							<TableBase
								getData={getData}
								columns={columns}
								dependencies={[page, limit, recChuongTrinh?.ma]}
								modelName='daotaov2.danhmuc.chungchidaura'
								title='chứng chỉ'
								widthDrawer={800}
								Form={Form}
								deleteMany
								rowSelection
								hideCard
								buttons={{ import: true, export: true, filter: false }}
							/>
						</Card>
					) : (
						<Empty
							style={{ marginTop: 32, marginBottom: 32 }}
							description={'Vui lòng chọn chương trình đào tạo trước !'}
						/>
					)}
				</Pane>
			</SplitPane>
		</Card>
	);
};

export default ChuanDauRaPage;
