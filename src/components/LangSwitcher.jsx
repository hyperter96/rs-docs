import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Listbox } from '@headlessui/react'
import clsx from 'clsx'

const langs = [
  { name: '简体中文', value: 'zh-CN', icon: ZhCnIcon },
  { name: 'English', value: 'en', icon: EnIcon },
  { name: 'Español', value: 'es', icon: EsIcon},
]

function IconBase({ children, ...props }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 512 420.165" {...props}>
      {children}
    </svg>
  )
}

function ZhCnIcon(props) {
  return (
    <IconBase {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M74.316 0h363.368c20.398 0 38.963 8.366 52.425 21.816h.075C503.634 35.266 512 53.862 512 74.316v271.533c0 20.398-8.366 38.963-21.816 52.426l-.075.074c-13.462 13.45-32.027 21.816-52.425 21.816H74.316c-20.454 0-39.05-8.366-52.5-21.816l-1.065-1.164C7.926 383.822 0 365.702 0 345.849V74.316c0-20.454 8.366-39.05 21.816-52.5C35.266 8.366 53.862 0 74.316 0zm171.611 283.285H119.668v-29.282l59.966-78.239-.704-1.401h-49.189l-4.217-37.483h119.467v29.282l-59.268 78.239.704 1.408h59.5v37.476zm99.553 0V231.52h-35.132v51.765h-46.851V136.88h46.851v51.772h35.132V136.88h46.852v146.405H345.48z"
      />
    </IconBase>
  )
}

function EnIcon(props) {
  return (
    <IconBase {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M74.32 0h363.36C478.55 0 512 33.46 512 74.32v271.53c0 40.82-33.5 74.32-74.32 74.32H74.32C33.44 420.17 0 386.69 0 345.85V74.32C0 33.41 33.41 0 74.32 0zm265.7 282.62c-4.24-6.15-38.45-62.67-38.76-62.67v62.67h-46.42V137.55h43.63c4.19 6.07 37.63 62.67 38.77 62.67v-62.67h46.41v145.07h-43.63zm-118.83-54.78h-46.42v17.64h56.86v37.14H128.35V137.55h102.12l-5.8 37.14h-49.9v19.49h46.42v33.66z"
      />
    </IconBase>
  )
}

function EsIcon(props) {
  return (
    <IconBase {...props}>
      <path 
      fillRule='evenodd'
      clipRule='evenodd'
      d='M74.32 0h363.36C478.55 0 512 33.46 512 74.32v271.53c0 40.82-33.5 74.32-74.32 74.32H74.32C33.44 420.17 0 386.69 0 345.85V74.32C0 33.41 33.41 0 74.32 0zm151.15 227.92h-46.63v17.72h57.12v37.3H132.22V137.23h102.57l-5.83 37.3h-50.12v19.58h46.63v33.81zm31.47 52.45l6.52-38.46c14.3 3.57 27.17 5.36 38.58 5.36 11.43 0 20.64-.47 27.63-1.4v-11.66l-20.98-1.86c-18.96-1.71-31.98-6.26-39.05-13.64-7.07-7.38-10.61-18.3-10.61-32.76 0-19.89 4.32-33.57 12.94-41.03 8.63-7.45 23.27-11.19 43.95-11.19 20.67 0 39.32 1.95 55.95 5.83l-5.83 37.31c-14.45-2.34-26.03-3.51-34.73-3.51-8.71 0-16.1.39-22.16 1.17v11.42l16.79 1.64c20.36 2.02 34.43 6.88 42.2 14.57 7.77 7.69 11.65 18.37 11.65 32.05 0 9.8-1.31 18.07-3.96 24.83-2.64 6.76-5.78 11.89-9.44 15.39-3.65 3.5-8.82 6.18-15.5 8.04-6.68 1.87-12.55 2.99-17.61 3.38-5.05.39-11.77.58-20.16.58-20.2 0-38.93-2.02-56.18-6.06z'
      />
    </IconBase>
  )
}

export function LangSwitcher(props) {
  const {pathname, query, asPath, locale} = useRouter()
  let [selectedLang, setSelectedLang] = useState(langs.filter(function(lang){
    return lang.value === locale
  })[0])
  useEffect(() => {
    if (selectedLang) {
      document.documentElement.setAttribute('lang', selectedLang.value)
    } else {
      setSelectedLang(
        langs.find(
          (lang) =>
            lang.value === document.documentElement.getAttribute('lang')
        )
      )
    }
  }, [selectedLang])

  return (
    <Listbox
      as="div"
      value={selectedLang}
      onChange={setSelectedLang}
      {...props}
    >
      <Listbox.Label className="sr-only">Lang</Listbox.Label>
      <Listbox.Button className="flex h-6 w-6 items-center justify-center rounded-lg shadow-md shadow-black/5 ring-1 ring-black/5 dark:bg-ghost-700 dark:ring-inset dark:ring-white/5">
        <span className="sr-only">{selectedLang?.name}</span>
        <ZhCnIcon className="hidden h-4 w-4 fill-sky-400 [[lang=zh-CN]_&]:block" />
        <EnIcon className="hidden h-4 w-4 fill-sky-400 [[lang=en]_&]:block" />
        <EsIcon className="hidden h-4 w-4 fill-sky-400 [[lang=es]_&]:block" />
      </Listbox.Button>
      <Listbox.Options className="absolute top-full left-1/2 mt-3 w-36 -translate-x-1/2 space-y-1 rounded-xl bg-white p-3 text-sm font-medium shadow-md shadow-black/5 ring-1 ring-black/5 dark:bg-ghost-700 dark:ring-white/5">
        {langs.map((lang) => (
            <Link key={lang.value} href={{pathname, query}} as={asPath} locale={lang.value}>
          <Listbox.Option
            key={lang.value}
            value={lang}
            className={({ active, selected }) =>
              clsx(
                'flex cursor-pointer select-none items-center rounded-[0.625rem] p-1',
                {
                  'text-sky-500': selected,
                  'text-slate-900 dark:text-white': active && !selected,
                  'text-slate-700 dark:text-slate-400': !active && !selected,
                  'bg-ghost-100 dark:bg-ghost-900/40': active,
                }
              )
            }
          >
            {({ selected }) => (
              <>
                <div className="rounded-md bg-white p-1 shadow ring-1 ring-slate-900/5 dark:bg-ghost-700 dark:ring-inset dark:ring-white/5">
        
                  <lang.icon
                    className={clsx('h-5 w-5', {
                      'fill-sky-400 dark:fill-sky-400': selected,
                      'fill-slate-400': !selected,
                    })}
                  />
                </div>
                <div className="ml-3">{lang.name}</div>
              </>
            )}
          </Listbox.Option>
          </Link>
        ))}
      </Listbox.Options>
    </Listbox>
  )
}
