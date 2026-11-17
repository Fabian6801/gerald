export default function LocationMap() {
  return (
    <section style={{ padding: '40px 20px', textAlign: 'center' }}>
      <p>Gihanga, Burundi</p>

      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d214384.6420440431!2d29.26637841843142!3d-3.2099633109012022!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19c22ec95c2a7fbd%3A0x85652beb1355cb98!2sGihanga%2C%20Burundi!5e0!3m2!1sen!2ske!4v1794683081940!5m2!1sen!2ske"
        width="100%"
        height="400"
        style={{ border: 0, borderRadius: '12px' }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen>
      </iframe>

      <br />
      <a
        href="https://www.google.com/maps/search/?api=1&query=Gihanga+Burundi"
        target="_blank"
        style={{ display: 'inline-block', marginTop: '15px', padding: '10px 20px', background: '#000', color: '#fff', borderRadius: '8px', textDecoration: 'none' }}
      >
        Get Directions on Google Maps
      </a>
    </section>
  )
}