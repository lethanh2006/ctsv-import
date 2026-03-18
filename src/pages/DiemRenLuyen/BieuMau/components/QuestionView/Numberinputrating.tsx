import { InputNumber } from 'antd';

const NumberInputRating = (props: { dapAn?: number }) => {
	return <InputNumber value={props?.dapAn} readOnly controls={false} />;
};

export default NumberInputRating;
