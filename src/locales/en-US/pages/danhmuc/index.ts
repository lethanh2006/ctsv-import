import activities from './activities';
import attributes from './attributes';
import ccd from './ccd';
import competency from './competency';
import levels from './levels';
import questions from './questions';
import roles from './roles';
import studentapprover from './studentapprover';
import track from './track';

export default {
	...roles,
	...attributes,
	...levels,
	...questions,
	...activities,
	...competency,
	...ccd,
	...track,
	...studentapprover,
};
