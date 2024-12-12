import { helper } from '@ember/component/helper';

export default helper(function absolute(positional /*, named*/) {
  return Math.abs(positional);
});
