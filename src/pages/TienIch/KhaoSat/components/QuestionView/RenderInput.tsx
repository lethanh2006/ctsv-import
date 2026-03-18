import { Input } from 'antd';
import { useIntl } from 'umi';

const RenderInput = (props: { dapAn?: string }) => {
	const intl = useIntl();

	return (
		<Input
			value={props?.dapAn}
			readOnly
			placeholder={intl.formatMessage({ id: 'questionsmanagement.chitiet.renderinput.nhapgiatri' })}
		/>
	);
};

export default RenderInput;
