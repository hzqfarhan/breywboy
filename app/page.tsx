import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Coffee, Star, MapPin, Clock, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicNavbar } from "@/components/layout/PublicNavbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background">
      <PublicNavbar />
      
      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-foreground font-medium text-sm border border-border">
              <Star className="w-4 h-4 fill-foreground" />
              <span className="uppercase tracking-wider text-xs">Parit Raja's Favourite</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold font-heading leading-[0.9] text-primary uppercase tracking-tight">
              Skip the queue,<br />sip sooner.
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Order your favourite coffee ahead of time. Freshly brewed and ready for pickup when you arrive.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/login">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-primary text-primary-foreground">
                  Order Now <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/menu">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full border-2 bg-transparent hover:bg-secondary text-foreground uppercase tracking-widest font-heading">
                  View Menu
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex-1 relative w-full max-w-lg aspect-square">
            {/* Logo Graphic representing Coffee */}
            <div className="absolute inset-0 bg-primary rounded-[3rem] rotate-3 opacity-90 shadow-2xl overflow-hidden flex items-center justify-center p-12">
               <img src="/assets/brey-this.png" alt="Breywboy" className="w-full h-auto drop-shadow-lg brightness-0 invert" />
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-border flex items-center gap-4 animate-bounce duration-5000">
              <div className="bg-secondary p-3 rounded-full flex items-center justify-center">
                <img src="/assets/brey-this.png" alt="" className="w-6 h-auto" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Order Status</p>
                <p className="font-bold text-foreground">Ready for pickup!</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-secondary py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-center mb-12 text-primary uppercase tracking-wide">Why Breywboy?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Clock className="w-6 h-6 text-foreground" />}
                title="FAST PICKUP"
                desc="Order ahead and skip the line. Your coffee is ready when you are."
              />
              <FeatureCard 
                icon={<Star className="w-6 h-6 text-foreground" />}
                title="REWARDS"
                desc="Earn points on every order. Redeem for free drinks and add-ons."
              />
              <FeatureCard 
                icon={<CreditCard className="w-6 h-6 text-foreground" />}
                title="EASY PAYMENT"
                desc="Pay securely online or at the counter. Fast and seamless."
              />
            </div>
          </div>
        </section>

        {/* Location Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-primary text-primary-foreground rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 space-y-4">
                <h2 className="text-4xl md:text-5xl font-heading font-bold uppercase tracking-wide">Find Us</h2>
                <p className="text-primary-foreground/80">Made warm, served fast right in the heart of Parit Raja.</p>
                <div className="flex items-center gap-3 pt-4">
                  <MapPin className="w-5 h-5 text-secondary" />
                  <span className="font-medium">Parit Raja, Johor</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-secondary" />
                  <span className="font-medium">Mon-Sun: 8:00 AM - 10:00 PM</span>
                </div>
              </div>
              <div className="w-full md:w-1/2 aspect-video bg-background/10 rounded-2xl flex items-center justify-center border border-primary-foreground/20">
                <MapPin className="w-12 h-12 text-secondary/50" />
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-background py-8 border-t text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} Breywboy. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-background p-8 rounded-3xl shadow-sm border border-border hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-6 border border-border">
        {icon}
      </div>
      <h3 className="text-xl font-bold font-heading mb-3 uppercase tracking-wide">{title}</h3>
      <p className="text-muted-foreground">{desc}</p>
    </div>
  );
}
