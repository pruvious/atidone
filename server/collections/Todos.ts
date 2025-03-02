import {
  __,
  defineCollection,
  textField,
  trueFalseField,
} from '#pruvious/server'
import { castToNumber, isDefined } from '@pruvious/utils'

export default defineCollection({
  fields: {
    title: textField({ required: true }),
    completed: trueFalseField({}),
  },
  author: { strict: true },
  ui: { menu: { icon: 'checklist' } },
  guards: [
    async (context) => {
      const event = useEvent()
      const { auth } = event.context.pruvious

      if (
        auth.isLoggedIn &&
        (context.operation === 'insert' || context.operation === 'update') &&
        isDefined(context.getRawInputValue('author')) &&
        castToNumber(context.getRawInputValue('author')) !== auth.user.id &&
        !auth.user.isAdmin
      ) {
        setResponseStatus(event, 403)
        throw new Error(
          __('api', 'You can only create or update your own todos')
        )
      }
    },
  ],
})
