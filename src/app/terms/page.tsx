import SectionHeading from '@/components/SectionHeading';

export default function TermsPage() {
  return (
    <div className="py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <SectionHeading
          title="Terms & Conditions"
          subtitle="Please read our terms carefully"
        />

        <div className="prose prose-lg max-w-none bg-botanical-cream-100 rounded-lg p-8">
          <h2 className="text-2xl font-serif text-botanical-green-800 mb-4">
            Acceptance of Terms
          </h2>
          <p className="text-botanical-green-700 mb-6 leading-relaxed">
            By accessing and using GrowPlantGrow.com, you accept and agree to be bound by the terms
            and provision of this agreement. If you do not agree to abide by the above, please do not
            use this service.
          </p>

          <h2 className="text-2xl font-serif text-botanical-green-800 mb-4">
            Use License
          </h2>
          <p className="text-botanical-green-700 mb-6 leading-relaxed">
            Permission is granted to temporarily download one copy of the materials on GrowPlantGrow's
            website for personal, non-commercial transitory viewing only. This is the grant of a license,
            not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc list-inside text-botanical-green-700 mb-6 space-y-2">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose or for any public display</li>
            <li>Attempt to reverse engineer any software contained on GrowPlantGrow's website</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
          </ul>

          <h2 className="text-2xl font-serif text-botanical-green-800 mb-4">
            Digital Products
          </h2>
          <p className="text-botanical-green-700 mb-6 leading-relaxed">
            All digital products purchased from GrowPlantGrow are for personal use only. You may not
            redistribute, resell, or share these products without explicit written permission.
          </p>

          <h2 className="text-2xl font-serif text-botanical-green-800 mb-4">
            Disclaimer
          </h2>
          <p className="text-botanical-green-700 mb-6 leading-relaxed">
            The materials on GrowPlantGrow's website are provided on an 'as is' basis. GrowPlantGrow
            makes no warranties, expressed or implied, and hereby disclaims and negates all other
            warranties including, without limitation, implied warranties or conditions of merchantability,
            fitness for a particular purpose, or non-infringement of intellectual property or other
            violation of rights.
          </p>
        </div>
      </div>
    </div>
  );
}

