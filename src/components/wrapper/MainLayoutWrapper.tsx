import Header from "../base/Header";




export default function MainLayoutWrapper({ children }: { children: React.ReactNode }) {

  return (
    <>
      <Header />
      {children}
    </>

  )
}
