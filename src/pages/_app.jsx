import Head from 'next/head'
import { navigationMap } from "../components/utils/global"
import { slugifyWithCounter } from '@sindresorhus/slugify'
import PlausibleProvider from 'next-plausible'
import {Prism} from 'prism-react-renderer'
;(typeof global !== 'undefined' ? global : window).Prism = Prism

require('prismjs/components/prism-rust')
require('prismjs/components/prism-toml')
require('prismjs/components/prism-bash')
require("prismjs/components/prism-zig")

import { Layout } from '@/components/Layout'
import StyledComponentsRegistry from '@/components/StyleComponentRegistry'
import 'focus-visible'
import '@/styles/tailwind.css'
import "@/styles/loading.css"
import "@/styles/scrollBar.css"
import { useRouter } from 'next/router'

function getNodeText(node) {
  let text = ''
  for (let child of node.children ?? []) {
    if (typeof child === 'string') {
      text += child
    }
    text += getNodeText(child)
  }
  return text
}

function collectHeadings(nodes, slugify = slugifyWithCounter()) {
  let sections = []

  for (let node of nodes) {
    if (/^h[234]$/.test(node.name)) {
      let title = getNodeText(node)
      if (title) {
        let id = slugify(title)
        node.attributes.id = id
        if (node.name === 'h4') {
          let l = sections[sections.length - 1].children.length
          sections[sections.length - 1].children[l-1].children.push({
            ...node.attributes,
            title,
          }) 
        } else if (node.name === 'h3') {
          sections[sections.length - 1].children.push({
            ...node.attributes,
            title,
            children: [],
          })
        } else if (node.name === 'h2') {
          sections.push({...node.attributes, title, children: []})
        }
      }
    }

    sections.push(...collectHeadings(node.children ?? [], slugify))
  }

  return sections
}

const App = ({ Component, pageProps }) => {
  let title = pageProps.markdoc?.frontmatter.title
  const { locale } = useRouter()

  let description = pageProps.markdoc?.frontmatter.description

  let content = pageProps.markdoc?.content
    ? pageProps.markdoc?.content.filter(function(article){
      return article.attributes.i18n === locale
    })
    : []
  let tableOfContents = collectHeadings(content)
  let pageTitle = content.length > 0 ? `${content[0].children[0].children[0]} - Docs` : `Rust - Docs`

  return (
    <>
      <PlausibleProvider domain="hyperter.top" trackOutboundLinks={true}>
        <Head>
          <title>{pageTitle}</title>
          {description && <meta name="description" content={description} />}

          {/* Open Graph */}
          <meta property="og:type" content="website" />
          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={description} />
          <meta
            property="og:image"
            content="https://rust.hyperter.top/logo.png"
          />
          <meta property="og:image:width" content="250" />
          <meta property="og:image:height" content="214" />

          {/* Twitter */}
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content={pageTitle} />
          <meta name="twitter:description" content={description} />
          <meta
            name="twitter:image"
            content="https://rust.hyperter.top/logo.png"
          />
        </Head>
        <StyledComponentsRegistry>
        <Layout
          navigation={navigationMap[locale]}
          title={title}
          tableOfContents={tableOfContents}
        >
            <Component {...pageProps} />
        </Layout>
        </StyledComponentsRegistry>
      </PlausibleProvider>
    </>
  )
}

export default App;
