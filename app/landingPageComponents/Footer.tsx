function Footer() {
  return (
    <footer className="text-black py-4">
      <div className="container mx-auto text-center">
        <p className="text-lg font-semibold mb-4">Task Nest</p>
        <p className="mb-4">© {new Date().getFullYear()} Task Nest.</p>
      </div>
    </footer>
  );
}

export default Footer;
