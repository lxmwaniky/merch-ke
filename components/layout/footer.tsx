export default function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-bold">Merch KE</h3>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Merch KE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
