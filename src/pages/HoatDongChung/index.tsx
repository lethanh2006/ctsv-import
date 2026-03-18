import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import DanhSachSinhVien from '@/pages/HoatDongChung/DanhSachSinhVien';
import { thongKe } from '@/services/HoatDongChung';
import type { EHoatDongChungType1 } from '@/services/HoatDongChung/constants';
import { EHoatDongChungType2, EHoatDongChungType2I18n } from '@/services/HoatDongChung/constants';
import type { HoatDongChung } from '@/services/HoatDongChung/typings';
import { DeleteOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import SelectCLB from '../CauLacBo/components/SelectCLB';
import SelectHocKy from '../DaoTaoV2/HocKy/HocKy/components/SelectHocKy';
import FormHoatDongChung from './Form';
import ThongKe from './ThongKeSoLuong';

const HoatDongChungPage = (props: {
	phanLoaiCap1: EHoatDongChungType1;
	phanLoaiCap2: EHoatDongChungType2;
	title?: string;
	hideCard?: boolean;
	paramCondition?: any;
}) => {
	const intl = useIntl();
	const { getModel, condition, setCondition, handleEdit, deleteModel, filters, setRecord, record } =
		useModel('hoatdongchung');

	const { danhSach: danhSachCauLacBo } = useModel('caulacbo.caulacbo');
	const { danhSach } = useModel('daotaov2.hocky.hocky');
	const [dataThongKe, setDataThongKe] = useState<any>();
	const [visibleDanhSach, setVisibleDanhSach] = useState<boolean>(false);
	const getData = () => {
		getModel({ phanLoaiCap1: props.phanLoaiCap1, phanLoaiCap2: props.phanLoaiCap2, ...(props?.paramCondition ?? {}) });
	};

	const getThongKe = async () => {
		const res = await thongKe({
			condition: {
				...condition,
				phanLoaiCap1: props.phanLoaiCap1,
				phanLoaiCap2: props.phanLoaiCap2,
				...(props?.paramCondition ?? {}),
			},
			filters,
		});
		setDataThongKe(res?.data?.data?.[0]);
	};

	useEffect(() => {
		getThongKe();
	}, [condition, JSON.stringify(props.paramCondition), props.phanLoaiCap1, props.phanLoaiCap2, filters]);

	const column: IColumn<HoatDongChung.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'tuansinhhoatcongdan.column.tenhd' }),
			dataIndex: 'ten',
			width: 200,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'tuansinhhoatcongdan.column.loai' }),
			dataIndex: 'loai',
			width: 200,
			filterType: 'string',
			align: 'center',
			hide: ![EHoatDongChungType2.TUAN_LE_CONG_DAN, EHoatDongChungType2.HUONG_NGHIEP_VIEC_LAM].includes(
				props.phanLoaiCap2,
			),
		},
		{
			title: intl.formatMessage({ id: 'tuansinhhoatcongdan.column.clb' }),
			dataIndex: ['info', 'refId'],
			width: 200,
			align: 'center',
			hide: ![EHoatDongChungType2.HOAT_DONG_CAU_LAC_BO].includes(props.phanLoaiCap2),
			render: (val) => danhSachCauLacBo.find((item) => item._id === val)?.ten,
		},
		{
			title: intl.formatMessage({ id: 'tuansinhhoatcongdan.column.hocky' }),
			dataIndex: 'maHocKy',
			width: 150,
			render: (val) => danhSach.find((item) => item.ma === val)?.ten,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'tuansinhhoatcongdan.column.tgbd' }),
			dataIndex: 'thoiGianBatDau',
			align: 'center',
			width: 130,
			sortable: true,
			render: (val) => dayjs(val).format('HH:mm DD/MM/YYYY'),
		},
		{
			title: intl.formatMessage({ id: 'tuansinhhoatcongdan.column.tgkt' }),
			dataIndex: 'thoiGianKetThuc',
			align: 'center',
			width: 130,
			render: (val) => dayjs(val).format('HH:mm DD/MM/YYYY'),
		},
		{
			title: intl.formatMessage({ id: 'tuansinhhoatcongdan.column.thaotac' }),
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (recordVal: HoatDongChung.IRecord) => (
				<>
					<Tooltip title={intl.formatMessage({ id: 'global.button.chinhsua' })}>
						<Button
							onClick={() => {
								handleEdit(recordVal);
							}}
							type='link'
							icon={<EditOutlined />}
						/>
					</Tooltip>

					<Tooltip title={intl.formatMessage({ id: 'global.button.xoa' })}>
						<Popconfirm
							onConfirm={() => {
								deleteModel(recordVal._id, getData, {
									messageText: intl.formatMessage({ id: 'global.message.xoathanhcong' }),
								});
							}}
							title={intl.formatMessage({ id: 'tuansinhhoatcongdan.confirm.xoa' })}
						>
							<Button type='link' danger icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
					<Tooltip title={intl.formatMessage({ id: 'tuansinhhoatcongdan.dssv.title' })}>
						<Button
							onClick={() => {
								setRecord(recordVal);
								setVisibleDanhSach(true);
							}}
							type='link'
							icon={<UserOutlined />}
						/>
					</Tooltip>
					{/* <Tooltip title='Xem chi tiết'>
						<Button
							onClick={() => {
								setRecord(record);
								setVisibleDetail(true);
							}}
							type='link'
							icon={<EyeOutlined />}
						/>
					</Tooltip> */}
				</>
			),
		},
	];

	const Form = useCallback(
		() => <FormHoatDongChung getData={getData} phanLoaiCap1={props.phanLoaiCap1} phanLoaiCap2={props.phanLoaiCap2} />,
		[props.phanLoaiCap1, props.phanLoaiCap2],
	);

	return (
		<>
			<div style={{ marginBottom: 16 }}>
				<ThongKe data={dataThongKe} />
			</div>

			<TableBase
				params={{
					phanLoaiCap1: props.phanLoaiCap1,
					phanLoaiCap2: props.phanLoaiCap2,
					maHocKy: condition?.maHocKy,
				}}
				buttons={{ import: true, export: true }}
				hideCard={props?.hideCard ?? false}
				getData={getData}
				dependencies={[props.phanLoaiCap1, props.phanLoaiCap2, JSON.stringify(props.paramCondition), props.hideCard]}
				widthDrawer={1000}
				otherButtons={[
					<SelectHocKy
						allowClear
						onChange={(val) => setCondition({ ...condition, maHocKy: val })}
						style={{ width: 300 }}
						selectMa
						key={'hocky'}
						placeHolder={intl.formatMessage({ id: 'tuansinhhoatcongdan.select.hocky' })}
					/>,
					<>
						{[EHoatDongChungType2.HOAT_DONG_CAU_LAC_BO].includes(props.phanLoaiCap2) && (
							<SelectCLB
								allowClear
								onChange={(val) =>
									setCondition({
										...condition,
										info: val
											? {
													type: 'CAU_LAC_BO',
													refId: val,
												}
											: undefined,
									})
								}
								style={{ width: 300 }}
							/>
						)}
					</>,
				]}
				Form={Form}
				columns={column}
				modelName='hoatdongchung'
				title={
					props?.title ??
					intl.formatMessage({
						id: EHoatDongChungType2I18n[props.phanLoaiCap2],
						defaultMessage: props.phanLoaiCap2,
					})
				}
			/>

			<Modal
				styles={{
					body: { paddingTop: 4 },
				}}
				title={intl.formatMessage({ id: 'tuansinhhoatcongdan.dssv.title' })}
				open={visibleDanhSach}
				onCancel={() => {
					setVisibleDanhSach(false);
				}}
				width={900}
				footer={null}
			>
				<DanhSachSinhVien hoatDongCtsvId={record?._id ?? ''} />
			</Modal>
		</>
	);
};

export default HoatDongChungPage;
