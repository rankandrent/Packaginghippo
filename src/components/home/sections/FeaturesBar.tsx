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
    CheckCircle
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
}

interface Feature {
    icon: string
    title: string
    subtitle?: string
}

export function FeaturesBar({ data }: { data: any }) {
    const heading = data?.heading || "ONE PLACE - Where you get all your custom packaging needs"
    const features: Feature[] = data?.items || [
        { icon: "dollar", title: "NO DIE &", subtitle: "PLATE CHARGES" },
        { icon: "clock", title: "QUICK", subtitle: "TURNAROUND TIME" },
        { icon: "truck", title: "FREE", subtitle: "SHIPPING" },
        { icon: "package", title: "STARTING FROM", subtitle: "50 BOXES" },
        { icon: "palette", title: "CUSTOMIZE SIZE", subtitle: "& STYLE" },
        { icon: "pen", title: "FREE GRAPHIC", subtitle: "DESIGNING" },
    ]

    return (
        <section className="py-8 bg-gradient-to-r from-gray-100 to-gray-50 border-y border-gray-200">
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
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-gray-400 flex items-center justify-center mb-3 group-hover:border-primary group-hover:bg-primary/5 transition-all">
                                    <IconComponent className="w-8 h-8 md:w-10 md:h-10 text-gray-600 group-hover:text-primary transition-colors" />
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
