type ContainerProps = {
  children: React.ReactNode
}

const Container = (props: ContainerProps) => {
  return (
    <main className='mx-auto flex min-h-full w-full max-w-5xl flex-col px-2 py-20 md:flex-row md:p-0'>
      {props.children}
    </main>
  )
}

export default Container
