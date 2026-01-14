import Hero from "@/components/Hero";
import DishSelector from "@/components/DishSelector";
import Testimonials from "@/components/Testimonials";
import { Briefcase, Heart, Users } from 'lucide-react';

export default function Home() {
  const services = [
    {
      title: 'Corporate Events',
      desc: 'Sleek, professional catering that reflects your brand\'s excellence and impresses your clients.',
      icon: Briefcase,
      color: 'from-blue-500/10 to-purple-500/10'
    },
    {
      title: 'Weddings',
      desc: 'Personalized menus that celebrate your unique love story with elegance and sophistication.',
      icon: Heart,
      color: 'from-pink-500/10 to-rose-500/10'
    },
    {
      title: 'Private Dinners',
      desc: 'An intimate culinary journey in the comfort of your home, crafted by our expert chefs.',
      icon: Users,
      color: 'from-amber-500/10 to-orange-500/10'
    },
  ];

  return (
    <>
      <Hero />

      {/* Services Preview Section - Enhanced */}
      <section id="services" className="bg-white py-24">
        <div className="container text-center">
          <div className="flex flex-col items-center gap-4 max-w-2xl mx-auto mb-20">
            <span className="text-accent font-bold uppercase tracking-widest text-sm">Our Expertise</span>
            <h2 className="text-5xl md:text-6xl font-bold text-primary">
              Signature Catering <span className="text-gradient">Experiences</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mt-2"></div>
            <p className="text-lg text-foreground/70 mt-6 leading-relaxed">
              From intimate gatherings to grand celebrations, we provide a full suite of catering services
              designed to exceed your expectations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {services.map((service, i) => {
              const Icon = service.icon;
              return (
                <div
                  key={i}
                  className="glass p-10 rounded-[2.5rem] hover:shadow-2xl transition-all group cursor-pointer border border-primary/10 hover:border-primary/30 hover:-translate-y-2"
                >
                  <div className={`w-20 h-20 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform shadow-lg`}>
                    <Icon size={36} className="text-primary" />
                  </div>
                  <h3 className="text-3xl font-bold text-primary mb-5">{service.title}</h3>
                  <p className="text-foreground/70 text-base leading-relaxed">{service.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Testimonials />

      {/* AI Bot Section */}
      <section id="menu" className="bg-gradient-to-b from-secondary/20 to-white py-24">
        <div className="container">
          <div className="glass rounded-[3rem] p-12 md:p-20 overflow-hidden relative border border-primary/10">
            <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
              <div>
                <span className="text-accent font-bold uppercase tracking-widest text-sm">Taste the Future</span>
                <h2 className="text-5xl md:text-6xl font-bold text-primary mt-6 mb-8 leading-tight">
                  Design Your <br />
                  <span className="text-gradient italic">Perfect Menu</span>
                </h2>
                <p className="text-xl text-foreground/70 mb-10 max-w-md leading-relaxed">
                  Interact with our AI Culinary Guide to select your three favorite dishes.
                  Our team will then craft a bespoke full-course menu inspired by your choices.
                </p>

                {/* AI Chat Bot Component */}
                <div id="ai-chat-container">
                  <DishSelector />
                </div>
              </div>
              <div className="hidden lg:block relative h-[600px] w-full">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl overflow-hidden border border-primary/10 flex items-center justify-center">
                  <div className="text-primary/10 font-serif text-[240px] select-none font-bold">EA</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
