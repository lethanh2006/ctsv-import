import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import { type IColumn } from '@/components/Table/typing';
import SelectKhoaSinhVien from '@/pages/DaoTaoV2/NamHoc/KhoaSinhVien/components/Select';
import { type ChuongTrinhDaoTao } from '@/services/DaoTaoV2/DanhMucHeThong/ChuongTrinhDaoTao/typings';
import {
	ELoaiChuongTrinhDaoTao,
	ETrangThaiCtdt,
	colorTrangThaiCtdt,
	trangThaiCtdt,
} from '@/services/DaoTaoV2/DanhMucHeThong/constant';
import { initTrinhDo } from '@/utils/constants';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm, Space, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import SelectVanBanQuyDinh from '../../VanBanQuyDinh/components/Select';
import ViewVanBanQuyDinh from '../../VanBanQuyDinh/components/ViewVanBan';
import SelectNganhCoSo from '../Nganh/components/SelectNganh';
import SelectTrinhDo from '../TrinhDo/components/Select';
import ModalChuongTrinh from './components/ModalChuongTrinh';
import SelectChuongTrinhRieng from './components/SelectRieng';

const ChuongTrinhDaoTaoPage = (props: { isKeHoach?: boolean; trangThai?: ETrangThaiCtdt }) => {
	const intl = useIntl();
	const { page, limit, deleteModel, handleEdit, getModel, congBoChuongTrinhModel, setFilters, filters } = useModel(
		'chuongtrinhdaotao.chuongtrinh',
	);
	const [visibleCanCu, setVisibleCanCu] = useState<boolean>(false);
	const [vanBanId, setVanBanId] = useState<string>();
	const { isKeHoach, trangThai } = props;
	const selectNganh = filters?.find((item) => item.field === 'maNganh')?.values?.[0]?.toString();
	const selectTrinhDo = filters?.find((item) => item.field === 'maTrinhDoDaoTao')?.values?.[0]?.toString();

	const getData = () =>
		getModel({
			loai: isKeHoach ? ELoaiChuongTrinhDaoTao.KE_HOACH : ELoaiChuongTrinhDaoTao.CHUAN,
			trangThai,
		});

	useEffect(() => {
		if (!isKeHoach)
			setFilters([
				{
					active: true,
					field: 'maTrinhDoDaoTao',
					values: [initTrinhDo], // Chính quy
					operator: EOperatorType.INCLUDE,
				},
			]);
	}, []);

	const onChangeFilters = (field: keyof ChuongTrinhDaoTao.IRecord, value?: string) => {
		const temp = [...(filters || [])].filter((item) => item.field !== field);
		if (!value) setFilters(temp);
		else setFilters([...temp, { active: true, field, values: [value], operator: EOperatorType.INCLUDE }]);
	};

	const onCell = (record: ChuongTrinhDaoTao.IRecord) => ({
		onClick: () => handleEdit(record),
		style: { cursor: 'pointer' },
	});

	const onCongBo = (
		rec: ChuongTrinhDaoTao.IRecord,
		type: 'cong-bo' | 'bo-cong-bo' | 'cho-cong-bo' | 'bo-cho-cong-bo',
	) => {
		if (rec._id)
			congBoChuongTrinhModel(rec._id, type)
				.then(() => getData())
				.catch((er) => console.log(er));
	};

	// const onChangeActive = (active: boolean, rec: ChuongTrinhDaoTao.IRecord) => putModel(rec._id, { active }, getData);

	const columns: IColumn<ChuongTrinhDaoTao.IRecord>[] = [
		{
			title: 'Mã',
			dataIndex: 'ma',
			width: 120,
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
			title: 'Chương trình chuẩn',
			dataIndex: 'maChuongTrinhDaoTaoChuan',
			width: 150,
			filterType: 'customselect',
			filterCustomSelect: <SelectChuongTrinhRieng multiple selectMa />,
			render: (val, rec) => rec.chuongTrinhDaoTaoChuan?.ten ?? val,
			hide: !isKeHoach,
			onCell,
		},
		{
			title: 'Khóa sinh viên',
			dataIndex: 'maKhoaSinhVien',
			width: 150,
			filterType: 'customselect',
			filterCustomSelect: <SelectKhoaSinhVien selectMa multiple />,
			render: (val, rec) => rec.khoaSinhVien?.ten ?? val,
			hide: !isKeHoach,
			onCell,
		},
		{
			title: 'Trình độ',
			width: 100,
			dataIndex: 'maTrinhDoDaoTao',
			filterType: 'customselect',
			filterCustomSelect: <SelectTrinhDo multiple selectMa />,
			render: (val, rec) => rec?.trinhDoDaoTao?.dmTrinhDo?.ten ?? '--',
			hide: isKeHoach,
			onCell,
		},
		{
			title: 'Ngành',
			width: 180,
			dataIndex: 'maNganh',
			filterType: 'customselect',
			filterCustomSelect: <SelectNganhCoSo multiple selectMa />,
			render: (val, rec) => `${rec?.nganh?.dmNganh?.ma ?? rec.nganh?.ma ?? ''} - ${rec?.nganh?.ten ?? ''}`,
			hide: isKeHoach,
			onCell,
		},
		{
			title: 'Thời gian',
			dataIndex: 'thoiGianDaoTao',
			width: 90,
			filterType: 'number',
			sortable: true,
			render: (val) => val && `${val} năm`,
			onCell,
		},
		{
			title: 'Năm ban hành',
			dataIndex: 'namBanHanh',
			align: 'center',
			width: 110,
			filterType: 'number',
			sortable: true,
			hide: isKeHoach,
			onCell,
		},
		{
			title: 'Căn cứ pháp lý',
			dataIndex: 'canCuId',
			width: 150,
			filterType: 'select',
			filterCustomSelect: <SelectVanBanQuyDinh hasCreate={false} multiple />,
			render: (val, rec) => (
				<>
					{val ? (
						<a
							onClick={() => {
								setVanBanId(rec?.canCuId);
								setVisibleCanCu(true);
							}}
						>
							{rec?.canCu?.ma ?? '(chi tiết)'}
						</a>
					) : (
						'Chưa cập nhật'
					)}
				</>
			),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			align: 'center',
			width: 120,
			filterType: !!trangThai ? undefined : 'select',
			filterData: Object.values(ETrangThaiCtdt).map((value) => ({ label: trangThaiCtdt[value], value })),
			render: (val: ETrangThaiCtdt) => val && <Tag color={colorTrangThaiCtdt[val]}>{trangThaiCtdt[val]}</Tag>,
			onCell,
			hide: isKeHoach,
		},
		// {
		// 	title: 'Hiện hành',
		// 	dataIndex: 'active',
		// 	align: 'center',
		// 	width: 70,
		// 	render: (val, rec) => <Switch size='small' checked={val} onChange={(active) => onChangeActive(active, rec)} />,
		// 	hide: isKeHoach || !!trangThai,
		// },
		{
			title: 'Thao tác',
			align: 'center',
			// width: isKeHoach || trangThai === ETrangThaiCtdt.CHO_CONG_BO ? 90 : !trangThai ? 60 : 120,
			width: 90,
			fixed: 'right',
			render: (record: ChuongTrinhDaoTao.IRecord) => (
				<>
					{/* {!isKeHoach && (trangThai === ETrangThaiCtdt.BIEN_SOAN || record.trangThai === ETrangThaiCtdt.CONG_BO) ? (
						<Popconfirm
							onConfirm={() =>
								onCongBo(record, record.trangThai === ETrangThaiCtdt.CONG_BO ? 'bo-cong-bo' : 'cho-cong-bo')
							}
							title={`Bạn có chắc chắn muốn ${
								record.trangThai === ETrangThaiCtdt.CONG_BO ? 'bỏ công bố' : 'công bố'
							} chương trình đào tạo này?`}
							placement='topRight'
						>
							<ButtonExtend
								tooltip={record.trangThai === ETrangThaiCtdt.CONG_BO ? 'Bỏ công bố' : 'Hoàn thành biên soạn'}
								type='link'
								className={record.trangThai === ETrangThaiCtdt.CONG_BO ? undefined : 'btn-success'}
								icon={record.trangThai === ETrangThaiCtdt.CONG_BO ? <RollbackOutlined /> : <CheckOutlined />}
							/>
						</Popconfirm>
					) : null}

					{!!trangThai && record.trangThai === ETrangThaiCtdt.CHO_CONG_BO ? (
						<>
							<Popconfirm
								onConfirm={() => onCongBo(record, 'cong-bo')}
								title='Bạn có chắc chắn muốn công bố chương trình đào tạo này?'
								placement='topRight'
							>
								<ButtonExtend tooltip='Công bố' type='link' className='btn-success' icon={<NotificationOutlined />} />
							</Popconfirm>
							<Popconfirm
								onConfirm={() => onCongBo(record, 'bo-cho-cong-bo')}
								title='Bạn có chắc chắn muốn bỏ công bố chương trình đào tạo này?'
								placement='topRight'
							>
								<ButtonExtend tooltip='Không duyệt' type='link' danger icon={<CloseOutlined />} />
							</Popconfirm>
						</>
					) : !!trangThai || isKeHoach ? ( */}
					<>
						<ButtonExtend tooltip='Chỉnh sửa' onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getData)}
							title='Bạn có chắc chắn muốn xóa chương trình đào tạo này?'
							placement='topRight'
							disabled={record.trangThai && record.trangThai !== ETrangThaiCtdt.CONG_BO}
						>
							<ButtonExtend
								tooltip='Xóa'
								danger
								type='link'
								icon={<DeleteOutlined />}
								disabled={record.trangThai && record.trangThai !== ETrangThaiCtdt.CONG_BO}
							/>
						</Popconfirm>
					</>
					{/* ) : null} */}
				</>
			),
		},
	];

	return (
		<>
			<TableBase
				columns={columns}
				getData={getData}
				dependencies={[page, limit, isKeHoach, trangThai]}
				modelName='daotaov2.chuongtrinhdaotao.chuongtrinh'
				title={
					!isKeHoach
						? intl.formatMessage({ id: 'danhmuchethong.coso.chuongtrinhdaotao.chuongtrinhdaotaochuan' })
						: intl.formatMessage({ id: 'danhmuchethong.coso.chuongtrinhdaotao.chuongtrinhdaotaokehoach' })
				}
				Form={ModalChuongTrinh}
				formProps={{ isKeHoach, trangThai }}
				widthDrawer={1000}
				rowSelection
				deleteMany
				hideCard={!!trangThai}
				// && trangThai === ETrangThaiCtdt.BIEN_SOAN
				buttons={{
					create: !isKeHoach,
					import: !isKeHoach,
					export: true,
				}}
				// Params truyền vào import/export
				params={{ trangThai, loai: isKeHoach ? ELoaiChuongTrinhDaoTao.KE_HOACH : ELoaiChuongTrinhDaoTao.CHUAN }}
			>
				{!isKeHoach ? (
					<Space wrap style={{ marginBottom: 12 }}>
						<SelectTrinhDo
							style={{ width: 200 }}
							value={selectTrinhDo as string}
							onChange={(val) => onChangeFilters('maTrinhDoDaoTao', val as string)}
							allowClear
							selectMa
						/>
						<SelectNganhCoSo
							style={{ width: 300 }}
							value={selectNganh as string}
							onChange={(val) => onChangeFilters('maNganh', val as string)}
							allowClear
							selectMa
						/>
					</Space>
				) : null}
			</TableBase>

			{vanBanId ? (
				<ViewVanBanQuyDinh visible={visibleCanCu} setVisible={setVisibleCanCu} condition={{ _id: vanBanId }} />
			) : null}
		</>
	);
};

export default ChuongTrinhDaoTaoPage;
