import { Checkbox } from 'antd';

const MultipleChoice = (props: {
  luaChon: { _id: string; noiDung: string }[];
  dapAn?: string[];
}) => {
  return (
    <Checkbox.Group value={props?.dapAn}>
      {props.luaChon?.map((item) => (
        <div key={item._id}>
          <Checkbox value={item._id}>{item.noiDung}</Checkbox>
        </div>
      ))}
    </Checkbox.Group>
  );
};

export default MultipleChoice;
