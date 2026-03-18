import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import ModalChiTietSinhVien from '@/pages/DaoTaoV2/SinhVien/component/ModalChiTietSinhVien';
import type { DangKyNhuCau } from '@/services/DaoTaoV2/HocKy/DangKyNhuCau/typing';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import FormSinhVienDotDangKy from './Form';

const SinhVienDotDangKyNhuCauPage = () => {
	const { getModel, page, limit, deleteModel } = useModel('daotaov2.hocky.dangkynhucau');
	const { record: recDotDangKy } = useModel('daotaov2.hocky.dotdangkynhucau');
	const { setVisibleForm: setVisibleSinhVien } = useModel('daotaov2.sinhvien.sinhvien');
	const [sinhVienSsoId, setSinhVienSsoId] = useState<string>();

	const onCell = (rec: DangKyNhuCau.IDangKyNhuCau) => ({
		onClick: () => {
			setSinhVienSsoId(rec.sinhVien?._id);
			setVisibleSinhVien(true);
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<DangKyNhuCau.IDangKyNhuCau>[] = [
		{
			title: 'Mã sinh viên',
			width: 120,
			render: (val, rec) => rec.sinhVien?.ma,
			onCell,
		},
		{
			title: 'Họ tên',
			width: 150,
			render: (val, rec) => rec.sinhVien?.ten,
			onCell,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 80,
			fixed: 'right',
			render: (val, rec) => (
				<Tooltip title='Loại bỏ'>
					<Popconfirm
						onConfirm={() => deleteModel(rec._id, () => getModel({ dotDkNhuCauId: recDotDangKy?._id }))}
						title='Bạn có chắc chắn muốn bỏ sinh viên này khỏi đợt đăng ký?'
						placement='topRight'
					>
						<Button danger type='link' icon={<DeleteOutlined />} />
					</Popconfirm>
				</Tooltip>
			),
		},
	];

	return (
		<>
			<TableBase
				columns={columns}
				params={{ dotDkNhuCauId: recDotDangKy?._id }}
				dependencies={[page, limit]}
				modelName='daotaov2.hocky.dangkynhucau'
				title='Sinh viên - Đợt đăng ký nhu cầu'
				Form={FormSinhVienDotDangKy}
				hideCard
				rowSelection
				deleteMany
			/>

			{sinhVienSsoId ? <ModalChiTietSinhVien sinhVienSsoId={sinhVienSsoId} /> : null}
		</>
	);
};

export default SinhVienDotDangKyNhuCauPage;
