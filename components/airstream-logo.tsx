import Image from "next/image"

export function AirstreamLogo() {
  return (
    <div className="flex items-center justify-center">
      <Image src="/bl-logo.svg" alt="BI Logo" width={200} height={40} priority />
    </div>
  )
}
