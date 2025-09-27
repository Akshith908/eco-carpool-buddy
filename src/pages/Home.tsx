import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, MapPin, Leaf, Users, Clock, Shield } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Leaf,
      title: 'Eco-Friendly',
      description: 'Reduce carbon footprint by sharing rides with fellow commuters',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Connect with colleagues and build lasting relationships',
    },
    {
      icon: Clock,
      title: 'Time Flexible',
      description: 'Choose morning or evening rides that fit your schedule',
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'Direct contact through calls and WhatsApp messaging',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 eco-gradient opacity-10"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-primary/10 rounded-full">
            <Leaf className="h-5 w-5 text-primary" />
            <span className="text-primary font-medium">Sustainable Commuting</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
            Share Rides,{' '}
            <span className="text-primary">Save Planet</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Connect with fellow commuters, reduce costs, and make a positive impact on the environment 
            with our eco-friendly carpooling platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link to="/offer-ride">
                <Car className="mr-2 h-5 w-5" />
                Offer a Ride
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link to="/find-ride">
                <MapPin className="mr-2 h-5 w-5" />
                Find a Ride
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-secondary/20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Why Choose VCEVehichlePool?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join our community of environmentally conscious commuters and experience the benefits 
              of shared transportation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 border-border/50">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <Card className="nature-gradient p-8 text-center border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Ready to Start Your Eco Journey?
              </CardTitle>
              <CardDescription className="text-lg text-foreground mb-6">
                Join thousands of commuters making a difference, one ride at a time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/offer-ride">
                    Start Offering Rides
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link to="/find-ride">
                    Explore Available Rides
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;