import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import type { LopHanhChinh } from '@/services/DaoTaoV2/NamHoc/LopHanhChinh/typings';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useCallback } from 'react';
import { useIntl, useModel } from 'umi';
import FormCoVanHocTap from './Form';

const CoVanLopHanhChinhNamHoc = (props: { lopHanhChinh?: LopHanhChinh.IRecord }) => {
	const intl = useIntl();
	const { danhSach: danhSachNamHoc, setRecord: setRecNamHoc, record: recNamHoc } = useModel('daotaov2.namhoc.namhoc');
	const { getModel, page, limit, deleteModel, handleEdit } = useModel('daotaov2.lophcnsnamhoc.lophcnsnamhoc');
	const { record: recLopHanhChinh } = useModel('daotaov2.namhoc.lophanhchinh');

	// useEffect(() => {
	// 	setFilters([
	// 		...filters,
	// 		{
	// 			path: ['lopHcSv', 'lopHanhChinh', '_id'],
	// 			operator: EOperatorType.EQUAL,
	// 			values: [recLopHanhChinh?._id ?? ''],
	// 		},
	// 	]);
	// }, [recLopHanhChinh?._id]);

	const getData = () => {
		getModel({ tenLopHc: props?.lopHanhChinh?.ten || recLopHanhChinh?.ten, maNamHoc: recNamHoc?.ma });
	};

	const columns: IColumn<LopHanhChinhNhanSuNamHoc.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'lophanhchinh.step.cvht.column.namhoc' }),
			width: 100,
			dataIndex: 'maNamHoc',
			render: (val, rec) => danhSachNamHoc.find((item) => item.ma === val)?.ten,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'lophanhchinh.step.cvht.column.macanbo' }),
			width: 100,
			dataIndex: 'maNhanSu',
			filterType: 'string',
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'lophanhchinh.step.cvht.column.hoten' }),
			width: 150,
			align: 'center',
			dataIndex: 'hoTenNhanSu',
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'lophanhchinh.step.cvht.column.lop' }),
			width: 150,
			align: 'center',
			dataIndex: 'tenLopHc',
		},

		{
			title: intl.formatMessage({ id: 'lophanhchinh.step.cvht.column.thaotac' }),
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (record: LopHanhChinhNhanSuNamHoc.IRecord) => (
				<>
					<Tooltip title={intl.formatMessage({ id: 'global.button.chinhsua' })}>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title={intl.formatMessage({ id: 'global.button.xoa' })}>
						<Popconfirm
							onConfirm={() =>
								deleteModel(record._id, getData, {
									messageText: intl.formatMessage({ id: 'global.message.xoathanhcong' }),
								})
							}
							title={intl.formatMessage({ id: 'lophanhchinh.step.cvht.confirm.xoa' })}
							placement='topRight'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	const Form = useCallback(
		() => <FormCoVanHocTap lopHanhChinh={props?.lopHanhChinh} getData={getData} />,
		[recLopHanhChinh?._id, recNamHoc?.ma, props?.lopHanhChinh?._id],
	);

	return (
		<>
			<TableBase
				hideCard={props.lopHanhChinh?._id ? true : false}
				columns={columns}
				buttons={{ import: true }}
				// otherButtons={[
				// 	<>{!props?.lopHanhChinh && <FilterLopHanhChinh key={'lop-hanh-chinh'} />}</>,
				// 	<SelectNamHoc
				// 		allowClear
				// 		selectMa
				// 		value={recNamHoc?.ma}
				// 		onChange={(val) => setRecNamHoc(danhSachNamHoc.find((item) => item.ma === val))}
				// 		style={{ width: 200 }}
				// 		key={'namhoc'}
				// 	/>,
				// ]}
				dependencies={[page, limit, recLopHanhChinh?._id, recNamHoc?.ma, props?.lopHanhChinh?._id]}
				getData={getData}
				modelName='daotaov2.lophcnsnamhoc.lophcnsnamhoc'
				title={intl.formatMessage({ id: 'lophanhchinh.step.cvht.title' })}
				Form={Form}
				// hideCard={hideCard}
			/>
		</>
	);
};

export default CoVanLopHanhChinhNamHoc;
