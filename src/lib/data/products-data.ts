
export interface ProductCategory {
    name: string;
    slug: string;
    description: string;
    longDescription?: string;
    benefits: string[];
    features: string[];
}

export const STATIC_PRODUCT_CATEGORIES: Record<string, ProductCategory> = {
    "mailer-boxes": {
        name: "Mailer Boxes",
        slug: "mailer-boxes",
        description: "Durable and stylish mailer boxes perfect for e-commerce shipping and subscription boxes.",
        longDescription: "Our custom mailer boxes are designed to provide the ultimate unboxing experience while ensuring your products arrive safely. Made from high-quality corrugated cardboard, they offer excellent protection without the need for adhesive tape.",
        benefits: ["Easy to assemble", "No tape required", "Double-wall protection", "Fully customizable print"],
        features: ["E-flute or B-flute corrugated", "CMYK Printing", "Matte or Gloss Lamination"]
    },
    "rigid-boxes": {
        name: "Rigid Boxes",
        slug: "rigid-boxes",
        description: "Premium rigid boxes for luxury products, gifts, and high-end retail packaging.",
        longDescription: "Also known as set-up boxes, our rigid boxes offer a sturdy and luxurious feel that instantly elevates the perceived value of your product. Ideal for electronics, jewelry, and high-end cosmetics.",
        benefits: ["Superior strength", "Premium feel", "Magnetic closure options", "Keeps products secure"],
        features: ["Greyboard construction", "Premium paper wrapping", "Foil stamping options"]
    },
    "folding-cartons": {
        name: "Folding Cartons",
        slug: "folding-cartons",
        description: "Versatile and lightweight folding cartons suitable for a wide range of retail products.",
        longDescription: "Folding cartons are the industry standard for retail packaging. They are cost-effective, lightweight, and offer ample space for vibrant branding and product information.",
        benefits: ["Cost-effective", "Lightweight", "Flat shipping (saves space)", "High print quality"],
        features: ["SBS or C1S paperboard", "Auto-lock bottom options", "Window patching available"]
    },
    "display-boxes": {
        name: "Display Boxes",
        slug: "display-boxes",
        description: "Counter display boxes designed to showcase your products and boost impulse buy sales.",
        longDescription: "Transform your product packaging into a marketing tool with our custom display boxes. Perfect for retail counters, they organize your products and grab customer attention at the point of sale.",
        benefits: ["Increases visibility", "Promotes impulse buys", "Organized presentation", "Brand reinforcement"],
        features: ["Pop-up headers", "Tiered designs", "Sturdy corrugated base"]
    },
    "cosmetic-boxes": {
        name: "Cosmetic Boxes",
        slug: "cosmetic-boxes",
        description: "Beautifully designed custom boxes for beauty, skincare, and makeup products.",
        longDescription: "In the beauty industry, packaging is everything. Our cosmetic boxes are crafted to reflect the quality and allure of your brand, using special finishes to create a stunning visual impact.",
        benefits: ["Elegant presentation", "Protects fragile glass/tubes", "Builds brand identity", "Variety of finishes"],
        features: ["Spot UV & Embossing", "Custom inserts", "Soft-touch lamination"]
    },
    "food-packaging": {
        name: "Food Packaging",
        slug: "food-packaging",
        description: "Food-safe custom packaging solutions for restaurants, bakeries, and food retail.",
        longDescription: "Hygiene and freshness are paramount. Our food packaging solutions are made with food-grade materials that keep your delicious items fresh and secure while showcasing your brand's appetite appeal.",
        benefits: ["Food-grade materials", "Grease-resistant options", "Maintains freshness", "Brand storytelling"],
        features: ["FDA approved materials", "Leak-proof designs", "Microwave safe options"]
    },
    "eco-friendly": {
        name: "Eco-Friendly Boxes",
        slug: "eco-friendly",
        description: "Sustainable packaging made from recycled materials for environmentally conscious brands.",
        longDescription: "Show your commitment to the planet with our eco-friendly packaging. Made from Kraft paper and recycled materials, these boxes are sturdy, biodegradable, and resonate with today's eco-conscious consumers.",
        benefits: ["Biodegradable", "Recyclable", "Reduces carbon footprint", "Appeals to green consumers"],
        features: ["Kraft paper", "Soy-based inks", "Minimalist design"]
    },
    "retail-boxes": {
        name: "Retail Boxes",
        slug: "retail-boxes",
        description: "Eye-catching retail packaging designed to stand out on crowded store shelves.",
        longDescription: "The retail shelf is a battlefield. Win the fight for attention with our custom retail boxes. We combine structural integrity with striking graphics to make your product the one customers reach for.",
        benefits: ["Shelf impact", "Informative design", "Product protection", "Differentiation"],
        features: ["Hanging tabs", "Window cutouts", "Vibrant colors"]
    },
    "gift-boxes": {
        name: "Gift Boxes",
        slug: "gift-boxes",
        description: "Elegant gift boxes that make every occasion special and memorable.",
        longDescription: "Whether for corporate gifting, weddings, or special occasions, our gift boxes add a touch of magic. Customizable with ribbons, textures, and prints to create a truly personal unboxing moment.",
        benefits: ["Memorable unboxing", "High perceived value", "Versatile usage", "Sentimental connection"],
        features: ["Ribbon closures", "Texture paper", "Nested sets"]
    },
    "soap-boxes": {
        name: "Soap Boxes",
        slug: "soap-boxes",
        description: "Custom soap packaging that protects your product and preserves its scent.",
        longDescription: "Our soap boxes are designed to keep your handmade or manufactured soaps safe and aromatic. We offer window options to let customers see and smell the product while keeping it hygienic.",
        benefits: ["Scent preservation", "Product visibility (window)", "Protects against moisture", "Brand differentiation"],
        features: ["Kraft or Cardstock", "Die-cut windows", "Wraparound labels"]
    },
    "apparel-boxes": {
        name: "Apparel Boxes",
        slug: "apparel-boxes",
        description: "Stylish boxes for clothing, shirts, and fashion accessories.",
        longDescription: "Deliver fashion in style. Our apparel boxes are perfect for shirts, dresses, and accessories, providing a neat and professional presentation that speaks to the quality of your clothing line.",
        benefits: ["Professional presentation", "Prevents wrinkling", "Easy gifting", "Brand consistency"],
        features: ["Two-piece construction", "Tissue paper compatible", "Large surface area for branding"]
    },
    "cbd-packaging": {
        name: "CBD Packaging",
        slug: "cbd-packaging",
        description: "Secure and compliant packaging for CBD oils, tinctures, and edibles.",
        longDescription: "Compliance meets style. Our CBD packaging solutions are designed to meet industry regulations while ensuring your brand looks professional and trustworthy. Essential for oils, gummies, and topicals.",
        benefits: ["Child-resistant options", "Regulatory compliance", "Trustworthiness", "Product education"],
        features: ["Tuck boxes for tinctures", "Secure closures", "Instructional space"]
    }
};
