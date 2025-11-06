// components/AdminFooter.tsx
export default function AdminFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gray-900 border-t border-gray-700 text-gray-400 text-sm py-4 mt-10">
      <div className="container mx-auto px-4 flex justify-center items-center">
        <p>&copy; {year} Rajrabidas.me all rights reserved</p>
      </div>
    </footer>
  );
}
