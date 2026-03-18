import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import ModalChiTietSinhVien from '@/pages/DaoTaoV2/SinhVien/component/ModalChiTietSinhVien';
import type { NoiNgoaiTru } from '@/services/NoiNgoaiTru/typing';
import { Tag } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';

const TableSinhVienKhaiBao = (props: { isNoiTru?: boolean }) => {
	const { isNoiTru } = props;
	const { record: recDot } = useModel('noingoaitru.dotkhaibao');
	const { getModel, page, limit } = useModel('noingoaitru.khaibao');
	const { handleView } = useModel('sinhvien.sinhvien');
	const [sinhVienSsoId, setSinhVienSsoId] = useState<string>();

	const getData = () => getModel({ dotKhaiBaoId: recDot?._id, dangONoiTru: isNoiTru });

	const onCell = (rec: NoiNgoaiTru.IKhaiBao) => ({
		onClick: () => {
			if (rec.thongTinSinhVien?.sinhVienSsoId) {
				setSinhVienSsoId(rec.thongTinSinhVien?.sinhVienSsoId);
				handleView();
			}
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<NoiNgoaiTru.IKhaiBao>[] = [
		{
			title: 'Mã sinh viên',
			dataIndex: ['thongTinSinhVien', 'maSinhVien'],
			width: 180,
			onCell,
		},
		{
			title: 'Họ và tên',
			dataIndex: ['thongTinSinhVien', 'hoTen'],
			width: 180,
			onCell,
		},
		{
			title: 'Số điện thoại',
			dataIndex: ['thongTinSinhVien', 'soDienThoai'],
			width: 100,
			onCell,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'dangONoiTru',
			align: 'center',
			width: 130,
			render: (val) => {
				const color = val === undefined ? 'default' : val ? 'green' : 'yellow';
				return (
					<Tag color={color}>{val === undefined ? 'Chưa khai báo' : val ? 'Đang ở nội trú' : 'Đang ở ngoại trú'}</Tag>
				);
			},
			onCell,
		},
	];

	return (
		<>
			<TableBase
				params={{ dotKhaiBaoId: recDot?._id, dangONoiTru: isNoiTru }}
				dependencies={[page, limit, recDot?._id, isNoiTru]}
				columns={columns}
				modelName='noingoaitru.khaibao'
				getData={getData}
				buttons={{ export: true, create: false }}
				hideCard
			/>

			<ModalChiTietSinhVien sinhVienSsoId={sinhVienSsoId ?? ''} hasDetail />
		</>
	);
};

export default TableSinhVienKhaiBao;
