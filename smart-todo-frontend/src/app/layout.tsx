import "./globals.css"     
import Header from "@/components/Header"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Header />
        <div className="container mx-auto px-6 py-8">
          {children}
        </div>
      </body>
    </html>
  )
}
