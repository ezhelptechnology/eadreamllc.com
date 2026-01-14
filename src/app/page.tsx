import Hero from "@/components/Hero";
import DishSelector from "@/components/DishSelector";

export default function Home() {
  return (
    <>
      <Hero />

      {/* Services Preview Section */}
      <section id="services" className="bg-white">
        <div className="container text-center">
          <div className="flex flex-col items-center gap-4 max-w-2xl mx-auto mb-16">
            <span className="text-accent font-bold uppercase tracking-widest text-xs">Our Expertise</span>
            <h2 className="text-4xl md:text-5xl text-primary">Signature Catering Experiences</h2>
            <div className="w-20 h-1 bg-secondary mt-2"></div>
            <p className="text-foreground/70 mt-4 leading-relaxed">
              From intimate gatherings to grand celebrations, we provide a full suite of catering services
              designed to exceed your expectations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Corporate Events', desc: 'Sleek, professional catering that reflects your brand\'s excellence.' },
              { title: 'Weddings', desc: 'Personalized menus that celebrate your unique love story.' },
              { title: 'Private Dinners', desc: 'An intimate culinary journey in the comfort of your home.' },
            ].map((service, i) => (
              <div key={i} className="glass p-12 rounded-[2rem] hover:shadow-2xl transition-all group">
                <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                  <span className="text-primary font-bold text-xl">{i + 1}</span>
                </div>
                <h3 className="text-2xl text-primary mb-4">{service.title}</h3>
                <p className="text-foreground/60 text-sm leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Bot Section */}
      <section id="menu" className="bg-secondary/20">
        <div className="container">
          <div className="glass rounded-[3rem] p-12 md:p-24 overflow-hidden relative">
            <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
              <div>
                <span className="text-accent font-bold uppercase tracking-widest text-xs">Taste the Future</span>
                <h2 className="text-4xl md:text-6xl text-primary mt-4 mb-6 leading-tight">
                  Design Your <br />
                  <span className="italic">Perfect Menu</span>
                </h2>
                <p className="text-lg text-foreground/70 mb-8 max-w-md">
                  Interact with our AI Culinary Guide to select your three favorite dishes.
                  Our team will then craft a bespoke full-course menu inspired by your choices.
                </p>

                {/* AI Chat Bot Component */}
                <div id="ai-chat-container">
                  <DishSelector />
                </div>
              </div>
              <div className="hidden md:block relative h-[600px] w-full">
                <div className="absolute inset-0 bg-primary/5 rounded-3xl overflow-hidden border border-primary/10 flex items-center justify-center">
                  <div className="text-accent/20 font-serif text-[200px] select-none opacity-50">EA</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
