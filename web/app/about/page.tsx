 "use client";
import { useRouter } from "next/navigation";
import React from "react";
import Image from "next/image";
import { assets } from "@/app/lib/assets";
import { site } from "@/app/lib/site";  
import Link from "next/dist/client/link";
import { services } from "@/app/lib/services";

const featured = [
  { id: "wedding-photography", label: "Wedding" },
  { id: "portrait-sessions", label: "Portrait" },
  { id: "event-coverage", label: "Events" },
];
export default function About() {
  return (
    <section >
      {/* HERO / ABOUT ME */}
      <section>       
         <h2 id="about-h" className="sec-title"  style={{textAlign: 'center' }}>About {site.owner}</h2>     
         <div className="about-intro">
            <div className="shrink-0">
              <Image
                src={assets.gerardPhoto} alt={`${site.owner}, photographer`}
                width={390}
                height={400}
                className="w-[350px] h-[350px] md:w-[420px] md:h-[400px] object-cover rounded-2xl shadow-lg"
              />
            </div>
          
            {/* Text */}
            <div className="about-intro-text">
              <h3 className="text-3xl md:text-4xl font-black leading-tight mt-2">
               Behind Every Photo, There&apos;s a Story
              </h3>
              
              <p style={{ marginTop: "1rem", color: "#D1D5DB", lineHeight: "2.5", fontSize: "0.900rem" }}>
                  I am a passionate photographer based in Burundi with over 8 years of
                  experience capturing authentic moments and stories through my lens.<br/>I believe every
                  photograph holds a unique narrative; whether it&apos;s a quiet portrait, a joyful
                  wedding, or a bustling event. My goal is to deliver timeless images that feel genuine,
                  emotional, and true to the moment.
              </p>

              {/* Stats */}
              <div className="flex gap-10 mt-6">
                <div>
                   <p className="text-[#FFC93C] font-black text-xl">15+ <span className="text-white text-sm font-normal">Weddings</span></p>
                </div>
                <div>
                  <p className="text-[#FFC93C] font-black text-xl">50+ <span className="text-white text-sm font-normal">Portraits</span></p>
                </div>
                <div>
                  <p className="text-[#FFC93C] font-black text-xl">30+ <span className="text-white text-sm font-normal">Events</span></p>
                </div>
              </div>
            </div>
          </div>
      </section>

      {/* WHAT I DO */}
      <section id="services" className="sec sec-band" aria-labelledby="services-h" >
        <div className="wrap">
            <h2 className="text-3xl font-black text-center">What I Do</h2>
          <div className="svc-grid">
            {featured.map((f) => {
              const s = services.find((x) => x.id === f.id);
              if (!s) return null;
              return (
                <Link key={f.id} className="svc-card" href={`/services#${f.id}`}>
                  <span className="svc-icon" aria-hidden="true"><i className={`fa-solid ${s.icon}`}></i></span>
                  <h3>{f.label}</h3>
                  <p>{s.short}</p>
                  <span className="svc-price">{s.from ? `From ${s.from}` : "Request a quote"}</span>
                </Link>
              );
            })}
          </div>
           <div className="svc-more"> 
             <Link className="btn-outline-dark" href="/services">View all services</Link>
           </div> 
        </div>
      </section>

      {/* WHY CHOOSE ME */}
      <section className="sec sec-band" style={{ margin: "2rem 1rem", padding: "2.5rem 1.5rem" }}>
        <h2 className="text-2xl font-black text-center text-[#FFC93C]">Why Choose Me</h2>
        <div className="grid md:grid-cols-3 gap-8 mt-6">
          <div className="flex gap-3">
            <span className="w-7 h-7 shrink-0 bg-[#FFC93C] text-[#0B1226] rounded-full flex items-center justify-center font-bold">✓</span>
            <div>
              <h4 className="font-bold">Professional Experience</h4>
              <p className="text-sm text-gray-300">Years of expertise crafting high-quality photography that tells your story.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="w-7 h-7 shrink-0 bg-[#FFC93C] text-[#0B1226] rounded-full flex items-center justify-center font-bold">✓</span>
            <div>
              <h4 className="font-bold">Personalized Approach</h4>
              <p className="text-sm text-gray-300">Tailored sessions to match your vision, style, and preferences.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="w-7 h-7 shrink-0 bg-[#FFC93C] text-[#0B1226] rounded-full flex items-center justify-center font-bold">✓</span>
            <div>
              <h4 className="font-bold">High-Quality Results</h4>
              <p className="text-sm text-gray-300">Carefully edited photos delivered in digital gallery with fast turnaround.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section text-align="center"  style={{textAlign: 'center' }}>
        <h3 className="text-xl font-black">Ready to Capture Your Story?</h3>
        <p className="text-sm mt-1">Let&apos;s book your next photoshoot and create memories that last forever.</p>
        <Link className="btn-green btn-lg mt-4" href="/book">Book a Session</Link>
      </section>
    </section>
  );
}