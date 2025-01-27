import type { TSESTree } from '@typescript-eslint/types'

import type { SourceCode } from './eslint-types/SourceCode'

export const getCommentBefore = (
  node: TSESTree.Node,
  source: SourceCode,
): TSESTree.Comment | null => {
  const [tokenBefore, tokenOrCommentBefore] = source.getTokensBefore(node, {
    filter: ({ value, type }) =>
      !(type === 'Punctuator' && [',', ';'].includes(value)),
    includeComments: true,
    count: 2,
  }) as (TSESTree.Token | null)[]

  if (
    (tokenOrCommentBefore?.type === 'Block' ||
      tokenOrCommentBefore?.type === 'Line') &&
    node.loc.start.line - tokenOrCommentBefore.loc.end.line <= 1 &&
    tokenBefore?.loc.end.line !== tokenOrCommentBefore.loc.start.line
  ) {
    return tokenOrCommentBefore
  }

  return null
}
