import { Input } from 'antd';
import { useIntl } from 'umi';

const Text = (props: { dapAn?: string }) => {
	const intl = useIntl();

	return (
		<Input.TextArea
			rows={2}
			value={props?.dapAn}
			readOnly
			placeholder={intl.formatMessage({ id: 'questionsmanagement.chitiet.renderinput.nhapgiatri' })}
		/>
	);
};

export default Text;
