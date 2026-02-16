
export const DEFAULT_CATEGORY_TEMPLATE = [
    {
        id: 'hero',
        type: 'hero',
        title: 'Hero Section',
        content: {
            heading: 'Custom Packaging Solutions',
            subheading: 'Elevate your brand with premium custom boxes.',
            ctaText: 'Get a Quote',
            ctaLink: '/quote'
        }
    },
    {
        id: 'intro',
        type: 'intro',
        title: 'Introduction',
        content: {
            heading: 'Premium Custom Boxes for Your Brand',
            subheading: 'We provide high-quality packaging solutions tailored to your specific needs. From retail to shipping, we have you covered.',
        }
    },
    {
        id: 'product_grid',
        type: 'product_grid',
        title: 'Featured Products',
        content: {
            heading: 'Explore Our Range',
        }
    },
    {
        id: 'benefits',
        type: 'benefits',
        title: 'Why Choose Us',
        content: {
            heading: 'Why Choose Packaging Hippo?',
            items: [
                { title: 'Eco-Friendly Materials', desc: 'We use sustainable, biodegradable materials for all our packaging.' },
                { title: 'Free Design Support', desc: 'Get expert help with your packaging design at no extra cost.' },
                { title: 'Fast Turnaround', desc: 'Standard production time of 8-10 business days.' },
                { title: 'Competitive Pricing', desc: 'Wholesale prices with no hidden charges.' }
            ]
        }
    },
    {
        id: 'steps',
        type: 'steps',
        title: 'How It Works',
        content: {
            heading: 'Simple 3-Step Process',
            items: [
                { title: 'Choose Style', desc: 'Select the box style and dimensions that fit your product.' },
                { title: 'Design & Proof', desc: 'Upload your artwork or work with our designers. Approve the 3D proof.' },
                { title: 'Print & Ship', desc: 'We print your boxes and ship them directly to your doorstep.' }
            ]
        }
    },
    {
        id: 'faq',
        type: 'faq',
        title: 'FAQ Section',
        content: {
            heading: 'Frequently Asked Questions',
            items: [
                { q: 'What is the minimum order quantity?', a: 'Our MOQ starts at just 100 boxes.' },
                { q: 'Can I get a sample before ordering?', a: 'Yes, we offer both physical and digital samples.' },
                { q: 'Do you offer rush shipping?', a: 'Yes, expedited shipping options are available upon request.' }
            ]
        }
    },
    {
        id: 'cta',
        type: 'cta',
        title: 'Final CTA',
        content: {
            heading: 'Ready to Get Started?',
            text: 'Contact us today for a free custom quote.',
            btnText: 'Request Quote',
            btnLink: '/quote'
        }
    }
]

export const DEFAULT_PRODUCT_TEMPLATE = [
    {
        id: 'hero',
        type: 'hero',
        title: 'Product Hero',
        content: {
            heading: 'Custom Product Name',
            subheading: 'Durable, stylish, and fully customizable packaging.',
            ctaText: 'Get Custom Quote',
            ctaLink: '#quote-form'
        }
    },
    {
        id: 'intro',
        type: 'intro',
        title: 'Product Overview',
        content: {
            heading: 'About This Product',
            subheading: 'Detailed description of the product and its primary uses.',
        }
    },
    {
        id: 'features_bar',
        type: 'features_bar',
        title: 'Key Features',
        content: {
            heading: 'Product Features',
            items: [
                { icon: 'shield', title: 'Durable', subtitle: 'Protects contents' },
                { icon: 'palette', title: 'Customizable', subtitle: 'Full color printing' },
                { icon: 'leaf', title: 'Eco-Friendly', subtitle: 'Recyclable material' },
                { icon: 'truck', title: 'Free Shipping', subtitle: 'On all orders' }
            ]
        }
    },
    {
        id: 'gallery',
        type: 'gallery',
        title: 'Product Gallery',
        content: {
            heading: 'Gallery',
            images: []
        }
    },
    {
        id: 'ordering_process',
        type: 'ordering_process',
        title: 'How to Order',
        content: {
            heading: 'Ordering Process',
            text: '1. Select your specs.\n2. Get a quote.\n3. Approve design.\n4. Production & Delivery.'
        }
    },
    {
        id: 'faq',
        type: 'faq',
        title: 'Product FAQ',
        content: {
            heading: 'Common Questions',
            items: [
                { q: 'Can I print my logo inside the box?', a: 'Yes, we offer inside and outside printing.' },
                { q: 'What materials are available?', a: 'We offer Cardstock, Corrugated, Kraft, and Rigid materials.' }
            ]
        }
    },
    {
        id: 'related_products',
        type: 'product_grid',
        title: 'Related Products',
        content: {
            heading: 'You May Also Like'
        }
    }
]
