import SectionHeading from '@/components/SectionHeading';

export default function FAQPage() {
  const faqs = [
    {
      question: "What file format are the products?",
      answer: "All our products are delivered as high-quality PDF files that you can download instantly after purchase. PDFs are compatible with all devices and can be printed at home or viewed digitally."
    },
    {
      question: "How do I access my purchase?",
      answer: "After completing your purchase through Lemon Squeezy, you'll receive an email with a download link. You can also access your purchases anytime through your account dashboard."
    },
    {
      question: "Can I print these products?",
      answer: "Yes! All our printables and guides are designed to be printed at home. We recommend using standard 8.5\" x 11\" paper, though some products may work well on other sizes. For best results, use a color printer."
    },
    {
      question: "Are these products physical or digital?",
      answer: "All products are digital downloads. You will not receive any physical items in the mail. This allows for instant access and the ability to print as many copies as you need for personal use."
    },
    {
      question: "Can I share these products with others?",
      answer: "Our products are for personal use only. You may print copies for your own use, but sharing digital files or reselling the products is not permitted. If you'd like to gift a product, please purchase a separate copy."
    },
    {
      question: "What if I have a problem with my purchase?",
      answer: "We want you to be completely satisfied! If you experience any issues with your download or have questions about a product, please contact us through our contact page and we'll be happy to help."
    },
    {
      question: "Do you offer refunds?",
      answer: "Due to the digital nature of our products, we generally don't offer refunds. However, if you experience technical issues or have concerns about your purchase, please reach out to us and we'll work to resolve the issue."
    },
    {
      question: "Are your products compatible with Etsy?",
      answer: "Yes! GrowPlantGrow is part of the Etsy ecosystem. You can find us on Etsy as well, and our products are designed to complement your Etsy shopping experience."
    }
  ];

  return (
    <div className="py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <SectionHeading
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about our products"
        />
        
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-botanical-cream-100 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-serif text-botanical-green-800 mb-3">
                {faq.question}
              </h3>
              <p className="text-botanical-green-700 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-botanical-green-50 rounded-lg p-8 text-center">
          <h3 className="text-xl font-serif text-botanical-green-800 mb-4">
            Still have questions?
          </h3>
          <p className="text-botanical-green-700 mb-4">
            We're here to help! Feel free to reach out through our contact page.
          </p>
          <a
            href="/contact"
            className="inline-block px-6 py-3 bg-botanical-green-600 text-botanical-cream-50 rounded-md hover:bg-botanical-green-700 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}

