import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import ModalImport from '@/components/Table/Import';
import { type IColumn } from '@/components/Table/typing';
import type { XetHocVu } from '@/services/DaoTaoV2/KetQuaHocTap/XetHocVu/typing';
import { DeleteOutlined, ImportOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useModel } from 'umi';

const KyLuatPage = (props: { type: 'thi-ho' | 'no-hoc-phi' }) => {
	const { type } = props;
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { page, limit, getModel, deleteModel } = useModel('daotaov2.ketquahoctap.xethocvu.kyluat');
	const [visibleImport, setVisibleImport] = useState<boolean>(false);
	const ngoaiThoiGianHopHoiDong = !recHocKy?.tgHopHoiDongHvu || dayjs().isAfter(recHocKy?.tgHopHoiDongHvu, 'd');

	const getData = () =>
		recHocKy?.ma &&
		getModel(
			type === 'thi-ho'
				? { maHocKy: recHocKy?.ma, biKyLuatThiHo: true }
				: { maHocKy: recHocKy?.ma, biThongBaoNoHocPhi: true },
		);

	const columns: IColumn<XetHocVu.IKyLuat>[] = [
		{
			title: 'Mã SV',
			dataIndex: 'maSinhVien',
			width: 120,
			align: 'center',
			filterType: 'string',
		},
		{
			title: 'Họ tên',
			width: 180,
			render: (val, rec) => rec.sinhVien.ten,
		},
		{
			title: 'Khóa',
			width: 100,
			render: (val, rec) => rec.sinhVien?.maKhoaSinhVien,
		},
		{
			title: 'Ngành',
			width: 150,
			render: (val, rec) => rec.sinhVien?.maNganh,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (record: XetHocVu.IKyLuat) => (
				<Popconfirm
					onConfirm={() => deleteModel(record._id, getData)}
					title='Bạn có chắc chắn muốn xóa sinh viên này?'
					placement='topRight'
				>
					<ButtonExtend
						disabled={(recHocKy?.daChotKqCanhBao && recHocKy?.daChotKqThoiHoc) || ngoaiThoiGianHopHoiDong}
						tooltip='Xóa'
						danger
						type='link'
						icon={<DeleteOutlined />}
					/>
				</Popconfirm>
			),
		},
	];

	return (
		<>
			<TableBase
				columns={columns}
				getData={getData}
				dependencies={[page, limit, type, recHocKy?.ma]}
				modelName='daotaov2.ketquahoctap.xethocvu.kyluat'
				buttons={{ create: false }}
				otherButtons={[
					<ButtonExtend
						disabled={(recHocKy?.daChotKqCanhBao && recHocKy?.daChotKqThoiHoc) || ngoaiThoiGianHopHoiDong}
						onClick={() => setVisibleImport(true)}
						notHideText
						icon={<ImportOutlined />}
						key='import'
					>
						Nhập dữ liệu
					</ButtonExtend>,
				]}
				hideCard
			/>

			<ModalImport
				modelName={type === 'thi-ho' ? 'ketquahoctap.xethocvu.kyluatthiho' : 'ketquahoctap.xethocvu.kyluathocphi'}
				onCancel={() => setVisibleImport(false)}
				visible={visibleImport}
				onOk={() => {
					setVisibleImport(false);
					getData();
				}}
			/>
		</>
	);
};

export default KyLuatPage;
