import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { type BieuMau } from '@/services/KhaoSat/BieuMau/typing';
import Checkbox from 'antd/lib/checkbox/Checkbox';

const GridChoice = (props: {
  hang: { _id: string; noiDung: string }[];
  cot: { _id: string; noiDung: string }[];
  dapAn?: BieuMau.LuaChonBangRecord[];
}) => {
  const columns: IColumn<any>[] = [
    {
      title: 'Nội dung',
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
      record[cot._id] = !!props.dapAn?.find(
        (dapAn) => dapAn.idCot === cot._id && dapAn.idHang === hang._id,
      );
    });
    return record;
  });

  return (
    <TableStaticData otherProps={{ pagination: false }} data={data} columns={columns} hasTotal />
  );
};

export default GridChoice;
