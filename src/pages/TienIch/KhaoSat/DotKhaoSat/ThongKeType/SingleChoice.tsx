import ColumnChart from '@/components/Chart/ColumnChart';
import { type BieuMau } from '@/services/TienIch/BieuMau/typings';

const ThongKeSingleChoice = (props: { ketQua: BieuMau.ThongKeLuaChon[] }) => {
  const { ketQua } = props;

  return (
    <ColumnChart
      yLabel={['Số lượng']}
      xAxis={ketQua.map((i) => i.noiDungLuaChon)}
      yAxis={[ketQua.map((i) => i.soLuong)]}
    />
  );
};

export default ThongKeSingleChoice;
