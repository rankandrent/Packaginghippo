import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbItem {
    label: string
    href?: string
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[]
    theme?: 'dark' | 'light'
}

export function Breadcrumbs({ items, theme = 'dark' }: BreadcrumbsProps) {
    const isDark = theme === 'dark'

    // Styles for inactive links
    const linkColor = isDark
        ? "text-gray-200 hover:text-yellow-400 drop-shadow-sm"
        : "text-gray-600 hover:text-yellow-600 font-medium"

    // Styles for active item
    const activeColor = isDark
        ? "text-white font-bold drop-shadow-md"
        : "text-black font-bold"

    // Styles for separator
    const separatorColor = isDark ? "text-gray-400" : "text-gray-400"

    // Home icon color
    const homeIconColor = isDark
        ? "text-gray-300 group-hover:text-yellow-400"
        : "text-gray-500 group-hover:text-yellow-600"

    return (
        <nav className="flex overflow-x-auto whitespace-nowrap pb-1" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                    <Link
                        href="/"
                        className={`inline-flex items-center text-sm font-medium transition-colors group ${linkColor}`}
                    >
                        <Home className={`w-4 h-4 mr-2 ${homeIconColor}`} />
                        Home
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={index}>
                        <div className="flex items-center">
                            <ChevronRight className={`w-4 h-4 mx-1 ${separatorColor}`} />
                            {item.href ? (
                                <Link
                                    href={item.href}
                                    className={`ml-1 text-sm font-medium md:ml-2 transition-colors ${linkColor}`}
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span className={`ml-1 text-sm font-bold md:ml-2 ${activeColor}`}>
                                    {item.label}
                                </span>
                            )}
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    )
}
