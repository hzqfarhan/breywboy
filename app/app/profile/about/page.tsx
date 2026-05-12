import Link from "next/link";
import { ArrowLeft, Clock, Star, MapPin, CreditCard, Coffee } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col h-full bg-background min-h-screen pb-20">
      {/* Top Bar */}
      <header className="h-14 bg-background/95 backdrop-blur-md border-b flex items-center px-4 shrink-0 sticky top-0 z-50">
        <Link href="/app/profile" className="p-2 -ml-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-heading font-bold text-lg text-primary ml-2">About Breywboy</h1>
      </header>
      
      <main className="flex-1 overflow-y-auto">
        <section className="px-4 py-12 flex flex-col items-center gap-8 text-center">
          <div className="w-48 h-48 bg-secondary rounded-[2.5rem] rotate-3 shadow-xl overflow-hidden flex items-center justify-center p-8">
             <img src="/assets/brey-this.png" alt="Breywboy" className="w-full h-auto" />
          </div>
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-foreground font-medium text-sm border border-border">
              <Star className="w-4 h-4 fill-foreground" />
              <span className="uppercase tracking-wider text-xs">Parit Raja's Favourite</span>
            </div>
            <h1 className="text-4xl font-bold font-heading leading-tight text-primary uppercase tracking-tight">
              Skip the queue,<br />sip sooner.
            </h1>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              Order your favourite coffee ahead of time. Freshly brewed and ready for pickup when you arrive.
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="bg-secondary/50 py-8 px-4">
          <h2 className="text-xl font-heading font-bold text-center mb-6 text-primary uppercase tracking-wide">Why Breywboy?</h2>
          <div className="grid grid-cols-1 gap-4">
            <FeatureCard 
              icon={<Clock className="w-5 h-5 text-foreground" />}
              title="FAST PICKUP"
              desc="Order ahead and skip the line. Your coffee is ready when you are."
            />
            <FeatureCard 
              icon={<Star className="w-5 h-5 text-foreground" />}
              title="REWARDS"
              desc="Earn points on every order. Redeem for free drinks and add-ons."
            />
            <FeatureCard 
              icon={<CreditCard className="w-5 h-5 text-foreground" />}
              title="EASY PAYMENT"
              desc="Pay securely online or at the counter. Fast and seamless."
            />
          </div>
        </section>

        {/* Location Section */}
        <section className="py-8 px-4">
          <div className="bg-primary text-primary-foreground rounded-3xl p-6 shadow-md flex flex-col gap-6">
            <div className="space-y-3">
              <h2 className="text-2xl font-heading font-bold uppercase tracking-wide">Find Us</h2>
              <p className="text-primary-foreground/80 text-sm">Made warm, served fast right in the heart of Parit Raja.</p>
              <div className="flex items-center gap-3 pt-2">
                <MapPin className="w-4 h-4 text-secondary" />
                <span className="font-medium text-sm">Parit Raja, Johor</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-secondary" />
                <span className="font-medium text-sm">Mon-Sun: 8:00 AM - 10:00 PM</span>
              </div>
            </div>
            <div className="w-full aspect-video bg-background/10 rounded-2xl flex items-center justify-center border border-primary-foreground/20">
              <MapPin className="w-8 h-8 text-secondary/50" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-background p-5 rounded-2xl shadow-sm border border-border">
      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-3 border border-border">
        {icon}
      </div>
      <h3 className="text-lg font-bold font-heading mb-1 uppercase tracking-wide">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
