import SectionHeading from '@/components/SectionHeading';

export default function PoliciesPage() {
  return (
    <div className="py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <SectionHeading
          title="Policies"
          subtitle="Our policies and guidelines"
        />

        <div className="space-y-8">
          <div className="bg-botanical-cream-100 rounded-lg p-8">
            <h2 className="text-2xl font-serif text-botanical-green-800 mb-4">
              Privacy Policy
            </h2>
            <p className="text-botanical-green-700 mb-4 leading-relaxed">
              At GrowPlantGrow, we respect your privacy. We collect information that you provide
              directly to us, such as when you create an account, make a purchase, or contact us.
              We use this information to process your orders, communicate with you, and improve
              our services.
            </p>
            <p className="text-botanical-green-700 leading-relaxed">
              We do not sell your personal information to third parties. Your payment information
              is processed securely through our payment providers and is not stored on our servers.
            </p>
          </div>

          <div className="bg-botanical-green-50 rounded-lg p-8">
            <h2 className="text-2xl font-serif text-botanical-green-800 mb-4">
              Shipping Policy
            </h2>
            <p className="text-botanical-green-700 mb-4 leading-relaxed">
              All products on GrowPlantGrow are digital downloads. There is no physical shipping
              involved. Upon successful payment, you will receive an email with download links
              to access your purchased products.
            </p>
            <p className="text-botanical-green-700 leading-relaxed">
              Downloads are available immediately after purchase and remain accessible through your
              account dashboard.
            </p>
          </div>

          <div className="bg-botanical-cream-100 rounded-lg p-8">
            <h2 className="text-2xl font-serif text-botanical-green-800 mb-4">
              Refund Policy
            </h2>
            <p className="text-botanical-green-700 mb-4 leading-relaxed">
              Due to the digital nature of our products, we generally do not offer refunds once
              a product has been downloaded. However, if you experience technical issues or have
              concerns about your purchase, please contact us and we will work to resolve the issue.
            </p>
            <p className="text-botanical-green-700 leading-relaxed">
              Refund requests must be made within 7 days of purchase and before the product has been
              downloaded.
            </p>
          </div>

          <div className="bg-botanical-green-50 rounded-lg p-8">
            <h2 className="text-2xl font-serif text-botanical-green-800 mb-4">
              Copyright Policy
            </h2>
            <p className="text-botanical-green-700 leading-relaxed">
              All content on GrowPlantGrow, including but not limited to text, graphics, logos,
              images, and digital products, is the property of GrowPlantGrow and is protected by
              copyright laws. Unauthorized use, reproduction, or distribution of any content is
              strictly prohibited.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

