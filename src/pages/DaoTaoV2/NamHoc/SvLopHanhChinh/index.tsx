import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import ModalChiTietSinhVien from '@/pages/DaoTaoV2/SinhVien/component/ModalChiTietSinhVien';
import { type LopHanhChinh } from '@/services/DaoTaoV2/NamHoc/LopHanhChinh/typings';
import { formatPhoneNumber } from '@/utils/utils';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';

const SinhVienLopHanhChinh = (props: { hideCard?: boolean }) => {
	const intl = useIntl();
	const { getModel, page, limit, deleteModel } = useModel('daotaov2.namhoc.sinhvienlophanhchinh');
	const { record: recLopHanhChinh } = useModel('daotaov2.namhoc.lophanhchinh');
	const { handleView: handleViewSinhVien } = useModel('daotaov2.sinhvien.sinhvien');
	const { hideCard } = props;
	const [sinhVienSsoId, setSinhVienSsoId] = useState<string>();

	const getData = () => {
		getModel({ lopHanhChinhId: recLopHanhChinh?._id });
	};

	const onCell = (rec: LopHanhChinh.IRecordSinhVien) => ({
		onClick: () => {
			setSinhVienSsoId(rec.sinhVien?.ssoId);
			handleViewSinhVien();
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<LopHanhChinh.IRecordSinhVien>[] = [
		{
			title: intl.formatMessage({ id: 'lophanhchinh.step.dssv.column.masv' }),
			width: 100,
			render: (val, rec) => rec?.sinhVien?.ma,
			align: 'center',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'lophanhchinh.step.dssv.column.hoten' }),
			width: 150,
			dataIndex: 'sinhVienSsoId',
			render: (val, rec) => rec?.sinhVien?.ten,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'lophanhchinh.step.dssv.column.cccd' }),
			width: 100,
			render: (val, rec) => rec?.sinhVien?.cccd,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'lophanhchinh.step.dssv.column.sdt' }),
			width: 100,
			render: (val, rec) => rec?.sinhVien?.soDienThoai && formatPhoneNumber(rec?.sinhVien?.soDienThoai),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'lophanhchinh.step.dssv.column.thaotac' }),
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (record: LopHanhChinh.IRecordSinhVien) => (
				<>
					<Tooltip title={intl.formatMessage({ id: 'global.button.xoa' })}>
						<Popconfirm
							onConfirm={() =>
								deleteModel(record._id, getData, {
									messageText: intl.formatMessage({ id: 'global.message.xoathanhcong' }),
								})
							}
							title={intl.formatMessage({ id: 'lophanhchinh.step.dssv.column.confirm.xoa' })}
							placement='topRight'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	return (
		<>
			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, recLopHanhChinh?._id]}
				params={{ lopHanhChinhId: recLopHanhChinh?._id }}
				modelName='daotaov2.namhoc.sinhvienlophanhchinh'
				title={intl.formatMessage({ id: 'namhoc.svlophanhchinh.title' })}
				Form={Form}
				formProps={{ getData }}
				hideCard={hideCard}
				rowSelection
				deleteMany
			/>

			<ModalChiTietSinhVien sinhVienSsoId={sinhVienSsoId ?? ''} />
		</>
	);
};

export default SinhVienLopHanhChinh;
