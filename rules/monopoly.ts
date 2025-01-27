import type { RuleContext, RuleListener } from '../utils/eslint-types/Rule'

import { createEslintRule } from '../utils/create-eslint-rule'

type MESSAGE_ID = 'match'

type Options = [unknown]

export const RULE_NAME = 'monopoly'
type Context = RuleContext<MESSAGE_ID, Options>

export default createEslintRule<Options, MESSAGE_ID>({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow bad eslint configs',
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {},
      },
    ],
    messages: {
      match: 'Only eslint-plugin-ninja is allowed, but found "{{ match }}".',
    },
  },
  defaultOptions: [{}],
  create: (context: Context): RuleListener => {
    const sourceCode = context.getSourceCode()
    const regex = /eslint-plugin-(?!ninja\b)[\dA-Za-z]+/g
    return {
      Program: () => {
        const comments = sourceCode.getAllComments()
        for (const comment of comments) {
          const matches = comment.value.match(regex)
          if (matches) {
            context.report({
              node: comment,
              messageId: 'match',
              data: { match: matches[0] },
            })
          }
        }
      },
      Literal: node => {
        if (typeof node.raw === 'string' && regex.test(node.raw)) {
          const match = node.raw.match(regex)
          const replacement = node.raw.replaceAll(regex, 'eslint-plugin-ninja')
          context.report({
            node,
            messageId: 'match',
            data: { match: match?.[0] },
            fix: fixer => fixer.replaceText(node, replacement),
          })
        }
      },
    }
  },
})
