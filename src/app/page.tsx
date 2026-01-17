import Hero from "@/components/Hero";
import DishSelector from "@/components/DishSelector";
import Testimonials from "@/components/Testimonials";
import Services from "@/components/Services";

export default function Home() {

  return (
    <>
      <Hero />

      <Services />

      {/* AI Bot Section */}
      <section id="menu" className="bg-gradient-to-b from-secondary/20 to-white py-24">
        <div className="container">
          <div className="glass rounded-[3rem] p-12 md:p-20 overflow-hidden relative border border-primary/10">
            <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
              <div>
                <span className="text-accent font-bold uppercase tracking-widest text-sm">Personalized Catering</span>
                <h2 className="text-5xl md:text-6xl font-bold text-primary mt-6 mb-8 leading-tight">
                  Create My <br />
                  <span className="text-gradient italic">Experience</span>
                </h2>
                <p className="text-xl text-foreground/70 mb-10 max-w-md leading-relaxed">
                  Curation at your fingertips. Partner with our AI Guide to design a bespoke slider package tailored to your exact tastes.
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
