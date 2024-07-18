import { Callout } from '@/components/Callout'
import { LinkGrid } from '@/components/LinkGrid'
import { Article } from '@/components/Article'
import { MathFormula, InlineMath } from '@/components/Math'
import { XmindViewer } from '@/components/XmindViewer'

const tags = {
  xmindViewer: {
    attributes: {
      url: { type: String },
    },
    render: XmindViewer,
  },
  mathFormula: {
    attributes: {
      formula: { type: String },
    },
    render: MathFormula,
  },
  inlineMath: {
    render: InlineMath,
  },
  callout: {
    attributes: {
      title: { type: String },
      type: {
        type: String,
        default: 'note',
        matches: ['note', 'warning'],
        errorLevel: 'critical',
      },
    },
    render: Callout,
  },
  figure: {
    selfClosing: true,
    attributes: {
      src: { type: String },
      alt: { type: String },
      caption: { type: String },
    },
    render: ({ src, alt = '', caption }) => (
      <figure>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} />
        <figcaption>{caption}</figcaption>
      </figure>
    ),
  },
  article: {
    render: Article,
    attributes: {
      i18n: {
        type: String
      }
    }
  },
  'link-grid': {
    render: LinkGrid,
  },
  'link-grid-link': {
    selfClosing: true,
    render: LinkGrid.Link,
    attributes: {
      title: { type: String },
      description: { type: String },
      icon: { type: String },
      customized: { type: Boolean, default: false },
      viewBox: { type: String, default: "32"},
      href: { type: String },
    },
  },
}

export default tags
