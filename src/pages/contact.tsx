import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function Contact() {
  return (
    <>
      <Navbar />
      <section className="form-and-map">
        <div className="contact-info">
          <address>
            <p>
              Email: <a href="mailto:musa@hiof.no">musa@hiof.no</a>
            </p>
            <p>
              Phone: <a href="tel:+4746514697">+47 46514697</a>
            </p>
            <p>
              <a href="https://github.com/Mucino11">Github</a>
            </p>
          </address>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d128083.37576875392!2d10.62031413134207!3d59.89392432039787!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46416e61f267f039%3A0x7e92605fd3231e9a!2sOslo!5e0!3m2!1sno!2sno!4v1724724692625!5m2!1sno!2sno"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <div className="contact-form">
          <form action="/submit-form" method="POST">
            <div>
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div>
              <label htmlFor="subject">Subject</label>
              <input type="text" id="subject" name="subject" required />
            </div>
            <div>
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" required></textarea>
            </div>
            <div>
              <button
                type="submit"
                className="button-dark"
                id="contact-form-button"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
}
