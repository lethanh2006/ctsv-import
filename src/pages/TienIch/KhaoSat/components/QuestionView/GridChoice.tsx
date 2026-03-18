import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { type BieuMau } from '@/services/TienIch/BieuMau/typings';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { useIntl } from 'umi';

const GridChoice = (props: {
	hang: { _id: string; noiDung: string }[];
	cot: { _id: string; noiDung: string }[];
	dapAn?: BieuMau.LuaChonBangRecord[];
}) => {
	const intl = useIntl();

	const columns: IColumn<any>[] = [
		{
			title: intl.formatMessage({ id: 'questionsmanagement.chitiet.gridchoice.noidung' }),
			dataIndex: 'tieuChi',
			width: 250,
			fixed: 'left',
		},
	];

	props?.cot?.forEach((item) => {
		columns.push({
			key: item._id,
			title: item.noiDung,
			dataIndex: item._id,
			align: 'center',
			width: 80,
			render: (val) => <Checkbox checked={val} />,
		});
	});

	const data = props?.hang?.map((hang) => {
		const record: any = {
			tieuChi: hang.noiDung,
		};
		props?.cot?.forEach((cot) => {
			record[cot._id] = !!props.dapAn?.find((dapAn) => dapAn.idCot === cot._id && dapAn.idHang === hang._id);
		});
		return record;
	});

	return <TableStaticData size='small' addStt otherProps={{ pagination: false }} data={data} columns={columns} />;
};

export default GridChoice;
