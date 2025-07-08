import { Shield, Users, Award, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const stats = [
  { icon: Users, label: 'Expert Appraisers', value: '50+' },
  { icon: Award, label: 'Items Valued', value: '100K+' },
  { icon: TrendingUp, label: 'Accuracy Rate', value: '98%' },
  { icon: Shield, label: 'Years Experience', value: '15+' }
];

const team = [
  {
    name: 'Sarah Chen',
    role: 'Chief Appraiser',
    bio: 'Former Sotheby\'s specialist with 20+ years in fine art and collectibles.',
    image: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    name: 'Michael Rodriguez',
    role: 'Technology Director',
    bio: 'AI researcher focused on computer vision and machine learning applications.',
    image: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    name: 'Emma Thompson',
    role: 'Authentication Expert',
    bio: 'Certified gemologist and jewelry specialist with museum-quality expertise.',
    image: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=300'
  }
];

export default function About() {
  return (
    <div className="py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-6">
            About AssetAlyze
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We combine cutting-edge AI technology with expert knowledge to provide 
            the most accurate and reliable valuations in the collectibles industry.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat) => (
            <Card key={stat.label} className="text-center">
              <CardContent className="p-6">
                <stat.icon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Our Mission
          </h2>
          <div className="max-w-4xl mx-auto text-lg text-gray-600 leading-relaxed">
            <p className="mb-6">
              AssetAlyze was founded with a simple mission: to democratize professional 
              collectible valuations by making them accessible, accurate, and affordable 
              for everyone. Whether you're a seasoned collector, inheriting family heirlooms, 
              or discovering treasures at estate sales, we believe everyone deserves access 
              to expert-level valuations.
            </p>
            <p>
              Our platform combines the latest advances in artificial intelligence with 
              the expertise of certified appraisers and industry specialists. This unique 
              approach allows us to provide instant preliminary valuations while ensuring 
              the accuracy and reliability that only comes from human expertise.
            </p>
          </div>
        </div>

        {/* Team */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Meet Our Team
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {team.map((member) => (
              <Card key={member.name} className="text-center">
                <CardContent className="p-6">
                  <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}