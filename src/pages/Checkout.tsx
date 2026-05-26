import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { CREATE_BOOKING, GET_BOOKINGS } from "@/graphql/operations";
import { useAppDispatch, useAppSelector } from "@/store";
import { clearBooking } from "@/store/bookingSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Checkout = () => {
  const booking = useAppSelector((s) => s.booking);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [createBooking, { loading }] = useMutation(CREATE_BOOKING, {
    refetchQueries: [{ query: GET_BOOKINGS }],
  });

  const total = booking.selectedSeatIds.length * booking.price;

  if (!booking.showtimeId || booking.selectedSeatIds.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="mx-auto max-w-2xl px-6 pt-24 text-center">
          <h1 className="text-2xl font-semibold text-foreground">
            Nothing to check out yet
          </h1>
          <p className="mt-2 text-muted-foreground">
            Pick a movie and some seats first.
          </p>
          <Button asChild className="mt-6 bg-accent text-accent-foreground">
            <Link to="/">Browse movies</Link>
          </Button>
        </main>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBooking({
        variables: {
          showtimeId: booking.showtimeId,
          seatIds: booking.selectedSeatIds,
          customerName: name,
          customerEmail: email,
        },
      });
      toast.success("Booking confirmed!");
      dispatch(clearBooking());
      navigate("/bookings");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Booking failed");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 pb-20 pt-24">
        <h1 className="text-3xl font-bold text-foreground">Checkout</h1>

        <div className="mt-8 grid gap-6 md:grid-cols-[1fr_320px]">
          <form
            onSubmit={onSubmit}
            className="space-y-5 rounded-lg border border-border bg-card p-6"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {loading ? "Confirming…" : `Pay $${total.toFixed(2)}`}
            </Button>
          </form>

          <aside className="h-fit space-y-3 rounded-lg border border-border bg-card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Order summary
            </h2>
            <div>
              <p className="font-semibold text-foreground">{booking.movieTitle}</p>
              <p className="text-xs text-muted-foreground">{booking.theatre}</p>
              <p className="text-xs text-muted-foreground">
                {booking.startsAt &&
                  new Date(booking.startsAt).toLocaleString()}
              </p>
            </div>
            <div className="border-t border-border pt-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Seats</span>
                <span className="text-foreground">
                  {booking.selectedSeatLabels.join(", ")}
                </span>
              </div>
              <div className="mt-1 flex justify-between">
                <span className="text-muted-foreground">
                  {booking.selectedSeatIds.length} × ${booking.price.toFixed(2)}
                </span>
                <span className="text-foreground">${total.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
              <span className="text-foreground">Total</span>
              <span className="text-accent">${total.toFixed(2)}</span>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
