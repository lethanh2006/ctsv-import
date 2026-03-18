import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import type { DotXetHocVu } from '@/services/DaoTaoV2/KetQuaHocTap/DotXetHocVu/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useIntl, useModel } from 'umi';
import Form from './Form';

const TaiLieuHocVuPage = () => {
	const intl = useIntl();
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { page, limit, handleEdit, deleteModel } = useModel('daotaov2.ketquahoctap.xethocvu.tailieuhocvu');

	const columns: IColumn<DotXetHocVu.ITaiLieu>[] = [
		{
			title: 'Tên tài liệu',
			dataIndex: 'ten',
			width: 180,
			filterType: 'string',
		},
		{
			title: 'Tệp tin',
			dataIndex: 'urls',
			width: 120,
			render: (val: string[]) =>
				val?.map((item, index) => (
					<div key={item}>
						<a href={item} target='_blank' rel='noreferrer'>
							Xem tập tin {index + 1}
						</a>
					</div>
				)),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: DotXetHocVu.ITaiLieu) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button
							disabled={recHocKy?.daChotKqCanhBao && recHocKy?.daChotKqThoiHoc}
							type='link'
							icon={<EditOutlined />}
							onClick={() => handleEdit(record)}
						/>
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id)}
							title='Bạn có chắc chắn muốn xóa tài liệu học vụ này?'
							placement='topRight'
						>
							<Button
								disabled={recHocKy?.daChotKqCanhBao && recHocKy?.daChotKqThoiHoc}
								danger
								type='link'
								icon={<DeleteOutlined />}
							/>
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	return (
		<>
			<TableBase
				columns={columns}
				params={{ maHocKy: recHocKy?.ma }}
				dependencies={[page, limit, recHocKy?.ma]}
				modelName='daotaov2.ketquahoctap.xethocvu.tailieuhocvu'
				title={intl.formatMessage({ id: 'ketquahoctap.xulyketqua.tailieuhocvu.title' })}
				hideCard
				Form={Form}
				widthDrawer={600}
				buttons={{ create: recHocKy?.daChotKqCanhBao && recHocKy?.daChotKqThoiHoc ? false : true }}
			/>
		</>
	);
};

export default TaiLieuHocVuPage;
