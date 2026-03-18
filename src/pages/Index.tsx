import Navbar from "@/components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="flex min-h-screen items-center justify-center pt-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-foreground">
            PDF <span className="text-accent">Text Extraction</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Extract text from your PDFs with ease.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
