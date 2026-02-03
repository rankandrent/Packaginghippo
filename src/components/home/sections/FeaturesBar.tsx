"use client"

import {
    DollarSign,
    Clock,
    Truck,
    Package,
    Palette,
    PenTool,
    Sparkles,
    Shield,
    Zap,
    CheckCircle,
    Monitor,
    Ruler,
    Ban
} from "lucide-react"

const iconMap: { [key: string]: any } = {
    dollar: DollarSign,
    clock: Clock,
    truck: Truck,
    package: Package,
    palette: Palette,
    pen: PenTool,
    sparkles: Sparkles,
    shield: Shield,
    zap: Zap,
    check: CheckCircle,
    monitor: Monitor,
    ruler: Ruler,
    ban: Ban
}

interface Feature {
    icon: string
    title: string
    subtitle?: string
}

export function FeaturesBar({ data }: { data: any }) {
    const heading = data?.heading || "ONE PLACE - Where you get all your custom packaging needs"
    const features: Feature[] = data?.items || [
        { icon: "ban", title: "NO DIE &", subtitle: "PLATE CHARGES" },
        { icon: "clock", title: "QUICK", subtitle: "TURNAROUND TIME" },
        { icon: "truck", title: "FREE", subtitle: "SHIPPING" },
        { icon: "package", title: "STARTING FROM", subtitle: "50 BOXES" },
        { icon: "ruler", title: "CUSTOMIZE SIZE", subtitle: "& STYLE" },
        { icon: "monitor", title: "FREE GRAPHIC", subtitle: "DESIGNING" },
    ]

    return (
        <section className="py-12 bg-[#F0FDF4] border-y border-emerald-100">
            <div className="container mx-auto px-4">
                {heading && (
                    <h3 className="text-center text-lg md:text-xl font-semibold text-gray-800 mb-8">
                        {heading}
                    </h3>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-4">
                    {features.map((feature, idx) => {
                        const IconComponent = iconMap[feature.icon] || CheckCircle
                        return (
                            <div
                                key={idx}
                                className="flex flex-col items-center text-center group"
                            >
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-emerald-200 bg-white flex items-center justify-center mb-4 group-hover:border-emerald-500 group-hover:shadow-lg transition-all duration-300">
                                    <IconComponent className="w-10 h-10 md:w-12 md:h-12 text-emerald-600 group-hover:text-emerald-700 transition-colors" />
                                </div>
                                <p className="text-xs md:text-sm font-bold text-gray-800 uppercase tracking-wide">
                                    {feature.title}
                                </p>
                                {feature.subtitle && (
                                    <p className="text-xs md:text-sm font-bold text-gray-800 uppercase tracking-wide">
                                        {feature.subtitle}
                                    </p>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
