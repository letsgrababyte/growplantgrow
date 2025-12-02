import SectionHeading from '@/components/SectionHeading';
import Button from '@/components/Button';

export default function ContactPage() {
  return (
    <div className="py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <SectionHeading
          title="Get in Touch"
          subtitle="We'd love to hear from you"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-botanical-cream-100 rounded-lg p-8">
            <h3 className="text-2xl font-serif text-botanical-green-800 mb-4">
              Contact Information
            </h3>
            <div className="space-y-4 text-botanical-green-700">
              <div>
                <p className="font-semibold mb-1">Email</p>
                <a
                  href="mailto:hello@growplantgrow.com"
                  className="text-botanical-green-600 hover:text-botanical-green-800 hover:underline"
                >
                  hello@growplantgrow.com
                </a>
              </div>
              <div>
                <p className="font-semibold mb-1">Etsy Shop</p>
                <a
                  href="https://etsy.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-botanical-green-600 hover:text-botanical-green-800 hover:underline"
                >
                  Visit our Etsy store
                </a>
              </div>
            </div>
          </div>

          <div className="bg-botanical-green-50 rounded-lg p-8">
            <h3 className="text-2xl font-serif text-botanical-green-800 mb-4">
              Response Time
            </h3>
            <p className="text-botanical-green-700 mb-4">
              We typically respond to inquiries within 24-48 hours during business days.
            </p>
            <p className="text-botanical-green-700">
              For urgent matters related to your purchase, please include your order number in your message.
            </p>
          </div>
        </div>

        <div className="bg-botanical-cream-100 rounded-lg p-8">
          <h3 className="text-2xl font-serif text-botanical-green-800 mb-6">
            Send us a Message
          </h3>
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-botanical-green-800 font-semibold mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-4 py-2 rounded-md border border-botanical-green-300 focus:outline-none focus:ring-2 focus:ring-botanical-green-500 text-botanical-green-900"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-botanical-green-800 font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-2 rounded-md border border-botanical-green-300 focus:outline-none focus:ring-2 focus:ring-botanical-green-500 text-botanical-green-900"
                required
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-botanical-green-800 font-semibold mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="w-full px-4 py-2 rounded-md border border-botanical-green-300 focus:outline-none focus:ring-2 focus:ring-botanical-green-500 text-botanical-green-900"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-botanical-green-800 font-semibold mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                className="w-full px-4 py-2 rounded-md border border-botanical-green-300 focus:outline-none focus:ring-2 focus:ring-botanical-green-500 text-botanical-green-900"
                required
              ></textarea>
            </div>
            <div>
              <Button type="submit" size="lg">
                Send Message
              </Button>
            </div>
          </form>
          <p className="mt-4 text-sm text-botanical-green-600">
            Note: This is a demo form. In production, you would connect this to your email service or form handler.
          </p>
        </div>
      </div>
    </div>
  );
}

