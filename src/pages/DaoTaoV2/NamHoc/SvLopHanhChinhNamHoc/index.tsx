import TableBase from '@/components/Table';
import { EOperatorType } from '@/components/Table/constant';
import { type IColumn } from '@/components/Table/typing';
import ModalChiTietSinhVien from '@/pages/DaoTaoV2/SinhVien/component/ModalChiTietSinhVien';
import {
	EVaiTroBanCanSuLop,
	MapKeyColorVaiTroBanCanSuLop,
	MapKeyNameVaiTroBanCanSuLop,
} from '@/services/DaoTaoV2/LopHanhChinhSinhVienNamHoc/constants';
import type { LopHanhChinhSinhVienNamHoc } from '@/services/DaoTaoV2/LopHanhChinhSinhVienNamHoc/typings';
import type { LopHanhChinh } from '@/services/DaoTaoV2/NamHoc/LopHanhChinh/typings';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tag, Tooltip } from 'antd';
import { useCallback, useState } from 'react';
import { useIntl, useModel } from 'umi';
import FilterLopHanhChinh from '../LopHanhChinh/components/FilterLopHanhChinh';
import SelectNamHoc from '../NamHoc/components/Select';
import FormBanCanSuLop from './Form';

const SinhVienLopHanhChinhNamHoc = (props: { lopHanhChinh?: LopHanhChinh.IRecord }) => {
	const intl = useIntl();
	const { danhSach: danhSachNamHoc, setRecord: setRecNamHoc, record: recNamHoc } = useModel('daotaov2.namhoc.namhoc');
	const { getModel, page, limit, deleteModel, handleEdit } = useModel('daotaov2.lophcsvnamhoc.lophcsvnamhoc');
	const { record: recLopHanhChinh } = useModel('daotaov2.namhoc.lophanhchinh');
	const { handleView: handleViewSinhVien } = useModel('daotaov2.sinhvien.sinhvien');
	const [sinhVienSsoId, setSinhVienSsoId] = useState<string>();

	const onCell = (rec: LopHanhChinhSinhVienNamHoc.IRecord) => ({
		onClick: () => {
			setSinhVienSsoId(rec.lopHcSv.sinhVien?.ssoId);
			handleViewSinhVien();
		},
		style: { cursor: 'pointer' },
	});

	const getData = () => {
		getModel(
			{ maNamHoc: recNamHoc?.ma },
			props?.lopHanhChinh?._id || recLopHanhChinh?._id
				? [
						{
							field: ['lopHcSv', 'lopHanhChinh', '_id'],
							operator: EOperatorType.EQUAL,
							values: [props?.lopHanhChinh?._id || recLopHanhChinh?._id || ''],
						},
					]
				: (undefined as any),
		);
	};

	const columns: IColumn<LopHanhChinhSinhVienNamHoc.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'lophanhchinh.step.bcsl.column.namhoc' }),
			width: 100,
			dataIndex: 'maNamHoc',
			render: (val, rec) => danhSachNamHoc.find((item) => item.ma === val)?.ten,
			align: 'center',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'lophanhchinh.step.bcsl.column.masv' }),
			width: 100,
			render: (val, rec) => rec?.lopHcSv?.sinhVien?.ma,
			align: 'center',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'lophanhchinh.step.bcsl.column.hoten' }),
			width: 150,
			align: 'center',
			render: (val, rec) => rec?.lopHcSv?.sinhVien?.ten,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'lophanhchinh.step.bcsl.column.lop' }),
			width: 150,
			align: 'center',
			render: (val, rec) => rec?.lopHcSv?.lopHanhChinh?.ten,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'lophanhchinh.step.bcsl.column.vaitro' }),
			dataIndex: 'vaiTro',
			width: 200,
			align: 'center',
			render: (val: EVaiTroBanCanSuLop) => (
				<Tag color={MapKeyColorVaiTroBanCanSuLop[val]}>{MapKeyNameVaiTroBanCanSuLop[val]}</Tag>
			),
			filterType: 'select',
			filterData: Object.values(EVaiTroBanCanSuLop).map((item) => ({
				value: item,
				label: MapKeyNameVaiTroBanCanSuLop[item],
			})),
			onCell,
		},

		{
			title: intl.formatMessage({ id: 'lophanhchinh.step.bcsl.column.thaotac' }),
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (record: LopHanhChinhSinhVienNamHoc.IRecord) => (
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
							title={intl.formatMessage({ id: 'lophanhchinh.step.bcsl.confirm.xoa' })}
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
		() => <FormBanCanSuLop lopHanhChinh={props?.lopHanhChinh} getData={getData} />,
		[recLopHanhChinh?._id, recNamHoc?.ma, props?.lopHanhChinh?._id],
	);

	return (
		<>
			<TableBase
				hideCard={props?.lopHanhChinh?._id ? true : false}
				columns={columns}
				buttons={{ import: true }}
				otherButtons={[
					<>{!props.lopHanhChinh?._id && <FilterLopHanhChinh key={'lop-hanh-chinh'} />}</>,
					<SelectNamHoc
						allowClear
						selectMa
						value={recNamHoc?.ma}
						onChange={(val) => setRecNamHoc(danhSachNamHoc.find((item) => item.ma === val))}
						style={{ width: 200 }}
						key={'namhoc'}
					/>,
				]}
				dependencies={[page, limit, recLopHanhChinh?._id, recNamHoc?.ma]}
				getData={getData}
				modelName='daotaov2.lophcsvnamhoc.lophcsvnamhoc'
				title={intl.formatMessage({ id: 'lophanhchinh.step.bcsl.title' })}
				Form={Form}
			/>
			<ModalChiTietSinhVien sinhVienSsoId={sinhVienSsoId ?? ''} />
		</>
	);
};

export default SinhVienLopHanhChinhNamHoc;
