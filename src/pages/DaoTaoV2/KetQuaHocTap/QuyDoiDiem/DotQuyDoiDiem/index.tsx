import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import FilterHocKy from '@/pages/DaoTaoV2/HocKy/HocKy/components/FilterHocKy';
import type { DotQuyDoiDiem } from '@/services/DaoTaoV2/KetQuaHocTap/DotQuyDoiDiem/typing';
import { ETrangThaiDot, colorTrangThaiDot } from '@/services/DaoTaoV2/constant';
import { CheckOutlined, DeleteOutlined, EditOutlined, MenuOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Popover, Tag } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';
import ModalYeuCauChinhSua from './components/ModalYeuCauChinhSua';

const DotQuyDoiDiemPage = () => {
	const intl = useIntl();
	const { page, limit, deleteModel, handleEdit, setRecord, putModel, getModel } = useModel(
		'ketquahoctap.quydoidiem.dotquydoidiem',
	);
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const [viewYeuCau, setViewYeuCau] = useState<boolean>(false);

	const getData = () => getModel({ maHocKy: recHocKy?.ma });

	const handleDuyet = (record: DotQuyDoiDiem.IRecord) => {
		putModel(record._id ?? '', { ...record, trangThai: ETrangThaiDot.DA_BAN_HANH, ghiChu: '' }, getData)
			.then()
			.catch((err) => console.log(err));
	};

	const columns: IColumn<DotQuyDoiDiem.IRecord>[] = [
		{
			title: 'Tên đợt',
			dataIndex: 'tenDot',
			width: 150,
			filterType: 'string',
		},
		{
			title: 'Thời gian bắt đầu',
			dataIndex: 'thoiGianBatDau',
			width: 100,
			render: (val) => val && dayjs(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
		},
		{
			title: 'Thời gian xin ý kiến',
			dataIndex: 'thoiGianBatDauLayYKien',
			width: 100,
			align: 'center',
			render: (val) => val && dayjs(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
		},
		{
			title: 'Thời gian kết thúc xin ý kiến',
			dataIndex: 'thoiGianKetThucLayYKien',
			width: 100,
			align: 'center',
			render: (val) => val && dayjs(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
		},
		{
			title: 'Thời gian kết thúc',
			dataIndex: 'thoiGianKetThuc',
			width: 100,
			align: 'center',
			render: (val) => val && dayjs(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			align: 'center',
			filterType: 'select',
			filterData: Object.values(ETrangThaiDot),
			render: (val) => <Tag color={colorTrangThaiDot[val as ETrangThaiDot]}>{val}</Tag>,
			width: 120,
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			width: 180,
			render: (val) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend tooltip='Chỉnh sửa' onClick={() => handleEdit(rec)} type='link' icon={<EditOutlined />} />

					<Popconfirm
						disabled={rec.trangThai === ETrangThaiDot.DA_BAN_HANH}
						onConfirm={() => deleteModel(rec._id, getData)}
						title='Bạn có chắc chắn muốn xóa đợt quy đổi điểm này?'
						placement='topRight'
					>
						<ButtonExtend
							disabled={rec.trangThai === ETrangThaiDot.DA_BAN_HANH}
							tooltip='Xóa'
							danger
							type='link'
							icon={<DeleteOutlined />}
						/>
					</Popconfirm>

					<Popover
						placement='topLeft'
						content={
							<>
								<Popconfirm
									onConfirm={() => handleDuyet(rec)}
									title='Bạn có chắc chắn muốn duyệt đợt quy đổi điểm?'
									placement='topRight'
								>
									<ButtonExtend tooltip='Duyệt' type='link' className='btn-success' icon={<CheckOutlined />} />
								</Popconfirm>
								<ButtonExtend
									onClick={() => (setViewYeuCau(true), setRecord(rec))}
									tooltip='Yêu cầu chỉnh sửa'
									type='link'
									icon={<EditOutlined className='text-warning' />}
								/>
							</>
						}
					>
						<Button type='link' icon={<MenuOutlined />} />
					</Popover>
				</>
			),
		},
	];

	return (
		<>
			<TableBase
				getData={getData}
				columns={columns}
				params={{ maHocKy: recHocKy?.ma }}
				dependencies={[page, limit, recHocKy?.ma]}
				modelName='daotaov2.ketquahoctap.quydoidiem.dotquydoidiem'
				Form={Form}
				formProps={{ getData }}
				widthDrawer={800}
				title={intl.formatMessage({ id: 'ketquahoctap.dotquydoidiem.title' })}
				buttons={{ import: true, export: true }}
			>
				<div style={{ marginBottom: 18 }}>
					<FilterHocKy isSetHocKy />
				</div>
			</TableBase>

			<ModalYeuCauChinhSua visibleForm={viewYeuCau} setVisibleForm={setViewYeuCau} getData={getData} />
		</>
	);
};

export default DotQuyDoiDiemPage;
