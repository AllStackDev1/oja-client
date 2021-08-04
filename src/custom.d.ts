declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>
  export default content
}

declare module '*.png' {
  const value: React.FunctionComponent<
    React.ImgHTMLAttributes<HTMLImageElement>
  >
  export default value
}
