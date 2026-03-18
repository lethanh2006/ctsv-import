import { Radio } from 'antd';

const SingleChoice = (props: {
  luaChon: { _id: string; noiDung: string; dung?: boolean }[];
  dapAn?: string[];
}) => {
  return (
    <Radio.Group value={props?.luaChon.find((o) => o.dung)?._id}>
      {props.luaChon?.map((item) => (
        <div key={item._id}>
          <Radio checked={item.dung} value={item._id}>
            {item.noiDung}
          </Radio>
        </div>
      ))}
    </Radio.Group>
  );
};

export default SingleChoice;
