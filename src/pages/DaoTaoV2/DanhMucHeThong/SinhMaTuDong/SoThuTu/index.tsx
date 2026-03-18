import TableBase from '@/components/Table';
import { EOperatorType } from '@/components/Table/constant';
import type { IColumn } from '@/components/Table/typing';
import SelectDonVi from '@/pages/DaoTaoV2/ToChucNhanSu/DonVi/Select';
import { ENguonSinhMa, nguonSinhMa } from '@/services/DaoTaoV2/DanhMucHeThong/SinhMaTuDong/constant';
import type { SinhMaTuDong } from '@/services/DaoTaoV2/DanhMucHeThong/SinhMaTuDong/typing';
import { EditOutlined } from '@ant-design/icons';
import { Button, Select, Space, Tooltip } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import SelectTrinhDo from '../../CoSo/TrinhDo/components/Select';
import Form from './components/Form';

const SoThuTuMaPage = () => {
	const intl = useIntl();
	const { handleEdit, page, limit, getModel } = useModel('daotaov2.danhmuc.sothutuma');
	const { record: recDonVi, danhSach: danhSachDonVi, setRecord: setDonVi } = useModel('daotaov2.tochucnhansu.donvi');
	const { record: recTrinhDo, danhSach: danhSachTrinhDo, setRecord: setTrinhDo } = useModel('daotaov2.danhmuc.trinhdo');
	const [source, setSource] = useState<ENguonSinhMa>(ENguonSinhMa.HOC_PHAN);

	const getData = () =>
		source &&
		getModel(
			{ source },
			source === ENguonSinhMa.HOC_PHAN
				? [
						{
							active: true,
							field: 'name',
							operator: EOperatorType.CONTAIN,
							values: [
								`${recTrinhDo?.ma ? `|${recTrinhDo.ma}` : ''}${recDonVi?.maDonVi ? `|${recDonVi.maDonVi}` : ''}`,
							],
						},
				  ]
				: undefined,
		);

	const columns: IColumn<SinhMaTuDong.ISoThuTu>[] = [
		{
			title: 'Mã',
			dataIndex: 'name',
			width: 150,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Số thứ tự hiện tại',
			align: 'center',
			dataIndex: 'count',
			sortable: true,
			filterType: 'number',
			width: 120,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (val, rec) => (
				<Tooltip title='Chỉnh sửa'>
					<Button onClick={() => handleEdit(rec)} type='link' icon={<EditOutlined />} />
				</Tooltip>
			),
		},
	];

	return (
		<>
			<TableBase
				columns={columns}
				getData={getData}
				dependencies={[page, limit, source, recDonVi?.maDonVi, recTrinhDo?.ma]}
				modelName='daotaov2.danhmuc.sothutuma'
				title={intl.formatMessage({ id: 'danhmuchethong.sothutuma.title' })}
				Form={Form}
				formProps={{ getData }}
				buttons={{ create: false }}
			>
				<Space wrap style={{ marginBottom: 12 }}>
					<Select
						key='source'
						style={{ width: 200 }}
						value={source}
						options={Object.values(ENguonSinhMa).map((item) => ({ value: item, key: item, label: nguonSinhMa[item] }))}
						onChange={(val) => setSource(val)}
					/>

					{source === ENguonSinhMa.HOC_PHAN ? (
						<>
							<SelectTrinhDo
								selectMa
								style={{ width: 200 }}
								value={recTrinhDo?.ma}
								onChange={(val) => setTrinhDo(danhSachTrinhDo.find((item) => item.ma === val))}
								allowClear
							/>
							<SelectDonVi
								style={{ width: 350 }}
								value={recDonVi?.maDonVi}
								onChange={(val) => setDonVi(danhSachDonVi.find((item) => item.maDonVi === val))}
								allowClear
							/>
						</>
					) : null}
				</Space>
			</TableBase>
		</>
	);
};

export default SoThuTuMaPage;
