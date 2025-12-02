import SectionHeading from '@/components/SectionHeading';

export default function AboutPage() {
  return (
    <div className="py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <SectionHeading
          title="About GrowPlantGrow"
          subtitle="Your trusted source for botanical digital resources"
        />
        
        <div className="prose prose-lg max-w-none">
          <div className="bg-botanical-cream-100 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-serif text-botanical-green-800 mb-4">
              Our Mission
            </h2>
            <p className="text-botanical-green-700 mb-4 leading-relaxed">
              At GrowPlantGrow, we believe that everyone can develop a green thumb with the right knowledge and resources. 
              Our mission is to provide beautiful, comprehensive, and accessible digital products that help plant lovers 
              at every stage of their journey.
            </p>
            <p className="text-botanical-green-700 leading-relaxed">
              Whether you're a beginner looking to start your first houseplant collection or an experienced gardener 
              seeking to expand your knowledge, we create guides, workbooks, and printables that combine practical 
              information with beautiful botanical design.
            </p>
          </div>

          <div className="bg-botanical-green-50 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-serif text-botanical-green-800 mb-4">
              What We Offer
            </h2>
            <ul className="space-y-3 text-botanical-green-700">
              <li className="flex items-start">
                <span className="mr-2">📖</span>
                <span><strong>Comprehensive Guides:</strong> In-depth ebooks covering plant care, identification, and styling</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">📝</span>
                <span><strong>Interactive Workbooks:</strong> Printable resources to help you plan and track your plant journey</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🖨️</span>
                <span><strong>Beautiful Printables:</strong> High-quality PDFs ready to print and use in your home</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🌿</span>
                <span><strong>Expert Knowledge:</strong> Content created by plant enthusiasts with years of experience</span>
              </li>
            </ul>
          </div>

          <div className="bg-botanical-cream-100 rounded-lg p-8">
            <h2 className="text-2xl font-serif text-botanical-green-800 mb-4">
              Our Story
            </h2>
            <p className="text-botanical-green-700 leading-relaxed">
              GrowPlantGrow was born from a passion for plants and a desire to make botanical knowledge more accessible. 
              We noticed that many plant lovers struggled to find comprehensive, well-designed resources that combined 
              practical information with beautiful aesthetics.
            </p>
            <p className="text-botanical-green-700 leading-relaxed mt-4">
              Today, we're proud to be part of the Etsy ecosystem, connecting with plant enthusiasts worldwide and 
              helping them grow their plant knowledge alongside their plant collections.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

