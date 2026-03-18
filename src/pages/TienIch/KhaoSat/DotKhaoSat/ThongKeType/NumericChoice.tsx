import ColumnChart from '@/components/Chart/ColumnChart';
import { type BieuMau } from '@/services/TienIch/BieuMau/typings';

const ThongKeNumericChoice = (props: { ketQua: BieuMau.ThongKeLuaChonNumeric[] }) => {
  const { ketQua } = props;

  return (
    <ColumnChart
      yLabel={['Số lượng']}
      xAxis={ketQua.map((i) => i.giaTriTuyenTinh + '')}
      yAxis={[ketQua.map((i) => i.soLuong)]}
    />
  );
};

export default ThongKeNumericChoice;
