import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import type { ChuongTrinhDaoTao } from '@/services/DaoTaoV2/DanhMucHeThong/ChuongTrinhDaoTao/typings';
import { colorTrangThaiCtdt, trangThaiCtdt, ETrangThaiCtdt } from '@/services/DaoTaoV2/DanhMucHeThong/constant';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Card, Empty, Popconfirm, Space, Tag } from 'antd';
import { useIntl, useModel } from 'umi';
import SelectNganhCoSo from '../../Nganh/components/SelectNganh';
import SelectTrinhDo from '../../TrinhDo/components/Select';
import SelectDotRaSoat from '../DotRaSoat/Select';
import Form from './Form';
import ModalThemMoi from './ModalThemChuongTrinh';

const DotChuongTrinhPage = () => {
	const intl = useIntl();
	const { record: recDot, setRecord: setDot, danhSach: danhSachDot } = useModel('daotaov2.chuongtrinhdaotao.dotrasoat');
	const { page, limit, getByDotModel, edit, handleEdit, deleteModel, getSoSanhChuongTrinhModel } = useModel(
		'chuongtrinhdaotao.dotchuongtrinh',
	);
	const { setRecord: setChuongTrinh } = useModel('daotaov2.chuongtrinhdaotao.chuongtrinh');

	const getData = () => recDot?._id && getByDotModel(recDot._id);

	const onSoSanh = (rec: ChuongTrinhDaoTao.IRecord) => {
		getSoSanhChuongTrinhModel(rec.ma)
			.then(() => {
				handleEdit(rec);
				setChuongTrinh(rec); // Set chương trình chính để sử dụng lại Form Khối học phần CTĐT
			})
			.catch((er) => console.log(er));
	};

	const onCell = (record: ChuongTrinhDaoTao.IRecord) => ({
		onClick: () => onSoSanh(record),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<ChuongTrinhDaoTao.IRecord>[] = [
		{
			title: 'Mã',
			dataIndex: 'ma',
			width: 140,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Tên chương trình',
			dataIndex: 'ten',
			width: 200,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Trình độ',
			width: 100,
			dataIndex: 'maTrinhDoDaoTao',
			filterType: 'customselect',
			filterCustomSelect: <SelectTrinhDo multiple selectMa />,
			render: (val, rec) => rec?.trinhDoDaoTao?.dmTrinhDo?.ten ?? '--',
			onCell,
		},
		{
			title: 'Ngành',
			width: 200,
			dataIndex: 'maNganh',
			filterType: 'customselect',
			filterCustomSelect: <SelectNganhCoSo multiple selectMa />,
			render: (val, rec) => `${rec?.nganh?.dmNganh?.ma ?? rec.nganh?.ma ?? ''} - ${rec?.nganh?.ten ?? ''}`,
			onCell,
		},
		{
			title: 'Năm ban hành',
			dataIndex: 'namBanHanh',
			align: 'center',
			width: 100,
			filterType: 'number',
			sortable: true,
			onCell,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			align: 'center',
			width: 120,
			filterType: 'select',
			filterData: [ETrangThaiCtdt.CONG_BO, ETrangThaiCtdt.RA_SOAT].map((value) => ({
				label: trangThaiCtdt[value],
				value,
			})),
			render: (val: ETrangThaiCtdt) => val && <Tag color={colorTrangThaiCtdt[val]}>{trangThaiCtdt[val]}</Tag>,
			onCell,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend tooltip='Chỉnh sửa' type='link' icon={<EditOutlined />} onClick={() => onSoSanh(rec)} />
					<Popconfirm
						onConfirm={() => deleteModel(rec._id, getData)}
						title='Bạn có chắc chắn muốn loại chương trình này khỏi đợt rà soát?'
						placement='topRight'
					>
						<ButtonExtend
							disabled={rec?.trangThai !== ETrangThaiCtdt.RA_SOAT}
							tooltip='Xóa'
							danger
							type='link'
							icon={<DeleteOutlined />}
						/>
					</Popconfirm>
				</>
			),
		},
	];

	return (
		<>
			<Card title={intl.formatMessage({ id: 'danhmuchethong.coso.chuongtrinhdaotao.rasoatchuongtrinh' })}>
				<Space wrap style={{ marginBottom: 12 }}>
					<SelectDotRaSoat
						style={{ width: 300 }}
						isSetRecord={!recDot?._id}
						value={recDot?._id}
						onChange={(val) => setDot(danhSachDot.find((item) => item._id === val))}
					/>
				</Space>

				{!recDot?._id ? (
					<Empty description='Chưa chọn đợt rà soát' style={{ margin: '32px 10px' }} />
				) : (
					<TableBase
						columns={columns}
						getData={getData}
						dependencies={[page, limit, recDot._id]}
						modelName='daotaov2.chuongtrinhdaotao.dotchuongtrinh'
						Form={edit ? Form : ModalThemMoi}
						formProps={{ getData }}
						widthDrawer={1000}
						destroyModal
						hideCard
					/>
				)}
			</Card>
		</>
	);
};

export default DotChuongTrinhPage;
