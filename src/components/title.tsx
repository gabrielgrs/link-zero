export function Title({ children }: { children: React.ReactNode }) {
  return (
    <h1 className='relative w-max flex items-center gap-2'>
      <div className='text-accent'>_</div>
      {children}
    </h1>
  )
}
