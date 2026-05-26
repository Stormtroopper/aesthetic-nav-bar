import { useQuery } from "@apollo/client/react";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { GET_MOVIE } from "@/graphql/operations";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, MapPin } from "lucide-react";

interface Showtime {
  id: string;
  theatre: string;
  startsAt: string;
  price: number;
}
interface Movie {
  id: string;
  title: string;
  genre: string;
  duration: number;
  rating: number;
  poster: string;
  description: string;
  showtimes: Showtime[];
}

const formatTime = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

const MovieDetail = () => {
  const { id = "" } = useParams();
  const { data, loading, error } = useQuery<{ movie: Movie | null }>(GET_MOVIE, {
    variables: { id },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 pb-20 pt-24">
        {loading && <p className="text-muted-foreground">Loading…</p>}
        {error && <p className="text-destructive">{error.message}</p>}
        {data?.movie && (
          <article className="grid gap-10 md:grid-cols-[300px_1fr]">
            <img
              src={data.movie.poster}
              alt={data.movie.title}
              className="aspect-[2/3] w-full rounded-lg object-cover"
            />
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                {data.movie.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Badge className="bg-accent text-accent-foreground">
                  <Star className="mr-1 h-3 w-3" />
                  {data.movie.rating.toFixed(1)}
                </Badge>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" /> {data.movie.duration} min
                </span>
                <span className="text-sm text-muted-foreground">
                  {data.movie.genre}
                </span>
              </div>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                {data.movie.description}
              </p>

              <h2 className="mt-10 text-xl font-semibold text-foreground">
                Showtimes
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {data.movie.showtimes.map((s) => (
                  <Card
                    key={s.id}
                    className="flex items-center justify-between border-border bg-card p-4"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {formatTime(s.startsAt)}
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" /> {s.theatre}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        ${s.price.toFixed(2)} / seat
                      </p>
                    </div>
                    <Button
                      asChild
                      className="bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      <Link to={`/showtimes/${s.id}`}>Select seats</Link>
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          </article>
        )}
      </main>
    </div>
  );
};

export default MovieDetail;
