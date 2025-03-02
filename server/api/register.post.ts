import {
  __,
  assertQuery,
  insertInto,
  isLoggedIn,
  parseBody,
  pruviousError,
  selectFrom,
  setTokenCookies,
  signToken,
} from '#pruvious/server'
import { pick } from '@pruvious/utils'

export default defineEventHandler(async (event) => {
  if (isLoggedIn()) {
    throw pruviousError(event, {
      statusCode: 403,
      message: __('api', 'You are already logged in'),
    })
  }

  let defaultRoleId = null

  const defaultRoleQuery = await selectFrom('Roles')
    .select('id')
    .where('name', '=', 'Default')
    .first()

  assertQuery(defaultRoleQuery)

  if (defaultRoleQuery.data) {
    defaultRoleId = defaultRoleQuery.data.id
  } else {
    const createDefaultRoleQuery = await insertInto('Roles')
      .values({
        name: 'Default',
        permissions: [
          'access-dashboard',
          'update-account',
          'collection:todos:create',
          'collection:todos:read',
          'collection:todos:update',
          'collection:todos:delete',
        ],
      })
      .returning('id')
      .run()

    assertQuery(createDefaultRoleQuery)

    defaultRoleId = createDefaultRoleQuery.data[0].id
  }

  const { input } = await parseBody(event, 'object')
  const createUserQuery = await insertInto('Users')
    .values({
      ...pick(input, ['firstName', 'lastName', 'email', 'password']),
      roles: [defaultRoleId],
    })
    .returning('tokenSubject')
    .withCustomContextData({ __ignoreMaskFieldsHook: true })
    .run()

  assertQuery(createUserQuery)

  const token = await signToken(createUserQuery.data[0].tokenSubject)

  setTokenCookies(token)

  return { token }
})
