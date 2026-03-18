import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import dayjs from 'dayjs';
// import { useState } from 'react';
import { useIntl, useModel } from 'umi';
// import ModalChiTietKhoaSinhVien from '../KhoaSinhVien/components/ModalChiTiet';
import ModalDotNhapHoc from './components/ModalDotNhapHoc';

const DotNhapHoc = () => {
	const intl = useIntl();
	const { setEdit, setVisibleForm, setRecord, getModel, page, limit, deleteModel } =
		useModel('daotaov2.namhoc.dotnhaphoc');
	// const [visibleKhoaSv, setVisibleKhoaSv] = useState<boolean>(false);
	// const [khoaSinhVienId, setKhoaSinhVienId] = useState<string>();

	const handleEdit = (record: DotNhapHoc.IRecord) => {
		setRecord(record);
		setVisibleForm(true);
		setEdit(true);
	};

	const onCell = (record: DotNhapHoc.IRecord) => ({
		onClick: () => handleEdit(record),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<DotNhapHoc.IRecord>[] = [
		// {
		//   title: 'Khóa sinh viên',
		//   width: 150,
		//   dataIndex: 'khoaSinhVienId',
		//   render: (val, rec) => (
		//     <a
		//       onClick={() => {
		//         setKhoaSinhVienId(rec?.khoaSinhVienId);
		//         setVisibleKhoaSv(true);
		//       }}
		//     >
		//       {rec?.khoaSinhVien?.ten}
		//     </a>
		//   ),
		//   filterType: 'customselect',
		//   filterCustomSelect: <SelectKhoaSinhVien hasCreate={false} multiple />,
		// },
		{
			title: 'Số thứ tự',
			dataIndex: 'soThuTu',
			width: 80,
			align: 'center',
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Thời gian bắt đầu',
			width: 150,
			align: 'center',
			dataIndex: 'thoiGianBatDau',
			render: (val) => <>{val ? dayjs(val).format('DD/MM/YYYY') : 'Không xác định'}</>,
			onCell,
		},
		{
			title: 'Thời gian kết thúc',
			width: 150,
			align: 'center',
			dataIndex: 'thoiGianKetThuc',
			render: (val, rec) => <>{val ? dayjs(val).format('DD/MM/YYYY') : 'Không xác định'}</>,
			onCell,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: DotNhapHoc.IRecord) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getModel)}
							title='Bạn có chắc chắn muốn xóa đợt nhập học này?'
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
				columns={columns}
				dependencies={[page, limit]}
				modelName='daotaov2.namhoc.dotnhaphoc'
				title={intl.formatMessage({ id: 'namhoc.dotnhaphoc.title' })}
				Form={ModalDotNhapHoc}
				widthDrawer={800}
				rowSelection
				deleteMany
			/>

			{/* {khoaSinhVienId ? (
        <ModalChiTietKhoaSinhVien
          visible={visibleKhoaSv}
          setVisible={setVisibleKhoaSv}
          khoaSinhVienId={khoaSinhVienId}
          hasEdit={false}
        />
      ) : null} */}
		</>
	);
};

export default DotNhapHoc;
