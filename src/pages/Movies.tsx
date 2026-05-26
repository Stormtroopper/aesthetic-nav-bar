import { useQuery } from "@apollo/client/react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { GET_MOVIES } from "@/graphql/operations";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Clock } from "lucide-react";

interface Movie {
  id: string;
  title: string;
  genre: string;
  duration: number;
  rating: number;
  poster: string;
  description: string;
}

const Movies = () => {
  const { data, loading, error } = useQuery<{ movies: Movie[] }>(GET_MOVIES);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 pb-20 pt-24">
        <header className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Now <span className="text-accent">Showing</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Pick a movie, choose your seats, lock in the night.
          </p>
        </header>

        {error && (
          <p className="text-destructive">Failed to load movies: {error.message}</p>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading &&
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[420px] w-full rounded-lg" />
            ))}

          {data?.movies.map((m) => (
            <Link key={m.id} to={`/movies/${m.id}`} className="group">
              <Card className="overflow-hidden border-border bg-card transition-all duration-200 hover:-translate-y-1 hover:border-accent/50">
                <div className="relative aspect-[2/3] overflow-hidden bg-muted">
                  <img
                    src={m.poster}
                    alt={m.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <Badge className="absolute right-3 top-3 bg-accent text-accent-foreground">
                    <Star className="mr-1 h-3 w-3" /> {m.rating.toFixed(1)}
                  </Badge>
                </div>
                <CardContent className="space-y-2 p-4">
                  <h2 className="line-clamp-1 text-lg font-semibold text-foreground">
                    {m.title}
                  </h2>
                  <p className="text-xs text-muted-foreground">{m.genre}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {m.duration} min
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Movies;
