import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import SelectHocKy from '@/pages/HocKy/components/SelectHocKy';
import { kichHoatTrangThai } from '@/services/NoiNgoaiTru';
import { ETrangThaiDuyetNoiNgoaiTru, colorETrangThaiDuyetNoiNgoaiTru } from '@/services/NoiNgoaiTru/constant';
import type { NoiNgoaiTru } from '@/services/NoiNgoaiTru/typing';
import { ArrowDownOutlined, CheckOutlined, DeleteOutlined, EditOutlined, MenuOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Popover, Switch, Tag, Tooltip, message } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useModel } from 'umi';
import ModalYeuCauChinhSua from './components/ModalYeuCauChinhSua';
import ViewChiTiet from './components/ViewChiTiet';
import Form from './components/Form';

const DotKhaiBaoNoiNgoaiTruPage = () => {
	const { page, limit, handleEdit, deleteModel, getModel, putModel, setRecord } = useModel('noingoaitru.dotkhaibao');
	const { record: recHocKy, setRecord: retRecHocKy, danhSach: danhSachHocKy } = useModel('daotaov2.hocky.hocky');
	const [viewYeuCau, setViewYeuCau] = useState<boolean>(false);
	const [viewChitiet, setViewChiTiet] = useState<boolean>(false);

	const getData = () => getModel({ maHocKy: recHocKy?.ma });

	const onCell = (record: NoiNgoaiTru.IRecord) => ({
		onClick: () => (setViewChiTiet(true), setRecord(record)),
		style: { cursor: 'pointer' },
	});

	const handleDuyet = (record: NoiNgoaiTru.IRecord) => {
		putModel(record._id ?? '', { ...record, trangThaiDuyet: ETrangThaiDuyetNoiNgoaiTru.DA_DUYET, ghiChu: '' }, getData)
			.then()
			.catch((err) => console.log(err));
	};

	const handleActiveTrangThai = (check: boolean, id: string) => {
		kichHoatTrangThai(id, check ? 'kich-hoat ' : 'bo-kich-hoat')
			.then(
				() => (
					getModel({ maHocKy: recHocKy?.ma }),
					message.success(`${check ? 'Kích hoạt thành công' : 'Bỏ kích hoạt thành công'}`)
				),
			)
			.catch((err) => console.log(err));
	};

	const columns: IColumn<NoiNgoaiTru.IRecord>[] = [
		{
			title: 'Kỳ học',
			dataIndex: 'maHocKy',
			width: 150,
			render: (val, rec) => rec.hocKy?.ten ?? val,
		},
		{
			title: 'Tên đợt',
			dataIndex: 'tenDot',
			align: 'center',
			width: 150,
			filterType: 'string',
			sortable: true,
			onCell,
		},

		{
			title: 'Thời gian',
			dataIndex: 'thoiGianBatDau',
			align: 'center',
			width: 250,
			onCell,
			render: (val, rec) => {
				return (
					<>
						{dayjs(val).format('HH:mm DD/MM/YYYY')} - {dayjs(rec?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')}
					</>
				);
			},
		},
		{
			title: 'Kích hoạt',
			dataIndex: 'trangThai',
			align: 'center',
			width: 150,
			render: (val, rec) => {
				return <Switch checked={val === 'Kích hoạt'} onChange={(e) => handleActiveTrangThai(e, rec?._id ?? '')} />;
			},
		},
		{
			title: 'Danh sách khóa khai báo',
			dataIndex: 'danhSachKhoaSinhVienKhaiBao',
			align: 'center',
			width: 200,
			onCell,
			render: (val) => val.map((item: any) => item).join(', '),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThaiDuyet',
			align: 'center',
			fixed: 'right',
			filterType: 'select',
			filterData: Object.values(ETrangThaiDuyetNoiNgoaiTru),
			render: (val, rec) => <Tag color={colorETrangThaiDuyetNoiNgoaiTru[val as ETrangThaiDuyetNoiNgoaiTru]}>{val}</Tag>,
			width: 150,
			onCell,
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			width: 150,
			fixed: 'right',
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			onCell,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (rec) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(rec)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(rec._id)}
							title='Bạn có chắc chắn muốn xóa đợt khai báo nội ngoại trú này?'
							placement='topRight'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
					<Popover
						placement='bottomLeft'
						content={
							<>
								<Popconfirm
									onConfirm={() => handleDuyet(rec)}
									title='Bạn có chắc chắn muốn duyệt đợt khám sức khỏe?'
									placement='topRight'
								>
									<ButtonExtend tooltip='Duyệt' type='link' className='btn-success' icon={<CheckOutlined />} />
								</Popconfirm>
								<ButtonExtend
									onClick={() => (setViewYeuCau(true), setRecord(rec))}
									tooltip='Yêu cầu chỉnh sửa'
									type='link'
									icon={<EditOutlined style={{ color: 'yellow' }} />}
								/>
								<ButtonExtend tooltip='Tải biểu mẫu' type='link' icon={<ArrowDownOutlined />} />
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
				columns={columns}
				params={{ maHocKy: recHocKy?.ma }}
				dependencies={[page, limit, recHocKy?.ma]}
				modelName='noingoaitru.dotkhaibao'
				title='Đợt khai báo nội ngoại trú'
				Form={Form}
				widthDrawer={800}
				rowSelection
				deleteMany
				otherButtons={[
					<>
						<SelectHocKy
							allowClear
							style={{ width: 250 }}
							value={recHocKy?.ma}
							onChange={(val) => {
								retRecHocKy(danhSachHocKy?.find((item) => item.ma === val));
							}}
							isSetRecord
							selectMa
						/>
					</>,
				]}
			/>
			<ModalYeuCauChinhSua visibleForm={viewYeuCau} setVisibleForm={setViewYeuCau} />
			<ViewChiTiet visibleForm={viewChitiet} setVisibleForm={setViewChiTiet} />
		</>
	);
};
export default DotKhaiBaoNoiNgoaiTruPage;
