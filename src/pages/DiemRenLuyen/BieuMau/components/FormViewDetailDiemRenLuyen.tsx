import ExpandText from '@/components/ExpandText';
import { Button, Card, Table, Typography } from 'antd';
import { useIntl, useModel } from 'umi';
import NumberInputRating from './QuestionView/Numberinputrating';

interface TableRecord {
	type: 'khoi' | 'cauHoi' | 'tongDiem';
	noiDung: string;
	diemToiDa: number;
	diemToiThieu?: number;
	isTieuDeDanhMuc?: boolean;
}
const ViewDetailDiemRenLuyen = (props: { hideCard?: boolean; hideClose?: boolean }) => {
	const intl = useIntl();
	const { loading, record, setVisibleForm } = useModel('khaosat.bieumau');

	const columns = [
		{
			title: intl.formatMessage({ id: 'bieumau.viewdrl.noidung' }),
			render: (_: any, tableRecord: TableRecord) => {
				if (tableRecord?.isTieuDeDanhMuc) {
					return <ExpandText style={{ fontWeight: 'bold' }}>{tableRecord.noiDung}</ExpandText>;
				}
				if (tableRecord.type === 'tongDiem') {
					return (
						<Typography.Text style={{ fontSize: '18px' }}>
							{intl.formatMessage({ id: 'bieumau.viewdrl.tongdiem' })}
						</Typography.Text>
					);
				}
				return <ExpandText>{tableRecord.noiDung}</ExpandText>;
			},
		},
		{
			title: intl.formatMessage({ id: 'bieumau.viewdrl.diemtoida' }),
			align: 'center',
			render: (_: any, tableRecord: TableRecord) => {
				return tableRecord?.isTieuDeDanhMuc ? (
					''
				) : (
					<ExpandText>
						{tableRecord.type === 'tongDiem' || tableRecord.type === 'khoi'
							? ''
							: `${tableRecord?.diemToiThieu ?? 0} - `}
						{tableRecord.diemToiDa}
					</ExpandText>
				);
			},
		},
		{
			title: intl.formatMessage({ id: 'bieumau.viewdrl.diemtudanhgia' }),
			align: 'center',
			render: (_: any, tableRecord: TableRecord) => {
				if (tableRecord.type === 'tongDiem' || tableRecord.type === 'khoi') {
					return null;
				}
				return <NumberInputRating />;
			},
		},
		{
			title: intl.formatMessage({ id: 'bieumau.viewdrl.diembcs' }),
			align: 'center',
			render: (_: any, tableRecord: TableRecord) => {
				if (tableRecord.type === 'tongDiem' || tableRecord.type === 'khoi') {
					return null;
				}
				return <NumberInputRating />;
			},
		},
		{
			title: intl.formatMessage({ id: 'bieumau.viewdrl.cvhtxacnhan' }),
			align: 'center',
			render: (_: any, tableRecord: TableRecord) => {
				if (tableRecord.type === 'tongDiem' || tableRecord.type === 'khoi') {
					return null;
				}
				return <NumberInputRating />;
			},
		},

		{
			title: intl.formatMessage({ id: 'bieumau.viewdrl.ctsvxacnhan' }),
			align: 'center',
			render: (_: any, tableRecord: TableRecord) => {
				if (tableRecord.type === 'tongDiem' || tableRecord.type === 'khoi') {
					return null;
				}
				return <NumberInputRating />;
			},
		},
	];

	let tongDiemCuaForm = 0;
	const dataSource = record?.danhSachKhoi
		?.reduce<TableRecord[]>((result, khoi) => {
			const records: TableRecord[] = [
				{ type: 'khoi', noiDung: khoi.tieuDe, diemToiDa: 0, isTieuDeDanhMuc: khoi?.isTieuDeDanhMuc },
			];
			khoi.danhSachCauHoi.forEach((cauHoi) => {
				records.push({
					type: 'cauHoi',
					noiDung: cauHoi.noiDungCauHoi,
					diemToiDa: cauHoi.gioiHanTrenTuyenTinh,
					diemToiThieu: cauHoi.gioiHanDuoiTuyenTinh,
				});
				records[0].diemToiDa = (records[0].diemToiDa ?? 0) + cauHoi.gioiHanTrenTuyenTinh;
			});
			tongDiemCuaForm += records[0].diemToiDa ?? 0;
			return result.concat(...records);
		}, [])
		.concat({ type: 'tongDiem', noiDung: '', diemToiDa: tongDiemCuaForm > 100 ? 100 : tongDiemCuaForm });

	const renderContent = (
		<>
			<Table pagination={false} columns={columns as any} dataSource={dataSource} />
			{!props?.hideClose && (
				<div className='form-footer'>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
				</div>
			)}
		</>
	);

	if (!props?.hideCard)
		return (
			<Card loading={loading} title={intl.formatMessage({ id: 'bieumau.viewdrl.title' })}>
				{renderContent}
			</Card>
		);
	else return renderContent;
};

export default ViewDetailDiemRenLuyen;
