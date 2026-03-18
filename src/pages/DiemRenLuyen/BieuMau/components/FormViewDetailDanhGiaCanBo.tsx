import ExpandText from '@/components/ExpandText';
import { Button, Card, Table, Typography } from 'antd';
import { useIntl, useModel } from 'umi';
import NumberInputRating from './QuestionView/Numberinputrating';

interface TableRecord {
	type: 'khoi' | 'cauHoi' | 'tongDiem';
	noiDung: string;
	diemToiDa: number;
}
const ViewDetailDanhGiaCanBo = () => {
	const intl = useIntl();
	const { loading, record, setVisibleForm } = useModel('khaosat.bieumau');

	const columns = [
		{
			title: intl.formatMessage({ id: 'bieumau.viewcanbo.noidung' }),
			render: (_: any, tableRecord: TableRecord) => {
				if (tableRecord.type === 'tongDiem') {
					return (
						<Typography.Text style={{ fontSize: '18px' }}>
							{intl.formatMessage({ id: 'bieumau.viewcanbo.tongdiem' })}
						</Typography.Text>
					);
				}
				return <ExpandText>{tableRecord.noiDung}</ExpandText>;
			},
		},
		{
			title: intl.formatMessage({ id: 'bieumau.viewcanbo.diemtoida' }),
			align: 'center',
			render: (_: any, tableRecord: TableRecord) => {
				return <ExpandText>{tableRecord.diemToiDa}</ExpandText>;
			},
		},
		{
			title: intl.formatMessage({ id: 'bieumau.viewcanbo.diemtudanhgia' }),
			align: 'center',
			render: (_: any, tableRecord: TableRecord) => {
				if (tableRecord.type === 'tongDiem') {
					return null;
				}
				return <NumberInputRating />;
			},
		},
		{
			title: intl.formatMessage({ id: 'bieumau.viewcanbo.diemquanly' }),
			align: 'center',
			render: (_: any, tableRecord: TableRecord) => {
				if (tableRecord.type === 'tongDiem') {
					return null;
				}
				return <NumberInputRating />;
			},
		},
	];

	let tongDiemCuaForm = 0;
	const dataSource = record?.danhSachKhoi
		.reduce<TableRecord[]>((result, khoi) => {
			const records: TableRecord[] = [{ type: 'khoi', noiDung: khoi.tieuDe, diemToiDa: 0 }];
			khoi.danhSachCauHoi.forEach((cauHoi) => {
				records.push({
					type: 'cauHoi',
					noiDung: cauHoi.noiDungCauHoi,
					diemToiDa: cauHoi.gioiHanTrenTuyenTinh,
				});
				records[0].diemToiDa = (records[0].diemToiDa ?? 0) + cauHoi.gioiHanTrenTuyenTinh;
			});
			tongDiemCuaForm += records[0].diemToiDa ?? 0;
			return result.concat(...records);
		}, [])
		.concat({ type: 'tongDiem', noiDung: '', diemToiDa: tongDiemCuaForm });

	return (
		<Card loading={loading} title={intl.formatMessage({ id: 'bieumau.viewcanbo.title' })}>
			<Table pagination={false} columns={columns as any} dataSource={dataSource} />
			<div className='form-footer'>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>
		</Card>
	);
};

export default ViewDetailDanhGiaCanBo;
