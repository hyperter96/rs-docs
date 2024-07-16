import 'katex/dist/katex.min.css'
import React from "react";
import Markdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import TeX from '@matejmazur/react-katex';
export function MathFormula({ formula }) {
  return (
    <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
      {formula}
    </Markdown>
  )
}

export function InlineMath({ children }) {
    return (
    <TeX>
        {children}
    </TeX>
    )
}