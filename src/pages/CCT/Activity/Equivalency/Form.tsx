import ExpandText from '@/components/ExpandText';
import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import SelectRolesManagement from '@/pages/DanhMuc/Roles/components/Select';
import { Activity } from '@/services/CCT/Activity/typing';
import rules from '@/utils/rules';
import { DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, message, Popconfirm } from 'antd';
import { useEffect, useMemo } from 'react';
import { useIntl, useModel } from 'umi';

const normalizeEquivalencyData = (data: any[]) => {
	const map: Record<string, any> = {};

	data.forEach((item) => {
		const roleId = item.rolesId;
		if (!roleId) return;

		if (!map[roleId]) {
			map[roleId] = {
				rolesId: roleId,
				role: item.roles ?? null,
				attributes: {},
			};
		}

		if (item.attributesId) {
			map[roleId].attributes[item.attributesId] = true;
		}
	});

	return Object.values(map);
};

const EquivalencyForm = (props: { disabled?: boolean }) => {
	const { disabled } = props;
	const intl = useIntl();
	const [form] = Form.useForm();

	const { record: recActi } = useModel('cct.activity');
	const { getModel, danhSach, loading, formSubmiting, postManyEquivalencyModel } = useModel('cct.equivalency');
	const { getAllModel, danhSach: dsAtribute } = useModel('danhmuc.attributes');
	const { danhSach: dsCompetencymapping } = useModel('cct.competencymapping');
	const allowAttributeIds = dsCompetencymapping?.map((i: any) => i.attributesId) || [];

	useEffect(() => {
		getAllModel(undefined, { order: 1 }, { isActive: true });
	}, []);

	const getData = () => {
		if (recActi?._id) {
			getModel({ activitiesId: recActi._id });
		}
	};

	useEffect(() => {
		getData();
	}, [recActi?._id]);

	useEffect(() => {
		if (danhSach?.length) {
			form.setFieldsValue({
				listCoCurricularActivityEquivalency: normalizeEquivalencyData(danhSach),
			});
		}
	}, [JSON.stringify(danhSach)]);

	const highlightAttributeColorMap = useMemo(() => {
		const map: Record<string, string> = {};

		(dsCompetencymapping || []).forEach((item: any) => {
			if (item.attributesId && item.attributes?.color) {
				map[item.attributesId] = item.attributes.color;
			}
		});

		return map;
	}, [dsCompetencymapping]);

	const attributeColumns: IColumn<any>[] = useMemo(() => {
		if (!dsAtribute?.length) return [];

		return dsAtribute.map((attr: any) => {
			const isAllow = allowAttributeIds.includes(attr._id);
			const highlightColor = highlightAttributeColorMap[attr._id];

			return {
				title: (
					<div
						className='attribute-header'
						style={
							highlightColor
								? {
										background: `${highlightColor}11`,
										border: `1px solid ${highlightColor}`,
										color: highlightColor,
										borderRadius: 4,
										padding: '2px 4px',
										textAlign: 'center',
									}
								: undefined
						}
					>
						{attr.code}
					</div>
				),
				width: 60,
				align: 'center',
				render: (_: any, field: any) => (
					<Form.Item className='table-form-item' name={[field.name, 'attributes', attr._id]} valuePropName='checked'>
						<Checkbox disabled={disabled || !isAllow} />
					</Form.Item>
				),
			};
		});
	}, [dsAtribute, allowAttributeIds, highlightAttributeColorMap]);

	const columns: IColumn<any>[] = [
		{
			title: intl.formatMessage({ id: 'activity.equivalency.role' }),
			width: 240,
			fixed: 'left',
			render: (_, field) => (
				<Form.Item
					className='table-form-item'
					name={[field.name, 'rolesId']}
					rules={[
						...rules.required,
						() => ({
							validator(_, value) {
								if (!value) return Promise.resolve();
								const list = form.getFieldValue('listCoCurricularActivityEquivalency') || [];
								const duplicated = list.some((item: any, idx: number) => idx !== field.name && item?.rolesId === value);
								if (duplicated) {
									return Promise.reject(
										new Error(
											intl.formatMessage({
												id: 'activity.equivalency.role.vali',
											}),
										),
									);
								}
								return Promise.resolve();
							},
						}),
					]}
				>
					<SelectRolesManagement
						disabled={disabled}
						size='small'
						allowClear
						onChange={(val, option) => {
							const role = option?.rawData;

							form.setFieldValue(['listCoCurricularActivityEquivalency', field.name, 'role'], role);
						}}
					/>
				</Form.Item>
			),
		},
		{
			title: intl.formatMessage({ id: 'activity.equivalency.description' }),
			width: 280,
			render: (_, field) => (
				<Form.Item shouldUpdate noStyle>
					{({ getFieldValue }) => {
						const role = getFieldValue(['listCoCurricularActivityEquivalency', field.name, 'role']);
						return <ExpandText>{role?.description ?? '--'}</ExpandText>;
					}}
				</Form.Item>
			),
		},
		...attributeColumns,
	];

	const onFinish = (values: { listCoCurricularActivityEquivalency: Activity.IEquivalency[] }) => {
		const list = values.listCoCurricularActivityEquivalency || [];

		const roleIds = list.map((i) => i.rolesId).filter(Boolean);
		if (roleIds.some((id, idx) => roleIds.indexOf(id) !== idx)) {
			message.error(intl.formatMessage({ id: 'activity.equivalency.vali' }));
			return;
		}

		const result: any[] = [];

		list.forEach((item: any) => {
			const { rolesId, attributes = {} } = item;

			const selectedAttributeIds = Object.keys(attributes).filter((id) => attributes[id]);

			if (!selectedAttributeIds.length) {
				result.push({
					activitiesId: recActi?._id,
					rolesId,
					attributesId: null,
				});
				return;
			}

			selectedAttributeIds.forEach((attrId) => {
				result.push({
					activitiesId: recActi?._id,
					rolesId,
					attributesId: attrId,
				});
			});
		});

		postManyEquivalencyModel(
			recActi?._id ?? '',
			{ listCoCurricularActivityEquivalency: result },
			getData,
			intl.formatMessage({ id: 'global.message.luuthanhcong' }),
		)
			.then()
			.catch();
	};

	return (
		<Form form={form} layout='vertical' onFinish={onFinish} component={false}>
			<Form.List name='listCoCurricularActivityEquivalency'>
				{(fields, { add, remove }) => (
					<TableStaticData
						columns={[
							...columns,
							{
								title: intl.formatMessage({ id: 'global.column.action' }),
								width: 90,
								fixed: 'right',
								align: 'center',
								render: (_, field) => (
									<Popconfirm
										title={intl.formatMessage({
											id: 'activity.equivalency.comfirm.xoa',
										})}
										onConfirm={() => remove(field.name)}
										disabled={disabled}
									>
										<ButtonExtend type='link' icon={<DeleteOutlined />} disabled={disabled} />
									</Popconfirm>
								),
							},
						]}
						data={fields}
						loading={loading}
						size='small'
						otherProps={{ pagination: false }}
						onReload={getData}
						hasTotal
					>
						{!disabled && (
							<ButtonExtend
								key='add'
								size='small'
								type='primary'
								onClick={() => {
									const defaultAttributes = (dsAtribute || []).reduce((acc: any, attr: any) => {
										if (allowAttributeIds.includes(attr._id)) {
											acc[attr._id] = true;
										}
										return acc;
									}, {});

									add({
										role: null,
										attributes: defaultAttributes,
									});
								}}
								disabled={disabled}
							>
								{intl.formatMessage({ id: 'global.button.themmoi' })}
							</ButtonExtend>
						)}
					</TableStaticData>
				)}
			</Form.List>

			{!disabled && (
				<div className='form-footer'>
					<Button
						loading={formSubmiting}
						type='primary'
						size='small'
						icon={<SaveOutlined />}
						onClick={() => form.submit()}
					>
						{intl.formatMessage({ id: 'global.button.luulai' })}
					</Button>
				</div>
			)}
		</Form>
	);
};

export default EquivalencyForm;
