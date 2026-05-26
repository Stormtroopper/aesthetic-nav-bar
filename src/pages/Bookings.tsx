import { useQuery } from "@apollo/client/react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { GET_BOOKINGS } from "@/graphql/operations";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ticket } from "lucide-react";

interface Booking {
  id: string;
  movieTitle: string;
  theatre: string;
  startsAt: string;
  seats: string[];
  total: number;
  customerName: string;
  customerEmail: string;
  createdAt: string;
}

const Bookings = () => {
  const { data, loading } = useQuery<{ bookings: Booking[] }>(GET_BOOKINGS);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 pb-20 pt-24">
        <h1 className="text-3xl font-bold text-foreground">My Bookings</h1>

        {loading && <p className="mt-6 text-muted-foreground">Loading…</p>}

        {!loading && (data?.bookings.length ?? 0) === 0 && (
          <div className="mt-12 rounded-lg border border-dashed border-border p-12 text-center">
            <Ticket className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">No bookings yet.</p>
            <Button asChild className="mt-4 bg-accent text-accent-foreground">
              <Link to="/">Browse movies</Link>
            </Button>
          </div>
        )}

        <div className="mt-8 space-y-4">
          {data?.bookings.map((b) => (
            <Card
              key={b.id}
              className="flex items-center justify-between border-border bg-card p-5"
            >
              <div>
                <p className="font-semibold text-foreground">{b.movieTitle}</p>
                <p className="text-xs text-muted-foreground">
                  {b.theatre} · {new Date(b.startsAt).toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Seats: {b.seats.join(", ")} · {b.customerName}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-accent">
                  ${b.total.toFixed(2)}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  #{b.id.slice(-6)}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Bookings;
