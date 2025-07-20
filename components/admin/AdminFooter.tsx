// components/AdminFooter.tsx
export default function AdminFooter() {
  return (
    <footer className="bg-gray-900 border-t border-gray-700 text-gray-400 text-sm py-4 mt-10">
      <div className="container mx-auto px-4 flex justify-between items-center flex-col sm:flex-row">
        <p className="mb-2 sm:mb-0">&copy; {new Date().getFullYear()} Admin Dashboard</p>
        {/* <p className="text-gray-500">Built with ❤️ using Next.js + Tailwind</p> */}
      </div>
    </footer>
  );
}
