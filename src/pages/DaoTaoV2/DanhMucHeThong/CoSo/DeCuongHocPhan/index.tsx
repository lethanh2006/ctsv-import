import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type HocPhan } from '@/services/DaoTaoV2/DanhMucHeThong/HocPhan/typings';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Switch, Tooltip } from 'antd';
import _ from 'lodash';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import ViewVanBanQuyDinh from '../../VanBanQuyDinh/components/ViewVanBan';
import ModalDeCuongHocPhan from './components/ModalDeCuongHocPhan';

const DeCuongHocPhanPage = (props: { maHocPhan?: string; isFormItem?: boolean }) => {
	const intl = useIntl();
	const { getModel, page, limit, deleteModel, activeDeCuongModel, handleEdit, setSelectedIds } = useModel(
		'daotaov2.hocphan.decuonghocphan',
	);
	const { record: recHocPhan } = useModel('daotaov2.hocphan.hocphan');
	const { getModel: getDauDiem } = useModel('daotaov2.danhmuc.daudiemhocphan');
	const [visibleCanCu, setVisibleCanCu] = useState<boolean>(false);
	const [maVanBan, setMaVanBan] = useState<string>();
	const { maHocPhan, isFormItem } = props;

	const getData = () => {
		if (maHocPhan || recHocPhan?.ma) getModel({ maHocPhan: maHocPhan || recHocPhan?.ma });
	};

	const onCell = (record: HocPhan.IDeCuongHocPhan) => ({
		onClick: () => handleEdit(record),
		style: { cursor: 'pointer' },
	});

	const onChecked = (checked: boolean, rec: HocPhan.IDeCuongHocPhan) => {
		if (checked) activeDeCuongModel(rec?._id).then(() => getData());
	};

	const [columns] = useState<IColumn<HocPhan.IDeCuongHocPhan>[]>([
		{
			title: 'Phiên bản',
			dataIndex: 'ma',
			width: 120,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Người biên soạn',
			dataIndex: 'nguoiBienSoan',
			width: 120,
			filterType: 'string',
			onCell,
			hide: isFormItem,
		},
		{
			title: 'Ngày áp dụng',
			dataIndex: 'ngayApDung',
			width: 100,
			align: 'center',
			sortable: true,
			render: (val) => val && dayjs(val).format('DD/MM/YYYY'),
			onCell,
		},
		// {
		//   title: 'Số tín chỉ',
		//   dataIndex: 'soTinChi',
		//   width: 80,
		//   align: 'center',
		//   filterType: 'number',
		//   sortable: true,
		//   onCell,
		// },
		// {
		// 	title: 'Là HP tính điểm',
		// 	dataIndex: 'isTinhDiem',
		// 	width: 80,
		// 	align: 'center',
		// 	render: (val) => <Checkbox checked={!!val} />,
		// 	onCell,
		// },
		{
			title: 'Căn cứ pháp lý',
			dataIndex: 'maCanCu',
			width: 120,
			render: (val, rec) =>
				val ? (
					<a
						onClick={() => {
							setMaVanBan(rec?.maCanCu);
							setVisibleCanCu(true);
						}}
					>
						{val}
					</a>
				) : (
					<i>Chưa cập nhật</i>
				),
			hide: isFormItem,
		},
		{
			title: 'Tập tin / Đường dẫn',
			dataIndex: 'url',
			width: 120,
			render: (val) =>
				val && (
					<a href={val} target='_blank' rel='noreferrer'>
						Xem chi tiết
					</a>
				),
			hide: isFormItem,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (record: HocPhan.IDeCuongHocPhan) => (
				<>
					<Switch checked={record.active} onChange={(checked) => onChecked(checked, record)} size='small' />
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getData)}
							title='Bạn có chắc chắn muốn xóa đề cương này?'
							placement='topRight'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
			hide: isFormItem,
		},
	]);

	useEffect(() => {
		getDauDiem().then((res) => {
			const cols: IColumn<any>[] = res.map((item) => ({
				title: item.ten,
				width: 80,
				dataIndex: `trongSo${item.field}`,
				align: 'center',
				onCell,
				render: (val) => (!!val ? val + '%' : '--'),
			}));
			cols.push({
				title: 'Điểm KTHP',
				width: 80,
				align: 'center',
				onCell,
				render: (val, rec: HocPhan.IDeCuongHocPhan) => {
					const sum = _.sum(res.map((item) => rec?.[`trongSo${item.field}` as keyof HocPhan.IDeCuongHocPhan]));
					return 100 - sum + '%';
				},
			});
			columns.splice(1, 0, {
				title: 'Trọng số học phần',
				width: cols.length * 80,
				children: cols,
			});
		}); // Max 10 đầu điểm
	}, []);

	useEffect(() => {
		setSelectedIds(undefined);
	}, [recHocPhan?.ma]);

	return (
		<>
			<TableBase
				columns={columns}
				dependencies={[page, limit, recHocPhan?.ma, maHocPhan]}
				getData={getData}
				modelName='daotaov2.hocphan.decuonghocphan'
				title={intl.formatMessage({ id: 'danhmuchethong.coso.decuonghocphan.title' })}
				Form={ModalDeCuongHocPhan}
				formProps={{ maHocPhan }}
				widthDrawer={1000}
				hideCard
				rowSelection
				deleteMany={!isFormItem}
				buttons={{ filter: false, create: !isFormItem }}
				detailRow={isFormItem ? { type: 'radio' } : undefined}
			/>

			{maVanBan ? (
				<ViewVanBanQuyDinh visible={visibleCanCu} setVisible={setVisibleCanCu} condition={{ ma: maVanBan }} />
			) : null}
		</>
	);
};

export default DeCuongHocPhanPage;
