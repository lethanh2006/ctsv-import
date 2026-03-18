import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import { getDanhSachChuaKhaiBaoPage, getDanhSachDaKhaiBaoPage } from '@/services/DaoTaoV2/DotCapNhatHoSo';
import { ExportOutlined } from '@ant-design/icons';
import { Button, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

const DanhSachChuaKhaiBao = (props: { data?: DotCapNhatHoSo.IRecord; onCancel?: () => void }) => {
	const intl = useIntl();
	const { setDanhSach, condition, page, limit, setTotal, filters, setFilters } = useModel(
		'daotaov2.sinhvien.danhsachsinhviencuadot',
	);

	const { exportDanhSachKhaiBaoModel, loading: loadingExport } = useModel('daotaov2.sinhvien.dotcapnhathoso');

	const [danhSachChuaKhaiBao, setDanhSachChuaKhaiBao] = useState<DotCapNhatHoSo.IThongTinSinhVien[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [currentTabs, setCurrentTabs] = useState<string>('1');

	const handleGetDanhSach = async () => {
		try {
			if (props?.data?._id) {
				setLoading(true);
				const res = await (currentTabs === '1'
					? getDanhSachDaKhaiBaoPage(props?.data?._id, page, limit, condition, [
							...(filters?.filter((item) => item.active)?.map(({ active, ...item }) => item) || []),
						])
					: getDanhSachChuaKhaiBaoPage(props?.data?._id, page, limit, condition, [
							...(filters?.filter((item) => item.active)?.map(({ active, ...item }) => item) || []),
						]));
				if (res) {
					// setDanhSachChuaKhaiBao(res?.data?.data ?? []);
					setDanhSach(res?.data?.data?.result ?? []);
					setTotal(res?.data?.data?.total ?? 0);
				}
			}
		} catch (e) {
			console.log(e);
		} finally {
			setLoading(false);
		}
	};

	const columns: IColumn<DotCapNhatHoSo.IThongTinSinhVien>[] = [
		{
			title: intl.formatMessage({ id: 'dotcapnhathoso.dssv.column.tensv' }),
			dataIndex: 'ten',
			filterType: 'string',
			width: 150,
		},
		{
			title: intl.formatMessage({ id: 'dotcapnhathoso.dssv.column.cccd' }),
			dataIndex: 'cccd',
			filterType: 'string',
			width: 150,
		},
		{
			title: intl.formatMessage({ id: 'dotcapnhathoso.dssv.column.email' }),
			dataIndex: 'email',
			filterType: 'string',
			width: 120,
		},
		{
			title: intl.formatMessage({ id: 'dotcapnhathoso.dssv.column.lophanhchinh' }),
			dataIndex: 'lopHanhChinhList',
			// filterType: 'string',
			width: 120,
			render: (value) => {
				return value?.[0]?.ten;
			},
		},
	];

	useEffect(() => {
		// if (props?.data?._id) handleGetDanhSach(props?.data?._id);
	}, [props?.data, page, limit, currentTabs]);

	return (
		<>
			<Tabs
				onChange={(val) => {
					setFilters([]);
					setCurrentTabs(val);
				}}
			>
				<Tabs.TabPane tab={intl.formatMessage({ id: 'dotcapnhathoso.dssv.dakhaobao' })} key='1' />
				<Tabs.TabPane tab={intl.formatMessage({ id: 'dotcapnhathoso.dssv.chuakhao' })} key='2' />
			</Tabs>
			<TableBase
				hideCard
				otherButtons={[
					<Button
						type='primary'
						icon={<ExportOutlined />}
						loading={loadingExport}
						onClick={() => {
							if (!props.data) return;
							exportDanhSachKhaiBaoModel(
								currentTabs === '1' ? 'da-dang-ky' : 'chua-dang-ky',
								props.data?._id,
								undefined,
								filters,
							);
						}}
						key={'export'}
					>
						{intl.formatMessage({ id: 'dotcapnhathoso.dssv.button.xuatdanhsach' })}
					</Button>,
				]}
				buttons={{ create: false }}
				getData={handleGetDanhSach}
				modelName={'daotaov2.sinhvien.danhsachsinhviencuadot'}
				columns={columns}
				dependencies={[currentTabs, page, limit, filters]}
			/>
			<div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
				<Button
					onClick={() => {
						if (props?.onCancel) props?.onCancel();
					}}
				>
					{intl.formatMessage({ id: 'global.button.dong' })}
				</Button>
			</div>
		</>
	);
};
export default DanhSachChuaKhaiBao;
