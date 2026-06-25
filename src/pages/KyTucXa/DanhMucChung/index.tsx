import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import { type IColumn } from '@/components/Table/typing';
import { KyTucXa } from '@/services/KyTucXa/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Image, Popconfirm } from 'antd';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';

const DanhMucChungPage = (props: { loai: 'TIEN_ICH_PHONG' | 'LOAI_PHONG_KTX' }) => {
	const { loai } = props;
	const intl = useIntl();
	const { getModel, page, limit, deleteModel, handleEdit } = useModel('kytucxa.danhmucchung');

	const getData = () => {
		if (loai)
			getModel(undefined, [
				{
					active: true,
					field: 'maLoai',
					values: [loai],
					operator: EOperatorType.INCLUDE,
				},
			]);
	};

	const columns: IColumn<KyTucXa.IDanhMucChung>[] = [
		{
			title: intl.formatMessage({ id: 'kytucxa.danhmucchung.ma' }),
			dataIndex: 'ma',
			width: 100,
			filterType: 'string',
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.danhmucchung.ten' }),
			dataIndex: 'ten',
			width: 200,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.danhmucchung.icon' }),
			dataIndex: 'anh',
			width: 150,
			render: (val: string) =>
				val ? <Image src={val} width={30} height={30} style={{ objectFit: 'contain' }} /> : null,
			hide: loai === 'LOAI_PHONG_KTX',
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.danhmucchung.loaitienich' }),
			dataIndex: 'cauHinh',
			width: 150,
			render: (val, record) =>
				record?.cauHinh?.tienIchChung
					? intl.formatMessage({ id: 'kytucxa.danhmucchung.tienichchung' })
					: '',
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.danhmucchung.ghichu' }),
			dataIndex: 'ghiChu',
			width: 200,
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.danhmucchung.actions' }),
			align: 'center',
			width: 100,
			fixed: 'right',
			render: (val, record) => (
				<>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'kytucxa.danhmucchung.edit' })}
						onClick={() => handleEdit(record)}
						type='link'
						icon={<EditOutlined />}
					/>
					<Popconfirm
						onConfirm={() => deleteModel(record._id, getData)}
						title={intl.formatMessage({ id: 'kytucxa.danhmucchung.xacnhanxoa' })}
						placement='topRight'
					>
						<ButtonExtend
							tooltip={intl.formatMessage({ id: 'kytucxa.danhmucchung.delete' })}
							danger
							type='link'
							icon={<DeleteOutlined />}
						/>
					</Popconfirm>
				</>
			),
		},
	];

	return (
		<TableBase
			getData={getData}
			columns={columns}
			dependencies={[page, limit, loai]}
			modelName='kytucxa.danhmucchung'
			title={loai === 'LOAI_PHONG_KTX' ? 'Danh sách loại phòng' : 'Danh sách tiện ích'}
			Form={Form}
			formProps={{ getData, loai }}
			showModalTitle
		/>
	);
};

export default DanhMucChungPage;
