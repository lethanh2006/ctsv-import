import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { MinhChungDrl } from '@/services/DiemRenLuyen/MinhChung/typing';
import React, { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const DanhSachMinhChung = React.forwardRef((props: { idLopHanhChinh?: string }, ref) => {
	const intl = useIntl();
	const { getAllModel, danhSach, record, setRecord } = useModel('diemrenluyen.minhchung.cauhinh');
	const { record: recordDot } = useModel('diemrenluyen.dot');

	const { record: recordLopHanhChinh } = useModel('daotaov2.lophanhchinh.lophanhchinh');

	const getData = async (isSetRecord: boolean) => {
		try {
			if (!props?.idLopHanhChinh || (props?.idLopHanhChinh && recordDot?._id && recordLopHanhChinh?.ten))
				getAllModel(isSetRecord, undefined, {
					dungChoSuKien: false,
					dotChamDiemId: recordDot?._id,
					lopHanhChinh: recordLopHanhChinh?.ten,
				});
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		getData(!record);
	}, [recordDot?._id, recordLopHanhChinh?._id]);

	const onCell = (recordVal: MinhChungDrl.IBieuMau) => ({
		onClick: () => {
			setRecord(recordVal);
		},
		style: {
			cursor: 'pointer',
			fontWeight: recordVal.maMinhChung === record?.maMinhChung ? 700 : 600,
			color: recordVal.maMinhChung === record?.maMinhChung ? '#cc0d00' : undefined,
			backgroundColor: recordVal.maMinhChung === record?.maMinhChung ? '#f0f0f0' : undefined,
		},
	});

	const columns: IColumn<MinhChungDrl.IBieuMau>[] = [
		{
			title: intl.formatMessage({ id: 'lophanhchinh.minhchung.ds.loaiminhchung' }),
			dataIndex: 'tenMinhChung',
			width: 200,
			filterType: 'string',
			onCell,
			render: (val, rec) => {
				return (
					<>
						{val}
						{rec?.trangThaiMinhChung && (
							<div>
								<b style={{ color: 'red' }}>{rec?.trangThaiMinhChung?.['Chờ xử lý']}</b>{' '}
								{intl.formatMessage({ id: 'lophanhchinh.minhchung.ds.choxuly' })}
							</div>
						)}
					</>
				);
			},
		},
	];

	return (
		<div style={{ marginTop: '-8px' }}>
			<TableStaticData columns={columns} data={danhSach} otherProps={{ scroll: { x: 350 }, pagination: false }} />
		</div>
	);
});

export default DanhSachMinhChung;
