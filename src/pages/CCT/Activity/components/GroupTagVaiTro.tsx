import { EparticipantRole, mapNameParticipantRole } from '@/services/CCT/constant';
import { Space, Tag } from 'antd';
const { CheckableTag } = Tag;

const GroupTagVaiTro = (props: {
	value?: EparticipantRole;
	onChange?: (val?: EparticipantRole) => void;
	listVaiTro?: EparticipantRole[];
	disabled?: boolean;
	disabledOptions?: EparticipantRole[]; // 👈 thêm
}) => {
	const { value, onChange, disabled, disabledOptions = [] } = props;
	const listVaiTro = props.listVaiTro ?? Object.values(EparticipantRole);

	const handleChange = (val: EparticipantRole, checked: boolean) => {
		if (disabled || disabledOptions.includes(val)) return;

		if (checked) {
			onChange?.(val);
		} else {
			onChange?.(undefined);
		}
	};

	return (
		<Space wrap size={8}>
			{listVaiTro.map((item) => {
				const isDisabled = disabled || disabledOptions.includes(item);

				return (
					<CheckableTag
						key={item}
						checked={value === item}
						onChange={(checked) => handleChange(item, checked)}
						style={{
							pointerEvents: isDisabled ? 'none' : undefined,
							opacity: isDisabled ? 0.5 : 1, // 👈 nhìn rõ disabled
							cursor: isDisabled ? 'not-allowed' : 'pointer',
						}}
					>
						{mapNameParticipantRole[item]}
					</CheckableTag>
				);
			})}
		</Space>
	);
};
export default GroupTagVaiTro;
