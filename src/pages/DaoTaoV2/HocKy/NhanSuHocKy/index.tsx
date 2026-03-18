import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import type { LopHanhChinh } from '@/services/DaoTaoV2/NamHoc/LopHanhChinh/typings';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useCallback } from 'react';
import { useIntl, useModel } from 'umi';

import FilterLopHanhChinh from '../../NamHoc/LopHanhChinh/components/FilterLopHanhChinh';
import SelectHocKy from '../HocKy/components/SelectHocKy';
import FormNhanSuHocKy from './Form';

const NhanSuHocKy = (props: { lopHanhChinh?: LopHanhChinh.IRecord }) => {
	const intl = useIntl();
	const { danhSach: danhSachHocKy, setRecord: setRecHocKy, record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { getModel, page, limit, deleteModel, handleEdit } = useModel('daotaov2.hocky.nhansuhocky');
	const { record: recLopHanhChinh } = useModel('daotaov2.namhoc.lophanhchinh');

	const getData = () => {
		getModel({ tenLopHc: props?.lopHanhChinh?.ten || recLopHanhChinh?.ten, maHocKy: recHocKy?.ma });
	};

	const columns: IColumn<LopHanhChinh.INhanSuHocKy>[] = [
		{
			title: intl.formatMessage({ id: 'lophanhchinh.step.cvhtltc.column.hocky' }),
			width: 100,
			dataIndex: 'maHocKy',
			render: (val, rec) => danhSachHocKy.find((item) => item.ma === val)?.ten,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'lophanhchinh.step.cvhtltc.column.macanbo' }),
			width: 100,
			dataIndex: 'maNhanSu',
			filterType: 'string',
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'lophanhchinh.step.cvhtltc.column.hocten' }),
			width: 150,
			align: 'center',
			dataIndex: 'hoTenNhanSu',
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'lophanhchinh.step.cvhtltc.column.lop' }),
			width: 150,
			align: 'center',
			dataIndex: 'tenLopHc',
		},

		{
			title: intl.formatMessage({ id: 'lophanhchinh.step.cvhtltc.column.thaotac' }),
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (record: LopHanhChinh.INhanSuHocKy) => (
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
							title={intl.formatMessage({ id: 'lophanhchinh.step.cvhtltc.confirm.xoa' })}
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
		() => <FormNhanSuHocKy lopHanhChinh={props?.lopHanhChinh} getData={getData} />,
		[recLopHanhChinh?._id, recHocKy?.ma, props?.lopHanhChinh?._id],
	);

	return (
		<>
			<TableBase
				hideCard={props.lopHanhChinh?._id ? true : false}
				columns={columns}
				buttons={{ import: true, export: true }}
				otherButtons={[
					<>{!props?.lopHanhChinh && <FilterLopHanhChinh key={'lop-hanh-chinh'} />}</>,
					<SelectHocKy
						allowClear
						selectMa
						value={recHocKy?.ma}
						onChange={(val) => setRecHocKy(danhSachHocKy.find((item) => item.ma === val))}
						style={{ width: 300 }}
						key={'namhoc'}
					/>,
				]}
				dependencies={[page, limit, recLopHanhChinh?._id, recHocKy?.ma, props?.lopHanhChinh?._id]}
				getData={getData}
				modelName='daotaov2.hocky.nhansuhocky'
				title={intl.formatMessage({ id: 'lophanhchinh.step.cvhtltc.title' })}
				Form={Form}
				params={{ maHocKy: recHocKy?.ma }}
				// hideCard={hideCard}
			/>
		</>
	);
};

export default NhanSuHocKy;
