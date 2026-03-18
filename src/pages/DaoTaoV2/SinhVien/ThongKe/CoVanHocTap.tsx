import type { IColumn } from '@/components/Table/typing';
import { exportSoLuongSinhVienLhc, getThongKeCoVanHocTap } from '@/services/DaoTaoV2/SinhVien';
import { jsonToXlsx, transformDataColumnsTableToJson } from '@/utils/utils';
import { ExportOutlined } from '@ant-design/icons';
import { Button, Row } from 'antd';
import fileDownload from 'js-file-download';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

interface IThongKeCoVan {
	_id: string;
	maNamHoc: string;
	nhanSuSsoId: string;
	hoTenNhanSu: string;
	maNhanSu: string;
	tenLopHc: string;
	createdAt: string;
	updatedAt: string;
	tong: number;
	dangHoc: number;
	daTotNghiep: number;
	baoLuu: number;
	thoiHoc: number;
}

const CoVanHocTap = (props: { mode: 'table' | 'donut' }) => {
	const intl = useIntl();
	const { mode } = props;
	const [data, setData] = useState<IThongKeCoVan[]>([]);
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const [loading, setLoading] = useState<boolean>(false);

	const reportSoLuongSinhVienLhcModel = async (params: {
		maTrinhDo?: string;
		maHinhThuc?: string;
		maHocKy?: string;
	}): Promise<any> => {
		setLoading(true);
		try {
			const res = await exportSoLuongSinhVienLhc(params);
			fileDownload(res.data as ArrayBuffer, 'TK Số lượng sinh viên LHC.xlsx');
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setLoading(false);
		}
	};

	const getData = async () => {
		try {
			if (!recHocKy) return;
			const res = await getThongKeCoVanHocTap(recHocKy?.ma);
			setData(res?.data?.data?.result ?? []);
		} catch (e) {
			console.log(e);
		}
	};

	const columns: IColumn<IThongKeCoVan>[] = [
		{
			title: intl.formatMessage({ id: 'thongke.cvht.column.macovan' }),
			dataIndex: 'maNhanSu',
			filterType: 'string',
			width: 200,
			align: 'center',
			render: (val) => val || intl.formatMessage({ id: 'thongke.cvht.common.noInfo' }),
		},
		{
			title: intl.formatMessage({ id: 'thongke.cvht.column.hoten' }),
			dataIndex: 'hoTenNhanSu',
			width: 200,
			align: 'center',
			filterType: 'string',
			render: (val) => val || intl.formatMessage({ id: 'thongke.cvht.common.noInfo' }),
		},
		{
			title: intl.formatMessage({ id: 'thongke.cvht.column.tongsv' }),
			dataIndex: 'tong',
			width: 120,
			sortable: true,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'thongke.cvht.column.danghoc' }),
			dataIndex: 'dangHoc',
			width: 120,
			sortable: true,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'thongke.cvht.column.dadongnghiep' }),
			dataIndex: 'daTotNghiep',
			width: 120,
			sortable: true,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'thongke.cvht.column.baoluu' }),
			dataIndex: 'baoLuu',
			width: 120,
			sortable: true,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'thongke.cvht.column.thoihoc' }),
			dataIndex: 'thoiHoc',
			width: 120,
			sortable: true,
			align: 'center',
		},
	];

	const handleExportDuLieu = async () => {
		try {
			const payload = transformDataColumnsTableToJson(columns, data);
			jsonToXlsx(payload, 'Thống kê cố vấn học tập');
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		getData();
	}, [recHocKy?.ma]);

	return mode === 'table' ? (
		<>
			<Button
				loading={loading}
				type='primary'
				icon={<ExportOutlined />}
				onClick={() => {
					reportSoLuongSinhVienLhcModel({ maTrinhDo: '7', maHinhThuc: '1', maHocKy: recHocKy?.ma ?? '' });
				}}
			>
				{intl.formatMessage({ id: 'thongke.cvht.common.export' })}
			</Button>
			{/* <TableStaticData addStt columns={columns} data={data} /> */}
		</>
	) : (
		<Row>
			<Button
				loading={loading}
				type='primary'
				icon={<ExportOutlined />}
				onClick={() => {
					reportSoLuongSinhVienLhcModel({ maTrinhDo: '7', maHinhThuc: '1', maHocKy: recHocKy?.ma ?? '' });
				}}
			>
				{intl.formatMessage({ id: 'thongke.cvht.common.export' })}
			</Button>
			{/* <Col span={24}>
				<ColumnChart
					height={500}
					title=''
					yLabel={['Đang học', 'Đã tốt nghiệp', 'Thôi học', 'Bảo lưu']}
					colors={['#1fba36', '#0d6efd', '#0dcaf0', '#ffca2c']}
					xAxis={data.map((item, index) => item?.hoTenNhanSu ?? `${index + 1}`)}
					formatY={(val) => inputFormat(val ?? 0) + ''}
					otherOptionsChart={{
						stacked: true,
					}}
					yAxis={[
						// [10, 20, 30, 40],
						// [10, 20, 30, 40],
						// [10, 20, 30, 40],
						// [10, 20, 30, 40],
						...data?.map((val) => {
							return [val?.dangHoc, val?.daTotNghiep, val?.thoiHoc, val?.baoLuu];
						}),
					]}
				/>
			</Col> */}
		</Row>
	);
};
export default CoVanHocTap;
