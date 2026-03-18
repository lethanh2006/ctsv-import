import { EparticipantRole, mapNameParticipantRole } from '@/services/CCT/constant';
import { Space, Tag } from 'antd';
const { CheckableTag } = Tag;

const GroupTagVaiTro = (props: {
	value?: EparticipantRole;
	onChange?: (val?: EparticipantRole) => void;
	listVaiTro?: EparticipantRole[];
	disabled?: boolean;
}) => {
	const { value, onChange, disabled } = props;
	const listVaiTro = props.listVaiTro ?? Object.values(EparticipantRole);

	const handleChange = (val: EparticipantRole, checked: boolean) => {
		if (disabled) return;

		if (checked) {
			onChange?.(val);
		} else {
			onChange?.(undefined);
		}
	};

	return (
		<Space wrap size={8}>
			{listVaiTro.map((item) => (
				<CheckableTag
					key={item}
					checked={value === item}
					onChange={(checked) => handleChange(item, checked)}
					style={{ pointerEvents: disabled ? 'none' : undefined }}
				>
					{mapNameParticipantRole[item]}
				</CheckableTag>
			))}
		</Space>
	);
};

export default GroupTagVaiTro;
