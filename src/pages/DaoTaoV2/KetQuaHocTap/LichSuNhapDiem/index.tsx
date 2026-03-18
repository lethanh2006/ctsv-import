import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type ELoaiLogDiem } from '@/services/DaoTaoV2/HocKy/constant';
import { type LichSuNhapDiem } from '@/services/DaoTaoV2/KetQuaHocTap/LichSuNhapDiem/typing';
import { Modal } from 'antd';
import dayjs from 'dayjs';
import { useIntl, useModel } from 'umi';
import { useEffect } from 'react';
import { EOperatorType } from '@/components/Table/constant';

const ModalLichSuNhapDiem = (props: {
	visible: boolean;
	setVisible: (val: boolean) => void;
	loaiLogDiems: ELoaiLogDiem[];
	lopHocPhanId?: string;
	maHocPhan?: string;
}) => {
	const intl = useIntl();
	const { page, limit, getModel } = useModel('daotaov2.ketquahoctap.lichsunhapdiem');
	const { visible, setVisible, loaiLogDiems, lopHocPhanId, maHocPhan } = props;

	const getData = () =>
		visible &&
		(lopHocPhanId || maHocPhan) &&
		getModel({ lopHocPhanId, maHocPhan }, [
			{ active: true, field: 'loaiLogDiem', values: loaiLogDiems, operator: EOperatorType.INCLUDE },
		]);

	useEffect(() => {
		// Reload khi Mở modal
		// Cho vào dependencies TableBase ko nhận
		getData();
	}, [visible]);

	const columns: IColumn<LichSuNhapDiem.IRecord>[] = [
		{
			title: 'Mã sinh viên',
			dataIndex: 'maSinhVien',
			align: 'center',
			width: 100,
			filterType: 'string',
		},
		{
			title: 'Họ tên',
			dataIndex: 'tenSinhVien',
			width: 150,
			filterType: 'string',
		},
		{
			title: 'Hoạt động',
			dataIndex: 'noiDung',
			width: 250,
			// render: (val, rec) => `Cập nhật điểm ${rec.loaiDiem} từ '${rec.diemCu ?? ''}' → '${rec.diemMoi ?? ''}'`,
		},
		{
			title: 'Người thao tác',
			dataIndex: 'editedByFullname',
			filterType: 'string',
			render: (val, rec) => val ?? rec.editedByUsername,
			width: 120,
		},
		{
			title: 'Thời gian',
			dataIndex: 'timestamp',
			align: 'center',
			filterType: 'datetime',
			sortable: true,
			render: (val) => val && dayjs(val).format('HH:mm DD/MM/YYYY'),
			width: 120,
		},
	];

	return (
		<Modal
			title={intl.formatMessage({ id: 'ketquahoctap.lichsunhapdiem.title' })}
			open={visible}
			onCancel={() => setVisible(false)}
			okButtonProps={{ hidden: true }}
			cancelText='Đóng'
			width={1000}
		>
			<TableBase
				hideCard
				getData={getData}
				columns={columns}
				dependencies={[page, limit, lopHocPhanId, maHocPhan]}
				modelName='daotaov2.ketquahoctap.lichsunhapdiem'
				buttons={{ create: false }}
			/>
		</Modal>
	);
};

export default ModalLichSuNhapDiem;
