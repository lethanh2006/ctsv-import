import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import ModalChiTietSinhVien from '@/pages/DaoTaoV2/SinhVien/component/ModalChiTietSinhVien';
import {
	EVaiTroBanCanSuLop,
	MapKeyColorVaiTroBanCanSuLop,
	MapKeyNameVaiTroBanCanSuLop,
} from '@/services/DaoTaoV2/LopHanhChinhSinhVienNamHoc/constants';
import type { LopHanhChinh } from '@/services/DaoTaoV2/NamHoc/LopHanhChinh/typings';
import type { SinhVien } from '@/services/DaoTaoV2/SinhVien/typings';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tag, Tooltip } from 'antd';
import { useCallback, useState } from 'react';
import { useIntl, useModel } from 'umi';
import FilterLopHanhChinh from '../../NamHoc/LopHanhChinh/components/FilterLopHanhChinh';
import SelectHocKy from '../HocKy/components/SelectHocKy';
import FormBanCanSuLop from './FormBanCanSuLop';

const SinhVienHocKy = (props: { lopHanhChinh?: LopHanhChinh.IRecord }) => {
	const intl = useIntl();
	const { danhSach: danhSachHocKy, setRecord: setRecNamHoc, record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { getModel, page, limit, deleteModel, handleEdit } = useModel('daotaov2.hocky.sinhvienhocky');
	const { record: recLopHanhChinh } = useModel('daotaov2.namhoc.lophanhchinh');
	const { handleView: handleViewSinhVien } = useModel('daotaov2.sinhvien.sinhvien');

	const [sinhVienSsoId, setSinhVienSsoId] = useState<string>();

	const onCell = (rec: SinhVien.ISinhVienHocKy) => ({
		onClick: () => {
			setSinhVienSsoId(rec?.sinhVienSsoId);
			handleViewSinhVien();
		},
		style: { cursor: 'pointer' },
	});

	const getData = () => {
		getModel({
			maHocKy: recHocKy?.ma,
			lopHanhChinhId: recLopHanhChinh?._id,
			// vaiTro: { $in: [EVaiTroBanCanSuLop.LOP_TRUONG, EVaiTroBanCanSuLop.LOP_PHO] } as any,
		});
	};

	const columns: IColumn<SinhVien.ISinhVienHocKy>[] = [
		{
			title: intl.formatMessage({ id: 'lophanhchinh.step.svbancansu.column.hocky' }),
			width: 200,
			dataIndex: 'maHocKy',
			render: (val, rec) => rec?.hocKy?.ten,
			align: 'center',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'lophanhchinh.step.svbancansu.column.masv' }),
			width: 100,
			dataIndex: ['sinhVien', 'ma'],
			render: (val, rec) => rec?.sinhVien?.ma,
			align: 'center',
			onCell,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'lophanhchinh.step.svbancansu.column.hoten' }),
			width: 150,
			align: 'center',
			dataIndex: ['sinhVien', 'ten'],
			render: (val, rec) => rec?.sinhVien?.ten,
			onCell,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'lophanhchinh.step.svbancansu.column.lop' }),
			width: 150,
			align: 'center',
			dataIndex: ['lopHanhChinh', 'ten'],
			render: (val, rec) => rec?.lopHanhChinh?.ten,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'lophanhchinh.step.svbancansu.column.vaitro' }),
			dataIndex: 'vaiTro',
			width: 150,
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
			title: intl.formatMessage({ id: 'lophanhchinh.step.svbancansu.column.thaotac' }),
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (record: SinhVien.ISinhVienHocKy) => (
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
							title={intl.formatMessage({ id: 'lophanhchinh.step.svbancansu.confirm.xoa' })}
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
		[recLopHanhChinh?._id, recHocKy?.ma, props?.lopHanhChinh?._id],
	);

	return (
		<>
			<TableBase
				hideCard={props?.lopHanhChinh?._id ? true : false}
				columns={columns}
				buttons={{ import: true, export: true }}
				otherButtons={[
					<>{!props.lopHanhChinh?._id && <FilterLopHanhChinh key={'lop-hanh-chinh'} />}</>,
					<SelectHocKy
						allowClear
						selectMa
						value={recHocKy?.ma}
						onChange={(val) => setRecNamHoc(danhSachHocKy.find((item) => item.ma === val))}
						style={{ width: 250 }}
						key={'namhoc'}
					/>,
				]}
				dependencies={[page, limit, recLopHanhChinh?._id, recHocKy?.ma]}
				getData={getData}
				modelName='daotaov2.hocky.sinhvienhocky'
				title={intl.formatMessage({ id: 'lophanhchinh.step.svbancansu.title' })}
				Form={Form}
				params={{
					lopHanhChinhId: recLopHanhChinh?._id,
					maHocKy: recHocKy?.ma,
				}}
			/>
			<ModalChiTietSinhVien sinhVienSsoId={sinhVienSsoId ?? ''} />
		</>
	);
};

export default SinhVienHocKy;
