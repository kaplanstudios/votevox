// pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html className="bg-black m-0"> {/* Apply the class here */}
        <Head />
        <body className="bg-black m-0">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
