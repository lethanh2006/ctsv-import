import type { BieuMau } from '@/services/TienIch/BieuMau/typings';
import { Checkbox, Form, Input } from 'antd';
import { useEffect, useState } from 'react';

const MultipleChoice = (props: { question: BieuMau.CauHoi; indexKhoi: number; indexCauHoi: number; traLoi?: any }) => {
	const [idCauTraLoi, setIdCauTraLoi] = useState<string[]>([]);

	const handleRenderTraLoi = () => {
		if (props.question?.cauTraLoiKhac && props.traLoi?.traLoiKhac) {
			setIdCauTraLoi(['traLoiKhac']);
		}

		const arr = [...idCauTraLoi];
		props.question?.luaChon?.forEach((val) => {
			if (props?.traLoi?.listLuaChon?.includes(val?.noiDung)) {
				arr.push(val?._id);
			}
		});
		setIdCauTraLoi(arr);
	};

	useEffect(() => {
		handleRenderTraLoi();
	}, []);

	return (
		<>
			<Checkbox.Group value={idCauTraLoi} disabled>
				{props.question?.luaChon?.map((item) => (
					<div key={item._id}>
						<Checkbox value={item._id}>{item.noiDung}</Checkbox>
					</div>
				))}
				{props.question?.cauTraLoiKhac ? <Checkbox value='traLoiKhac'>Câu trả lời khác</Checkbox> : null}
			</Checkbox.Group>

			{props.question?.cauTraLoiKhac && props.traLoi?.traLoiKhac ? (
				<Form.Item label='Câu trả lời khác' style={{ marginTop: 12 }}>
					<Input value={props.traLoi.traLoiKhac} disabled />
				</Form.Item>
			) : null}
		</>
	);
};

export default MultipleChoice;
