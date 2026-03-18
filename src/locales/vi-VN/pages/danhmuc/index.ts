import activities from './activities';
import attributes from './attributes';
import competency from './competency';
import levels from './levels';
import questions from './questions';
import roles from './roles';

export default { ...roles, ...attributes, ...levels, ...questions, ...activities, ...competency };
