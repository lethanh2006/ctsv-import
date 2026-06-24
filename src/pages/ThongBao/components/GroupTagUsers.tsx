import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { EVaiTroKhaoSat } from '@/services/ThongBao/constant';
import { type ThongBao } from '@/services/ThongBao/typing';
import { CloseOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';

const GroupTagUsers = (props: {
	users?: ThongBao.IUser[];
	setUsers?: (users: ThongBao.IUser[]) => void;
	type?: string;
}) => {
	const intl = useIntl();
	const { users, setUsers, type } = props;

	const onClose = (username: string) => {
		const tmp = users?.filter((item) => item.username !== username) ?? [];
		if (setUsers) setUsers(tmp);
	};

	const columns: IColumn<ThongBao.IUser>[] = [
		{
			title: intl.formatMessage({
				id: type === EVaiTroKhaoSat.SINH_VIEN ? 'thongbao.taguser.id.masv' : 'thongbao.taguser.id.macb',
			}),
			dataIndex: 'username',
			width: 100,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'thongbao.taguser.id.hoten' }),
			dataIndex: 'fullname',
			width: 180,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'thongbao.taguser.id.thaotac' }),
			align: 'center',
			width: 60,
			render: (val, rec) => (
				<ButtonExtend onClick={() => onClose(rec?.username)} type='link' danger icon={<CloseOutlined />} />
			),
		},
	];

	return (
		<TableStaticData
			data={users ?? []}
			columns={columns}
			addStt
			size='small'
			otherProps={{ scroll: { y: 360 }, pagination: {} }}
			hasTotal
		>
			<div className='fw500'>{intl.formatMessage({ id: 'thongbao.taguser.id.dachon' })}</div>
		</TableStaticData>
	);
};

export default GroupTagUsers;
