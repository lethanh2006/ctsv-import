import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { EditOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import { useIntl, useModel } from 'umi';
import SelectToaNha from '../DotDangKy/components/SelectToaNha';
import Form from './components/Form';
import ThongKePhongKTX from './components/ThongKe';

const PhongKTXPage = (props: { isDanhSach?: boolean }) => {
	const { isDanhSach } = props;
	const intl = useIntl();
	const { page, limit, handleEdit } = useModel('kytucxa.phong');

	const columns: IColumn<PhongKTX.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'kytucxa.phong.maPhong' }),
			dataIndex: 'ma',
			width: 120,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.phong.tenPhong' }),
			dataIndex: 'ten',
			width: 160,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.phong.toaNha' }),
			dataIndex: 'maToaNha',
			width: 150,
			filterType: 'customselect',
			filterCustomSelect: <SelectToaNha selectMa multiple />,
			render: (val, rec) => rec?.toaNha?.ten,
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.phong.sucChua' }),
			dataIndex: 'soLuongToiDa',
			align: 'center',
			width: 120,
			sorter: true,
			render: (val) => val || '-',
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.phong.dangO' }),
			dataIndex: 'soLuongHienTai',
			align: 'center',
			width: 120,
			sorter: true,
			hide: !isDanhSach,
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.phong.danhChoSinhVien' }),
			dataIndex: ['dangKyKyTucXaRule', 'quocTichPhong'],
			width: 160,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.phong.gioiTinhChoPhep' }),
			dataIndex: ['dangKyKyTucXaRule', 'gioiTinh'],
			width: 160,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.phong.loaiPhong' }),
			dataIndex: 'maLoaiPhongKtx',
			width: 160,
			align: 'center',
			render: (val, rec) => rec?.loaiPhongKtx?.ten,
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.phong.trangThaiChoThue' }),
			dataIndex: 'isChoThue',
			width: 140,
			align: 'center',
			render: (val: boolean) => (
				<Tag color={val ? 'success' : 'default'}>
					{val
						? intl.formatMessage({ id: 'kytucxa.phong.active' })
						: intl.formatMessage({ id: 'kytucxa.phong.inactive' })}
				</Tag>
			),
			fixed: 'right',
			hide: isDanhSach,
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.phong.thaoTac' }),
			align: 'center',
			width: 80,
			fixed: 'right',
			render: (val, rec) => (
				<ButtonExtend
					tooltip={intl.formatMessage({ id: 'kytucxa.phong.chinhSua' })}
					onClick={() => handleEdit(rec)}
					type='link'
					icon={<EditOutlined />}
				/>
			),
			hide: isDanhSach,
		},
	];

	return (
		<TableBase
			columns={columns}
			dependencies={[page, limit]}
			modelName='kytucxa.phong'
			title={isDanhSach ? 'Danh sách phòng' : intl.formatMessage({ id: 'kytucxa.phong.title' })}
			Form={Form}
			buttons={{ create: false, export: true }}
			widthDrawer={800}
			showModalTitle
		>
			<ThongKePhongKTX isDanhSach={isDanhSach} />
		</TableBase>
	);
};

export default PhongKTXPage;
