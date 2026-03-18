import { Activity } from '../Activity/typing';
import { EActivityCategory, EApprovalStatus } from '../constant';

declare module ActivityOutCome {
	export interface IRecord {
		_id: string;
		name: string;
		code: string;
		email: string;
		banner: string;
		activitiesOutcomeName: string;
		activitiesId: string;
		activities: Activity.IRecord;
		activitiesTypeId: string;
		activitiesType: ActivitiesManagement.IRecord;
		rolesId: string;
		roles?: RolesManagement.IRecord;
		levelsId: string;
		levels?: LevelsManagement.IRecord;
		trackId?: string;
		track?: TrackManagement.IRecord;
		trackText?: string;
		organizer: string;
		description: string;
		location: string;
		learningOutcomes: string;
		file: string[] | null;
		answerId: string;
		selfAssessmentQuestionsId: string;
		workflow: EApprovalStatus;
		activityCategory: EActivityCategory;
		studentDeclarationApproverName: string;
		studentDeclarationApproverSsoId: string;
		activityRejectionNote: string;
		revisionNote: string;
		validation: Evalidation;
		reflection: string;
		startDate: Date;
		endDate: Date;
		dueDate: Date;

		activityRejectionNote?: string;
		listAchievedCompetencies: Activity.ICompetencyMapping[];
		evidenceFile: {
			name: string;
			file: string[];
		}[];

		supervisorSsoId: string;
		supervisorName: string;
		supervisorCode: string;

		submittedAt?: Date;
		approvalTime?: Date;

		createdAt: Date;
		updatedAt: Date;
	}

	export interface IAnalyticsStaff {
		pending: number;
		processed: number;
		total: number;
	}

	export interface IAnalyticsApprovers {
		total: number;
		processed: number;
		pending: number;
		unassigned: number;
	}

	export interface ICompetencyMapping {
		_id: string;
		index?: number;
		activityOutcomeId: string;
		activityOutcome?: IRecord;
		competencyId: string;
		competencie?: Competency.IRecord;
		attributesId: string;
		attributes?: AttributesManagement.IRecord;

		dsCompetencie?: Competency.IRecord[];
	}

	export interface ICompetencyActivity {
		_id: string;
		competencyId: string;
		activitiesId: string;
		competency: Competency.IRecord;
		activities: IRecord;
	}
}
