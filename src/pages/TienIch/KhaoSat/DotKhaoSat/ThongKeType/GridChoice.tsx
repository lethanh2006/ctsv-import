import ColumnChart from '@/components/Chart/ColumnChart';
import { type BieuMau } from '@/services/TienIch/BieuMau/typings';

const ThongKeGrid = (props: { ketQua: BieuMau.ThongKeLuaChonGrid[] }) => {
  const { ketQua } = props;

  const xaxis = ketQua.map((item, index) => `Câu ${index + 1}`);
  const data = ketQua.map((item) => {
    const tmp: Record<string, number> = {};
    item.thongKeCot.map((cot) => (tmp[cot.noiDungCot] = cot.soLuong));
    return tmp;
  });
  const ylabels = Object.keys(data[0]);
  const yaxis: number[][] = [];
  data.map((item, row) => (yaxis[row] = []));
  data.map((item, row) => Object.values(item).map((j, col) => (yaxis[col][row] = j)));

  return (
    <>
      <ColumnChart
        xAxis={xaxis}
        yAxis={yaxis}
        yLabel={ylabels}
        formatY={(val) => val + ''}
        colors={['#007EB9', '#00b95c', '#dda50b', '#c207c2']}
      />

      <ol>
        {ketQua.map((item, index) => (
          <li key={item.idHang}>
            <b>Câu {index + 1}:</b> {item.noiDungHang}
          </li>
        ))}
      </ol>
    </>
  );
};

export default ThongKeGrid;
