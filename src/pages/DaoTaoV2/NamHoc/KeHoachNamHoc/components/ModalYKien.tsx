import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import SelectDonVi from '@/pages/DaoTaoV2/ToChucNhanSu/DonVi/Select';
import type { KeHoachNamHoc } from '@/services/DaoTaoV2/NamHoc/KeHoachNamHoc/typings';
import { ETrangThaiYKienKeHoachNamHoc, colorTrangThaiYKienKeHoachNamHoc } from '@/services/DaoTaoV2/NamHoc/constant';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Descriptions, Modal, Popconfirm, Tag } from 'antd';
import { useIntl, useModel } from 'umi';
import FormXinYKien from './FormXinYKien';

const ModalYKien = (props: { visible: boolean; onCancel: () => void }) => {
	const intl = useIntl();
	const { visible, onCancel } = props;
	const { page, limit, getModel, duyetYKienKeHoachNamHocModel } = useModel('daotaov2.namhoc.ykienkehoachnamhoc');
	const { record: recNam } = useModel('daotaov2.namhoc.namhoc');

	const getData = () => recNam?._id && getModel({ namHocId: recNam?._id });

	const handleDuyet = (rec: KeHoachNamHoc.YKienKeHoachNamHoc, trangThai: ETrangThaiYKienKeHoachNamHoc) => {
		duyetYKienKeHoachNamHocModel(rec?._id ?? '', { trangThai }).then(() => {
			getData();
		});
	};

	const columns: IColumn<KeHoachNamHoc.YKienKeHoachNamHoc>[] = [
		{
			title: 'Mã cán bộ',
			width: 120,
			render: (val, rec) => rec.nhanSu?.maCanBo,
		},
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			width: 150,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Đơn vị',
			dataIndex: 'maDonVi',
			width: 150,
			filterType: 'customselect',
			filterCustomSelect: <SelectDonVi multiple />,
			render: (val, rec) => rec.donVi?.ten ?? val,
		},
		{
			title: 'Nội dung',
			dataIndex: 'noiDung',
			width: 250,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			align: 'center',
			filterType: 'select',
			filterData: Object.values(ETrangThaiYKienKeHoachNamHoc),
			render: (val, rec) => (
				<Tag color={colorTrangThaiYKienKeHoachNamHoc[val as ETrangThaiYKienKeHoachNamHoc]}>{val}</Tag>
			),
			width: 120,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (rec) => (
				<>
					<Popconfirm
						disabled={recNam?.daChotKeHoachNamHoc}
						onConfirm={() => handleDuyet(rec, ETrangThaiYKienKeHoachNamHoc.DUYET)}
						title='Bạn có chắc chắn muốn duyệt ý kiến phòng ban?'
						placement='topRight'
					>
						<ButtonExtend
							disabled={recNam?.daChotKeHoachNamHoc}
							tooltip='Duyệt'
							type='link'
							className='btn-success'
							icon={<CheckOutlined />}
						/>
					</Popconfirm>
					<Popconfirm
						disabled={recNam?.daChotKeHoachNamHoc}
						onConfirm={() => handleDuyet(rec, ETrangThaiYKienKeHoachNamHoc.KHONG_DUYET)}
						title='Bạn có chắc chắn không duyệt ý kiến phòng ban?'
						placement='topRight'
					>
						<ButtonExtend
							disabled={recNam?.daChotKeHoachNamHoc}
							tooltip='Không duyệt'
							danger
							type='link'
							icon={<CloseOutlined />}
						/>
					</Popconfirm>
				</>
			),
		},
	];

	return (
		<Modal
			open={visible}
			onCancel={() => onCancel()}
			title='Danh sách ý kiến kế hoạch năm học'
			footer={null}
			maskClosable={false}
			width={1000}
		>
			<Descriptions column={1}>
				<Descriptions.Item label='Năm học'>{recNam?.ten}</Descriptions.Item>
			</Descriptions>

			<div className='fw500'>Thời gian xin ý kiến:</div>
			<FormXinYKien visible={visible} />

			<div className='fw500'>{intl.formatMessage({ id: 'namhoc.ykienkehoachnamhoc.title' })}:</div>
			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, recNam?._id]}
				modelName='daotaov2.namhoc.ykienkehoachnamhoc'
				buttons={{ create: false }}
				hideCard
			/>
		</Modal>
	);
};

export default ModalYKien;
