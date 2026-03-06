import { packages } from "@/lib/data"
import { PackageDetailsClient } from "@/components/packages/package-details"

export async function generateStaticParams() {
  return packages.map((pkg) => ({
    id: pkg.id,
  }))
}

export default async function PackageDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const pkg = packages.find((p) => p.id === id)

  return <PackageDetailsClient id={id} initialPkg={pkg} />
}
