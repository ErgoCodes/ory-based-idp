"use client"

const Header = ({ title, subtitle }: { title: string; subtitle: string }) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <h2 className=" text-3xl font-semibold">{title}</h2>
      <h5>{subtitle}</h5>
    </div>
  )
}

export default Header
