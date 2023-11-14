'use strict'

import isShorthandPropertyValue from '../utils/is-shorthand-property-value.js'

import isShorthandPropertyAssignmentPatternLeft from '../utils/is-shorthand-property-assignment-pattern-left.js'

import isShorthandImportLocal from '../utils/is-shorthand-import-local.js'

import isShorthandExportLocal from '../utils/is-shorthand-export-local.js'
import { RuleFixer } from '../../utils/eslint-types/Rule.js'

export function replaceReferenceIdentifier(
  identifier: any,
  replacement: string,
  fixer: RuleFixer,
) {
  if (
    isShorthandPropertyValue(identifier) ||
    isShorthandPropertyAssignmentPatternLeft(identifier)
  ) {
    return fixer.replaceText(identifier, `${identifier.name}: ${replacement}`)
  }

  if (isShorthandImportLocal(identifier)) {
    return fixer.replaceText(identifier, `${identifier.name} as ${replacement}`)
  }

  if (isShorthandExportLocal(identifier)) {
    return fixer.replaceText(identifier, `${replacement} as ${identifier.name}`)
  }

  // `typeAnnotation`
  if (identifier.typeAnnotation) {
    return fixer.replaceTextRange(
      [identifier.range[0], identifier.typeAnnotation.range[0]],
      `${replacement}${identifier.optional ? '?' : ''}`,
    )
  }

  return fixer.replaceText(identifier, replacement)
}

export default replaceReferenceIdentifier