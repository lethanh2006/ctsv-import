import TableBase from '@/components/Table';
import { EOperatorType } from '@/components/Table/constant';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { type IColumn } from '@/components/Table/typing';
import { type ELoaiLogDiem } from '@/services/DaoTaoV2/HocKy/constant';
import { type LichSuNhapDiem } from '@/services/DaoTaoV2/KetQuaHocTap/LichSuNhapDiem/typing';
import { formatDateTime } from '@/utils/formatDate';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const ModalLichSuNhapDiem = (props: {
	visible: boolean;
	setVisible: (val: boolean) => void;
	loaiLogDiems?: ELoaiLogDiem[];
	lopHocPhanId?: string;
	maHocPhan?: string;
	sinhVienSsoId?: string;
}) => {
	const intl = useIntl();
	const { page, limit, getModel } = useModel('daotaov2.ketquahoctap.lichsunhapdiem');
	const { visible, setVisible, loaiLogDiems, lopHocPhanId, maHocPhan, sinhVienSsoId } = props;

	const getData = () =>
		visible &&
		(lopHocPhanId || maHocPhan || sinhVienSsoId) &&
		getModel(
			{ lopHocPhanId, maHocPhan, sinhVienSsoId },
			loaiLogDiems?.length
				? [{ active: true, field: 'loaiLogDiem', values: loaiLogDiems, operator: EOperatorType.INCLUDE }]
				: undefined,
		);

	useEffect(() => {
		// Reload khi Mở modal
		// Cho vào dependencies TableBase ko nhận
		getData();
	}, [visible]);

	const columns: IColumn<LichSuNhapDiem.IRecord>[] = [
		{
			title: 'Mã SV',
			dataIndex: 'maSinhVien',
			align: 'center',
			width: 120,
			filterType: 'string',
			hide: !!sinhVienSsoId,
		},
		{
			title: 'Họ tên',
			dataIndex: 'tenSinhVien',
			width: 160,
			filterType: 'string',
			hide: !!sinhVienSsoId,
		},
		{
			title: 'Mã HP',
			dataIndex: 'maHocPhan',
			width: 100,
			filterType: 'string',
			hide: !!maHocPhan || !!lopHocPhanId,
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
			width: 150,
		},
		{
			title: 'Thời gian',
			dataIndex: 'timestamp',
			align: 'center',
			filterType: 'datetime',
			sortable: true,
			render: (val) => val && formatDateTime(val),
			width: 120,
		},
	];

	return (
		<ModalExpandable
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
		</ModalExpandable>
	);
};

export default ModalLichSuNhapDiem;
