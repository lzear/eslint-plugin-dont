'use strict'

import isShorthandPropertyValue from './is-shorthand-property-value'

const isShorthandPropertyAssignmentPatternLeft = (identifier: any) =>
  identifier.parent.type === 'AssignmentPattern' &&
  identifier.parent.left === identifier &&
  isShorthandPropertyValue(identifier.parent)

export default isShorthandPropertyAssignmentPatternLeft
