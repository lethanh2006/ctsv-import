import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { KyTucXa } from '@/services/KyTucXa/typing';
import { EditOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import { useIntl, useModel } from 'umi';
import SelectToaNha from '../DotDangKy/components/SelectToaNha';
import Form from './components/Form';
import ThongKePhongKTX from './components/ThongKe';
import { useEffect } from 'react';

const PhongKTXPage = () => {
	const intl = useIntl();
	const { getModel, page, limit, handleEdit } = useModel('kytucxa.phong');
	const { danhSach: danhSachToaNha, getAllModel: getAllToaNha } = useModel('kytucxa.toa');
	const { danhSach: danhSachLoaiPhong, getAllModel: getAllLoaiPhong } = useModel('kytucxa.loaiphong');

	useEffect(() => {
		getAllToaNha();
		getAllLoaiPhong();
	}, []);


	const getData = () => {
		getModel(undefined, undefined, undefined, undefined, undefined, undefined, {
			population: [{ path: 'dangKyKyTucXaRule' }],
		});
	};

	const columns: IColumn<KyTucXa.IPhong>[] = [
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
			render: (val) => danhSachToaNha?.find((item: KyTucXa.IToa) => item?.ma === val)?.ten || '-',
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.phong.sucChua' }),
			dataIndex: 'soLuongToiDa',
			align: 'center',
			width: 100,
			sorter: true,
			render: (val) => val || '-',
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.phong.dangO' }),
			dataIndex: 'soLuongHienTai',
			align: 'center',
			width: 100,
			sorter: true,
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
			render: (val) => danhSachLoaiPhong?.find((item: KyTucXa.IDanhMucChung) => item?.ma === val)?.ten || '-',
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.phong.trangThaiChoThue' }),
			dataIndex: 'isChoThue',
			width: 140,
			align: 'center',
			render: (val: boolean) => (
				<Tag color={val ? 'success' : 'default'}>
					{val
						? intl.formatMessage({ id: 'kytucxa.phong.dangChoThue' })
						: intl.formatMessage({ id: 'kytucxa.phong.chuaChoThue' })}
				</Tag>
			),
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
		},
	];

	return (
		<TableBase
			getData={getData}
			columns={columns}
			dependencies={[page, limit]}
			modelName='kytucxa.phong'
			title={intl.formatMessage({ id: 'kytucxa.phong.title' })}
			Form={Form}
			formProps={{ getData }}
			buttons={{ create: false, export: true }}
			widthDrawer={800}
			showModalTitle
		>
			<ThongKePhongKTX />
		</TableBase>
	);
};

export default PhongKTXPage;
