declare module ActivitiesManagement {
	export interface IRecord {
		_id: string;
		code: string;
		name: string;
		attributesId: string;
		attributes: AttributesManagement.IRecord[];
		activitiesTypeDomainId: string;
		activitiesTypeDomain: ActivitiesTypeDomain.IRecord;
		activitiesTypeDomainText: string;
		order: number;
		description: string;
		isActive: boolean;
		studentDeclarationApproverList: IStudentDeclaration[];
		activitiesTypeAttributesList: IActivitiesTypeAttributes[];
		requiredEvidenceList: string[];
		trackId: string;
		track: Track.IRecord;
		trackText: string;
	}

	export interface IStudentDeclaration {
		_id: string;
		index: number;
		code: string;
		ssoId: string;
		name: string;
		email: string;
		mainApprover: boolean;
		activitiesTypeId: string;
		activitiesType: IRecord;
		activitiesId: string;
		activities: string;
	}

	export interface IActivitiesTypeAttributes {
		_id: string;
		index: number;
		activitiesTypeId: string;
		attributesId: string;
		activitiesType: IRecord;
		attributes: AttributesManagement.IRecord;
	}
}
