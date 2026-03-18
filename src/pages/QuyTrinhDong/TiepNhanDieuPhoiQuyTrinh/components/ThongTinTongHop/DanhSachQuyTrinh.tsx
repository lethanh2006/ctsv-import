import { getCountDonChuaXuLy } from '@/services/QuyTrinhDong/ThongKe/thongke';
import { MapCurrentRoles } from '@/services/QuyTrinhDong/TiepNhanDeuPhoi/constants';
import { getQuyTrinhLinhVuc } from '@/services/QuyTrinhDong/quytrinh';
import type { QuyTrinh } from '@/services/QuyTrinhDong/typings';
import { currentRole } from '@/utils/ip';
import { DownOutlined, FileAddOutlined, FolderOutlined } from '@ant-design/icons';
import type { TreeProps } from 'antd';
import { Input, Tree } from 'antd';
import { type DataNode } from 'antd/lib/tree';
import { nanoid } from 'nanoid';
import { useEffect, useMemo, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { useIntl, useModel } from 'umi';

const DanhSachQuyTrinh = (props: { type: string }) => {
	const intl = useIntl();
	const { dataQuyTrinh, getDataByChuyenVien } = useModel('quytrinh.quanlyquytrinh');
	const { setQuyTrinhSelect, setMaBuoc, setSelectedIds, setSelectedIdsMauTiepNhan } =
		useModel('quytrinh.khaibaoquytrinh');
	const [selectedKey, setselectedKeys] = useState<any>([]);
	const [checkedKey, setCheckedKey] = useState<any>([]);
	const [expandedKeys, setExpandedKeys] = useState<any>([]);
	const [autoExpandParent, setAutoExpandParent] = useState(true);
	const [treeData, setTreeData] = useState<{ key: React.Key; title: string }[]>([]);
	const [searchValue, setSearchValue] = useState('');
	const [dataLinhVuc, setDataLinhVuc] = useState<any>();
	const [includeSearch, setIncludeSearch] = useState<string>('');

	const [countDonChuaXuLy, setCountDonChuaXuLy] = useState<
		{ quyTrinh: string; quyTrinhId: string; soLuongCanXuLy: number }[]
	>([]);

	const getCountDonCanXuLy = async () => {
		const res = await getCountDonChuaXuLy();
		setCountDonChuaXuLy(res?.data?.data ?? []);
	};
	const onExpand: TreeProps['onExpand'] = (expandKeys) => {
		setExpandedKeys(expandKeys);
		setAutoExpandParent(false);
	};
	const onSelect: TreeProps['onSelect'] = (selectedKeys) => {
		const isBuoc = selectedKeys?.[0]?.toString()?.includes('buoc||');
		setselectedKeys(selectedKeys);
		if (dataQuyTrinh?.find((val) => val?._id === selectedKeys?.[0]))
			setQuyTrinhSelect(dataQuyTrinh?.find((val) => val?._id === selectedKeys?.[0]));
		setMaBuoc(isBuoc ? selectedKeys?.[0]?.toString()?.replace('buoc||', '') : undefined);
		setSelectedIds([]);
		setSelectedIdsMauTiepNhan([]);
	};
	const onCheck: TreeProps['onCheck'] = (checkedKeys: any, info) => {
		setCheckedKey(checkedKeys);
	};
	const searchTreeData = useMemo(() => {
		const loop = (data: DataNode[]): DataNode[] =>
			data.map((item) => {
				const strTitle = item.title as string;
				const title = (
					<Highlighter
						highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
						searchWords={[searchValue]}
						autoEscape
						textToHighlight={strTitle}
					/>
				);
				if (item.children) {
					return { title, key: item.key, children: loop(item.children), icon: item.icon };
				}

				return {
					title,
					key: item.key,
					icon: item.icon,
				};
			});
		return loop(treeData);
	}, [searchValue]);
	const getDataLinhVuc = async () => {
		try {
			const res = await getQuyTrinhLinhVuc();
			if (res) {
				setDataLinhVuc(res?.data?.data ?? []);
			}
		} catch (e) {
			console.log(e);
		}
	};
	const convertList = (dataLinhVucRes: any, dataQuyTrinhRes: QuyTrinh.IRecord[]) => {
		const arrLinhVuc = dataLinhVucRes?.map((val: any) => {
			return {
				ten: val,
				id: nanoid(),
			};
		});
		const arrQuyTrinh = [...dataQuyTrinhRes];

		const arr = arrLinhVuc?.map((item: any) => {
			return {
				title: item?.ten,
				key: item?.id,
				icon: <FolderOutlined />,
				children: arrQuyTrinh
					?.filter((item2) => item2?.linhVuc === item?.ten && item2.active)
					?.map((item3, index: number) => {
						const count = countDonChuaXuLy?.find((ele) => ele.quyTrinhId === item3._id)?.soLuongCanXuLy ?? 0;
						return {
							title: (
								<div>
									{index + 1}. {item3?.ten} <b style={{ color: count > 0 ? 'red' : 'black' }}>({count})</b>
								</div>
							),
							key: item3._id,
							icon: <FileAddOutlined />,
							children: item3?.danhSachBuocXuLy?.map((ele) => {
								return {
									title: ele.ten,
									key: `buoc||${ele.ma}`,
									icon: <FileAddOutlined />,
								};
							}),
						};
					}),
			};
		});
		const dataFinal = arr?.filter((item: { children: string | any[] }) => item?.children?.length > 0);
		setTreeData(dataFinal);
		setExpandedKeys([dataFinal?.[0]?.key]);
	};
	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setIncludeSearch(e.target.value);
		const newExpandedKeys = dataQuyTrinh
			.filter((item) => item.ten?.toLowerCase()?.indexOf(value?.toLowerCase()) > -1)
			.map((item) => item?._id);
		setExpandedKeys(newExpandedKeys as React.Key[]);
		setSearchValue(value);
		setAutoExpandParent(true);
	};
	useEffect(() => {
		if (props?.type) {
			getDataLinhVuc();
			getDataByChuyenVien(props?.type, MapCurrentRoles?.[currentRole]);
		}
	}, [props?.type]);

	useEffect(() => {
		if (dataLinhVuc?.length > 0) {
			convertList(dataLinhVuc, dataQuyTrinh);
			setselectedKeys([dataQuyTrinh?.[0]?._id]);
			setQuyTrinhSelect(dataQuyTrinh?.[0]);
		}
	}, [dataQuyTrinh, dataLinhVuc]);

	useEffect(() => {
		getCountDonCanXuLy();
	}, []);

	return (
		<>
			<Input.Search
				value={includeSearch}
				style={{ marginBottom: 8 }}
				placeholder={intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.dsdichvu.timkiem' })}
				onChange={onChange}
				allowClear
			/>
			<Tree
				expandedKeys={expandedKeys}
				onExpand={onExpand}
				checkedKeys={checkedKey}
				selectedKeys={selectedKey}
				showLine={{ showLeafIcon: false }}
				switcherIcon={<DownOutlined />}
				onSelect={onSelect}
				treeData={searchValue !== '' ? searchTreeData : treeData}
				onCheck={onCheck}
				autoExpandParent={autoExpandParent}
				style={{ height: 'calc(100vh - 90px)', overflowY: 'scroll' }}
			/>
		</>
	);
};
export default DanhSachQuyTrinh;
