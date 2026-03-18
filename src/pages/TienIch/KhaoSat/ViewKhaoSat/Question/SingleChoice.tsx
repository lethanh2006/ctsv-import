import type { BieuMau } from '@/services/TienIch/BieuMau/typings';
import { Form, Input, Radio } from 'antd';
import { useEffect, useState } from 'react';

const SingleChoice = (props: { question: BieuMau.CauHoi; indexKhoi: number; indexCauHoi: number; traLoi?: any }) => {
	const [idCauTraLoi, setIdCauTraLoi] = useState<string>();
	const handleRenderTraLoi = () => {
		if (props.question?.cauTraLoiKhac && props.traLoi?.traLoiKhac) {
			setIdCauTraLoi('traLoiKhac');
		} else {
			props.question?.luaChon?.forEach((val) => {
				if (props?.traLoi?.listLuaChon?.includes(val?.noiDung)) {
					setIdCauTraLoi(val?._id);
				}
			});
		}
	};
	useEffect(() => {
		handleRenderTraLoi();
	}, []);
	return (
		<>
			<Radio.Group value={idCauTraLoi} disabled>
				{props.question?.luaChon?.map((item) => (
					<div key={item._id}>
						<Radio value={item._id}>{item.noiDung}</Radio>
					</div>
				))}
				{props.question?.cauTraLoiKhac ? <Radio value='traLoiKhac'>Câu trả lời khác</Radio> : null}
			</Radio.Group>
			{props.question?.cauTraLoiKhac && props.traLoi?.traLoiKhac ? (
				<Form.Item label='Câu trả lời khác' style={{ marginTop: 12 }}>
					<Input value={props.traLoi.traLoiKhac} disabled />
				</Form.Item>
			) : null}
		</>
	);
};

export default SingleChoice;
