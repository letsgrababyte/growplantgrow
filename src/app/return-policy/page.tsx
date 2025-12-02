import SectionHeading from '@/components/SectionHeading';

export default function ReturnPolicyPage() {
  return (
    <div className="py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <SectionHeading
          title="Return Policy"
          subtitle="Information about returns and refunds"
        />

        <div className="bg-botanical-cream-100 rounded-lg p-8">
          <h2 className="text-2xl font-serif text-botanical-green-800 mb-4">
            Digital Product Returns
          </h2>
          <p className="text-botanical-green-700 mb-6 leading-relaxed">
            Since all products sold on GrowPlantGrow are digital downloads, traditional returns
            are not applicable. However, we want you to be completely satisfied with your purchase.
          </p>

          <h2 className="text-2xl font-serif text-botanical-green-800 mb-4">
            Refund Eligibility
          </h2>
          <p className="text-botanical-green-700 mb-4 leading-relaxed">
            Refunds may be considered in the following circumstances:
          </p>
          <ul className="list-disc list-inside text-botanical-green-700 mb-6 space-y-2">
            <li>Technical issues preventing download or access to the product</li>
            <li>Product not as described</li>
            <li>Duplicate purchase made in error</li>
            <li>Request made within 7 days of purchase and before download</li>
          </ul>

          <h2 className="text-2xl font-serif text-botanical-green-800 mb-4">
            How to Request a Refund
          </h2>
          <p className="text-botanical-green-700 mb-4 leading-relaxed">
            To request a refund, please contact us through our{' '}
            <a href="/contact" className="text-botanical-green-600 hover:text-botanical-green-800 underline">
              contact page
            </a>
            {' '}with the following information:
          </p>
          <ul className="list-disc list-inside text-botanical-green-700 mb-6 space-y-2">
            <li>Order number or transaction ID</li>
            <li>Product name</li>
            <li>Reason for refund request</li>
            <li>Any relevant screenshots or details</li>
          </ul>

          <h2 className="text-2xl font-serif text-botanical-green-800 mb-4">
            Processing Time
          </h2>
          <p className="text-botanical-green-700 leading-relaxed">
            Refund requests are typically processed within 5-7 business days. Once approved,
            refunds will be issued to the original payment method used for the purchase.
          </p>
        </div>
      </div>
    </div>
  );
}

