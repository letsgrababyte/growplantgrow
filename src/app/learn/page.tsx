import Link from 'next/link';
import SectionHeading from '@/components/SectionHeading';
import Button from '@/components/Button';

export default function LearnPage() {
  const topics = [
    {
      title: 'Getting Started with Houseplants',
      description: 'Learn the basics of plant care, from choosing the right plants to understanding their needs.',
      icon: '🌱',
    },
    {
      title: 'Watering Guide',
      description: 'Master the art of watering - when, how much, and what type of water to use.',
      icon: '💧',
    },
    {
      title: 'Light Requirements',
      description: 'Understand different light conditions and which plants thrive in each environment.',
      icon: '☀️',
    },
    {
      title: 'Propagation Techniques',
      description: 'Learn how to propagate your plants and expand your collection.',
      icon: '✂️',
    },
    {
      title: 'Common Plant Problems',
      description: 'Identify and solve common issues like pests, diseases, and nutrient deficiencies.',
      icon: '🔍',
    },
    {
      title: 'Seasonal Care',
      description: 'Adapt your plant care routine for different seasons and climates.',
      icon: '🍂',
    },
  ];

  return (
    <div className="py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <SectionHeading
          title="Learn"
          subtitle="Expand your plant knowledge with our guides and resources"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {topics.map((topic, index) => (
            <div
              key={index}
              className="bg-botanical-cream-100 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-4">{topic.icon}</div>
              <h3 className="text-xl font-serif text-botanical-green-800 mb-3">
                {topic.title}
              </h3>
              <p className="text-botanical-green-700 mb-4">{topic.description}</p>
              <Button href="/shop" size="sm" variant="outline">
                View Guides
              </Button>
            </div>
          ))}
        </div>

        <div className="bg-botanical-green-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-serif text-botanical-green-800 mb-4">
            Looking for More Resources?
          </h2>
          <p className="text-botanical-green-700 mb-6">
            Browse our collection of comprehensive guides, workbooks, and printables designed
            to help you become a plant expert.
          </p>
          <Button href="/shop" size="lg">
            Shop Learning Resources
          </Button>
        </div>
      </div>
    </div>
  );
}

