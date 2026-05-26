import { useQuery } from "@apollo/client/react";
import { useEffect, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { GET_SHOWTIME } from "@/graphql/operations";
import { useAppDispatch, useAppSelector } from "@/store";
import { setShowtimeContext, toggleSeat } from "@/store/bookingSlice";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Seat {
  id: string;
  row: string;
  number: number;
  booked: boolean;
}
interface Showtime {
  id: string;
  theatre: string;
  startsAt: string;
  price: number;
  seats: Seat[];
}

const SeatSelection = () => {
  const { id = "" } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const booking = useAppSelector((s) => s.booking);
  const movieTitle = (location.state as { movieTitle?: string } | null)
    ?.movieTitle;

  const { data, loading, error } = useQuery<{ showtime: Showtime | null }>(
    GET_SHOWTIME,
    { variables: { id }, fetchPolicy: "network-only" },
  );

  useEffect(() => {
    if (data?.showtime) {
      dispatch(
        setShowtimeContext({
          showtimeId: data.showtime.id,
          movieTitle: movieTitle ?? booking.movieTitle ?? "Movie",
          theatre: data.showtime.theatre,
          startsAt: data.showtime.startsAt,
          price: data.showtime.price,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.showtime?.id]);

  const rows = useMemo(() => {
    if (!data?.showtime) return [];
    const grouped = new Map<string, Seat[]>();
    data.showtime.seats.forEach((s) => {
      if (!grouped.has(s.row)) grouped.set(s.row, []);
      grouped.get(s.row)!.push(s);
    });
    return Array.from(grouped.entries()).map(([row, seats]) => ({
      row,
      seats: seats.sort((a, b) => a.number - b.number),
    }));
  }, [data]);

  const total = booking.selectedSeatIds.length * booking.price;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 pb-20 pt-24">
        <h1 className="text-3xl font-bold text-foreground">
          Choose your <span className="text-accent">seats</span>
        </h1>
        {loading && <p className="mt-6 text-muted-foreground">Loading…</p>}
        {error && <p className="mt-6 text-destructive">{error.message}</p>}

        {data?.showtime && (
          <>
            <p className="mt-2 text-sm text-muted-foreground">
              {data.showtime.theatre} ·{" "}
              {new Date(data.showtime.startsAt).toLocaleString()}
            </p>

            <div className="mt-10 rounded-lg border border-border bg-card p-8">
              <div className="mx-auto mb-8 h-2 w-3/4 rounded-full bg-accent/30 shadow-[0_0_40px_hsl(var(--accent)/0.4)]" />
              <p className="mb-6 text-center text-xs uppercase tracking-widest text-muted-foreground">
                Screen
              </p>

              <div className="space-y-3">
                {rows.map(({ row, seats }) => (
                  <div key={row} className="flex items-center justify-center gap-2">
                    <span className="w-4 text-xs text-muted-foreground">
                      {row}
                    </span>
                    {seats.map((s) => {
                      const selected = booking.selectedSeatIds.includes(s.id);
                      return (
                        <button
                          key={s.id}
                          disabled={s.booked}
                          onClick={() =>
                            dispatch(
                              toggleSeat({
                                id: s.id,
                                label: `${s.row}${s.number}`,
                              }),
                            )
                          }
                          className={cn(
                            "h-8 w-8 rounded-md text-[10px] font-medium transition-all",
                            s.booked &&
                              "cursor-not-allowed bg-muted text-muted-foreground/40",
                            !s.booked &&
                              !selected &&
                              "bg-secondary text-secondary-foreground hover:bg-accent/30",
                            selected &&
                              "bg-accent text-accent-foreground shadow-[0_0_15px_hsl(var(--accent)/0.5)]",
                          )}
                          aria-label={`Seat ${row}${s.number}`}
                        >
                          {s.number}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-secondary" /> Available
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-accent" /> Selected
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-muted" /> Booked
                </span>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between rounded-lg border border-border bg-card p-5">
              <div>
                <p className="text-sm text-muted-foreground">
                  {booking.selectedSeatIds.length} seat
                  {booking.selectedSeatIds.length === 1 ? "" : "s"} selected
                  {booking.selectedSeatLabels.length > 0 &&
                    ` · ${booking.selectedSeatLabels.join(", ")}`}
                </p>
                <p className="text-2xl font-semibold text-foreground">
                  ${total.toFixed(2)}
                </p>
              </div>
              <Button
                disabled={booking.selectedSeatIds.length === 0}
                onClick={() => navigate("/checkout")}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Continue to checkout
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default SeatSelection;
