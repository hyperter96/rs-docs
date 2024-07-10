import clsx from 'clsx'

import { Icon } from '@/components/Icon'

const styles = {
  note: {
    container:
      'bg-zinc-50 dark:bg-zinc-800/60 dark:ring-1 dark:ring-slate-300/10',
    title: 'text-amber-900 dark:text-amber-400',
    body: 'text-amber-800 prose-code:text-amber-900 dark:text-slate-300 dark:prose-code:text-slate-300 prose-a:text-amber-900 [--tw-prose-background:theme(colors.amber.50)] prose-inline-code:text-red-700 dark:prose-inline-code:text-amber-100',
  },
  warning: {
    container:
      'bg-amber-50 dark:bg-zinc-800/60 dark:ring-1 dark:ring-slate-300/10',
    title: 'text-amber-900 dark:text-amber-500',
    body: 'text-amber-800 prose-code:text-amber-900 prose-a:text-amber-900 [--tw-prose-underline:theme(colors.amber.400)] dark:[--tw-prose-underline:theme(colors.amber.700)] [--tw-prose-background:theme(colors.amber.50)] dark:text-slate-300 dark:prose-code:text-slate-300 prose-inline-code:text-red-700 dark:prose-inline-code:text-amber-100',
  },
}

const icons = {
  note: (props) => <Icon icon="lightbulb" {...props} />,
  warning: (props) => <Icon icon="warning" color="amber" {...props} />,
}

export function Callout({ type = 'note', title, children }) {
  let IconComponent = icons[type]

  return (
    <div className={clsx('my-8 flex rounded-3xl p-4', styles[type].container)}>
      <IconComponent className="h-8 w-8 flex-none" />
      <div className="ml-4 flex-auto">
        <p className={clsx('m-0 font-display text-xl', styles[type].title)}>
          {title}
        </p>
        <div className={clsx('prose mt-2.5', styles[type].body)}>
          {children}
        </div>
      </div>
    </div>
  )
}
