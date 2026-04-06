import { Button, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import DanhSachMyCCT from '../DanhSach';
import FormSubmisstionRound from './Form';

const ModalSubmisstionRound = () => {
	const intl = useIntl();
	const { visibleForm, setVisibleForm, isView } = useModel('cct.submissionround');
	const [activeKey, setActiveKey] = useState<string>('0');

	useEffect(() => {
		if (!visibleForm) {
			setActiveKey('0');
		}
	}, [visibleForm]);

	return (
		<Tabs
			activeKey={activeKey}
			onChange={setActiveKey}
			items={[
				{
					key: '0',
					label: 'General information',
					children: <FormSubmisstionRound />,
				},
				{
					key: '1',
					label: 'Student list',
					children: (
						<>
							<DanhSachMyCCT isDot />

							<div className='form-footer'>
								<Button onClick={() => setVisibleForm(false)}>
									{intl.formatMessage({
										id: isView ? 'global.button.dong' : 'global.button.huy',
									})}
								</Button>
							</div>
						</>
					),
				},
			]}
		/>
	);
};

export default ModalSubmisstionRound;
