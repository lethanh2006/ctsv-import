import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined, MenuOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Space, Tooltip } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import NhomTietHocPage from '../NhomTietHoc';
import SelectNhomTietHoc from '../NhomTietHoc/components/SelectNhomTietHoc';
import Form from './components/Form';

const TietHoc = (props: { hideCard?: boolean }) => {
	const intl = useIntl();
	const { handleEdit, getModel, page, limit, deleteModel } = useModel('daotaov2.danhmuc.tiethoc');
	const {
		record: recNhomTietHoc,
		setRecord: setNhom,
		danhSach: danhSachNhom,
	} = useModel('daotaov2.danhmuc.nhomtiethoc');
	const [visibleNhom, setVisibleNhom] = useState<boolean>(false);

	const getData = () => recNhomTietHoc?.ma && getModel({ maNhomTietHoc: recNhomTietHoc?.ma });

	const columns: IColumn<TietHoc.IRecordCoSo>[] = [
		{
			title: 'Tiết học',
			dataIndex: 'tietHoc',
			align: 'center',
			width: 80,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Thời gian bắt đầu',
			dataIndex: 'timeBatDau',
			align: 'center',
			width: 100,
			sortable: true,
			render: (val) => (val ? val?.slice(0, -3) : ''),
		},
		{
			title: 'Thời gian kết thúc',
			dataIndex: 'timeKetThuc',
			align: 'center',
			width: 100,
			sortable: true,
			render: (val) => (val ? val?.slice(0, -3) : ''),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: TietHoc.IRecordCoSo) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getData)}
							title='Bạn có chắc chắn muốn xóa tiết học này?'
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
				dependencies={[page, limit, recNhomTietHoc?.ma]}
				getData={getData}
				modelName='daotaov2.danhmuc.tiethoc'
				title={intl.formatMessage({ id: 'danhmuchethong.coso.tiethoc.title' })}
				Form={Form}
				rowSelection
				deleteMany
				hideCard={props?.hideCard}
				buttons={{ import: true, export: true }}
				addStt={false}
			>
				<Space style={{ marginBottom: 12 }}>
					<SelectNhomTietHoc
						selectMa
						style={{ width: 250 }}
						value={recNhomTietHoc?.ma}
						onChange={(val) => setNhom(danhSachNhom.find((item) => item.ma === val))}
						isSetRecord
					/>

					<Button icon={<MenuOutlined />} onClick={() => setVisibleNhom(true)} />
				</Space>
			</TableBase>

			<Modal
				open={visibleNhom}
				onCancel={() => setVisibleNhom(false)}
				style={{ padding: 0 }}
				width={1000}
				okButtonProps={{ hidden: true }}
				cancelText='Đóng'
			>
				<NhomTietHocPage />
			</Modal>
		</>
	);
};

export default TietHoc;
