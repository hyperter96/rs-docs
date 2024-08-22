import { DarkMode, Gradient, LightMode } from '@/components/Icon'

export function DashboardIcon({ id, color }) {
  return (
    <>
      <defs>
        <Gradient
          id={`${id}-gradient`}
          color={color}
          gradientTransform="matrix(0 21 -21 0 12 3)"
        />
        <Gradient
          id={`${id}-gradient-dark`}
          color={color}
          gradientTransform="matrix(0 21 -21 0 16 7)"
        />
      </defs>
      <LightMode>
        <circle cx={16} cy={12} r={12} fill={`url(#${id}-gradient)`} />
        <path  fillOpacity={0.5} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} className="fill-[var(--icon-background)] stroke-[color:var(--icon-foreground)]" d="M25.18,12.32l-5.91,5.81a3,3,0,1,0,1.41,1.42l5.92-5.81Z"></path>
        <path fillOpacity={0.5} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} className="fill-[var(--icon-background)] stroke-[color:var(--icon-foreground)]" d="M18,4.25A16.49,16.49,0,0,0,5.4,31.4l.3.35H30.3l.3-.35A16.49,16.49,0,0,0,18,4.25Zm11.34,25.5H6.66a14.43,14.43,0,0,1-3.11-7.84H7v-2H3.55A14.41,14.41,0,0,1,7,11.29l2.45,2.45,1.41-1.41L8.43,9.87A14.41,14.41,0,0,1,17,6.29v3.5h2V6.3a14.47,14.47,0,0,1,13.4,13.61H28.92v2h3.53A14.43,14.43,0,0,1,29.34,29.75Z"></path>
        <rect x="0" y="0" width="36" height="36" fillOpacity="0"/>
      </LightMode>
      <DarkMode>
      <path className="clr-i-solid clr-i-solid-path-1" d="M18,4.25A16.49,16.49,0,0,0,5.4,31.4l.3.35H30.3l.3-.35A16.49,16.49,0,0,0,18,4.25Zm8.6,9.48-5.92,5.81a3,3,0,1,1-1.41-1.42l5.91-5.81Zm-23,6.17H7v2H3.56c0-.39-.05-.77-.05-1.17S3.53,20.18,3.55,19.9Zm4.88-10,2.46,2.46L9.47,13.74,7,11.29A14.57,14.57,0,0,1,8.43,9.87ZM19,9.79H17V6.29c.32,0,.63,0,1,0s.7,0,1,.05ZM32.49,20.74c0,.39,0,.79-.05,1.17H28.92v-2h3.53C32.47,20.18,32.49,20.46,32.49,20.74Z" fill={`url(#${id}-gradient-dark)`}></path>
    <rect x="0" y="0" width="36" height="36" fillOpacity="0"/>
      </DarkMode>
    </>
  )
}