import Link from "next/link";
import Year from "./Year";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <strong>Gerard Photo Studio</strong>
          <p>Photography by Kim Gerard: weddings, portraits, fashion, commercial, travel and events.</p>
          <p>Follow along for new work and behind-the-scenes.</p>
        </div>

        <div>
          <h4>Quick links</h4>
          <ul>
            <li><Link href="/#top">Home</Link></li>
            <li><Link href="/#work">My work</Link></li>
            <li><Link href="/#gallery">Gallery</Link></li>
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/#about">About</Link></li>
            <li><Link href="/book">Book a session</Link></li>
          </ul>
        </div>

        <div>
          <h4>Contact</h4>
          <ul>
            <li>Phone: <a href="tel:+257 69270296"><span className="todo">+257 69270296</span></a></li>
            <li>WhatsApp: <a href="https://wa.me/25769270296"><span className="todo">Chat with us</span></a></li>
            <li>Email: <a href="mailto:mfuranzimagerard028@gmail.com"><span className="todo">mfuranzimagerard028@gmail.com</span></a></li>
            <li>Studio: <span className="todo">Gihanga, Burundi</span></li>
            <li><a href="https://www.google.com/maps/search/XXX+Commune+Gihanga,+Secteur,+Gihanga,+Burundi/@-3.1906,29.302,17z?hl=en&entry=ttu&g_ep=EgoyMDI2MTAxMy4wIKXMDSoASAFQAw%3D%3D"><span className="todo">Get directions (map link)</span></a></li>
          </ul>
        </div>

        <div>
          <h4>Studio hours</h4>
          <ul>
            <li><span className="todo">Mon to Fri: 9:00 to 18:00</span></li>
            <li><span className="todo">Sat: 10:00 to 16:00</span></li>
            <li><span className="todo">Sun: By appointment</span></li>
          </ul>
          <h4 style={{ marginTop: 18 }}>Follow</h4>
          <div className="social">
            <a href="#" className="ig" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
            <a href="#" className="fb" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
            <a href="#" className="tt" target="_blank" rel="noopener noreferrer" aria-label="TikTok"><i className="fa-brands fa-tiktok"></i></a>
            <a href="#" className="yt" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><i className="fa-brands fa-youtube"></i></a>
          </div> 
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; <Year /> Gerard Photo Studio. All photographs &copy; Kim Gerard. Please do not copy or reuse without permission.</span>
        <span><a href="#">Privacy policy</a> &middot; <a href="#">Terms &amp; licensing</a> &middot; <a href="#top">Back to top</a></span>
      </div>
    </footer>
  );
}